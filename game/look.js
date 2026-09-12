/**
 * Meadow look helpers. Technique from the recipe (PBR canvases, cutout cards,
 * displaced terrain) — not copied from any reference game.
 */
import * as THREE from 'three';

function noise2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function fbm(x, y, oct = 5) {
  let a = 1, f = 1, s = 0, n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * noise2(x * f, y * f);
    n += a;
    a *= 0.5;
    f *= 2.05;
  }
  return s / n;
}

function canvasTex(size, paint, { wrap = true, srgb = false } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  paint(img.data, size);
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  if (wrap) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  }
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function heightToNormal(h, size, strength) {
  const out = new Uint8ClampedArray(size * size * 4);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
    const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const len = Math.hypot(dx, dy, 1);
    const i = (y * size + x) * 4;
    out[i] = ((-dx / len) * 0.5 + 0.5) * 255;
    out[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
    out[i + 2] = (1 / len) * 255;
    out[i + 3] = 255;
  }
  return out;
}

/** Photographic grass: vertical blades, clump darkening, grit. */
export function grassMaps() {
  const size = 512;
  const h = new Float32Array(size * size);
  const alb = new Uint8ClampedArray(size * size * 4);
  const rgh = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const clump = fbm(u * 7, v * 7, 4);
    const blade = Math.pow(Math.abs(Math.sin((u * 90 + fbm(u * 4, v * 18, 2) * 2) * Math.PI)), 0.65);
    const grit = fbm(u * 22, v * 22, 3);
    h[y * size + x] = blade * 0.7 + clump * 0.3;
    const hot = clump > 0.55;
    const r = hot ? 36 + blade * 28 : 18 + blade * 22;
    const g = hot ? 190 + blade * 50 : 110 + blade * 40;
    const b = hot ? 28 + grit * 18 : 22 + grit * 12;
    const i = (y * size + x) * 4;
    alb[i] = r; alb[i + 1] = g; alb[i + 2] = b; alb[i + 3] = 255;
    const rk = 180 + blade * 50;
    rgh[i] = rk; rgh[i + 1] = rk; rgh[i + 2] = rk; rgh[i + 3] = 255;
  }
  const map = canvasTex(size, (data) => { data.set(alb); }, { srgb: true });
  map.repeat.set(70, 70);
  const roughnessMap = canvasTex(size, (data) => { data.set(rgh); });
  roughnessMap.repeat.set(70, 70);
  const normalMap = canvasTex(size, (data) => { data.set(heightToNormal(h, size, 2.8)); });
  normalMap.repeat.set(70, 70);
  return { map, roughnessMap, normalMap };
}

/** Alpha blade card — Drive-style cutout density, our own strokes. */
export function grassCardTex() {
  const w = 128, h = 192;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 11; i++) {
    const x = 16 + (i / 10) * 96 + (noise2(i, 2) - 0.5) * 10;
    const top = 8 + noise2(i, 5) * 30;
    const grd = ctx.createLinearGradient(x, h, x, top);
    grd.addColorStop(0, '#1a6e20');
    grd.addColorStop(0.45, i % 2 ? '#2f9a28' : '#3ec12a');
    grd.addColorStop(1, '#7ae04a');
    ctx.strokeStyle = grd;
    ctx.lineWidth = 2.2 + (i % 3) * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, h - 2);
    ctx.quadraticCurveTo(x + (i % 2 ? 6 : -7), h * 0.45, x + (noise2(i, 8) - 0.5) * 14, top);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function placeGrassCards(count, around, radius, getY) {
  const tex = grassCardTex();
  const geo = new THREE.PlaneGeometry(0.42, 0.48);
  const mat = new THREE.MeshStandardMaterial({
    map: tex, transparent: true, alphaTest: 0.28, side: THREE.DoubleSide,
    roughness: 0.82, metalness: 0, color: 0xffffff,
  });
  mat.name = 'foliage';
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const dummy = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + noise2(i, 1) * 0.4;
    const r = 2 + Math.sqrt(noise2(i, 3)) * radius;
    const x = around.x + Math.cos(a) * r;
    const z = around.z + Math.sin(a) * r;
    dummy.position.set(x, (getY ? getY(x, z) : around.y) + 0.22, z);
    dummy.rotation.set(0, a + Math.PI / 2, (noise2(i, 7) - 0.5) * 0.15);
    dummy.scale.setScalar(0.75 + noise2(i, 9) * 0.7);
    dummy.updateMatrix();
    inst.setMatrixAt(n++, dummy.matrix);
  }
  inst.count = n;
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

export function makeRidgeMesh(width, depth, segW, segD, height, color, yFn) { // color is linear-ish hex
  const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color(color);
  const shade = new THREE.Color(0x3A4A58);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getY(i);
    const nx = x / width, nz = z / depth;
    const h = yFn(nx, nz, height);
    pos.setZ(i, h);
    const t = THREE.MathUtils.clamp(h / height, 0, 1);
    const cc = c.clone().lerp(shade, 0.28 * (1 - t) + nz * 0.22);
    col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.94, metalness: 0, vertexColors: true, flatShading: false,
  });
  mat.name = 'stone';
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function cloudCardTex() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  for (let i = 0; i < 7; i++) {
    const x = 70 + (i % 4) * 32, y = 110 + Math.floor(i / 4) * 28;
    const g = ctx.createRadialGradient(x, y, 4, x, y, 48 + (i % 3) * 10);
    g.addColorStop(0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.55, 'rgba(244,247,250,0.45)');
    g.addColorStop(1, 'rgba(244,247,250,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 56, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function placeCloudCards() {
  const tex = cloudCardTex();
  const geo = new THREE.PlaneGeometry(80, 36);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true,
  });
  const g = new THREE.Group();
  for (let n = 0; n < 7; n++) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(-220 + n * 70, 95 + (n % 3) * 18, -280 - (n % 4) * 60);
    m.rotation.y = 0.15 * (n % 3 - 1);
    m.scale.setScalar(1.1 + (n % 3) * 0.25);
    g.add(m);
  }
  return g;
}
