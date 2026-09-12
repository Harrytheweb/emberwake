/**
 * Meadow look helpers. Technique from the recipe (PBR canvases, cutout cards,
 * displaced terrain, two-temperature light, a cheap display-space grade) —
 * not copied from any reference game.
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

/** Electric meadow: vertical blades, sunlit clumps, cool hollows. */
export function grassMaps() {
  const size = 512;
  const h = new Float32Array(size * size);
  const alb = new Uint8ClampedArray(size * size * 4);
  const rgh = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const clump = fbm(u * 6.5, v * 6.5, 5);
    const streak = fbm(u * 3.2, v * 22, 3);
    const blade = Math.pow(Math.abs(Math.sin((u * 110 + streak * 3.4) * Math.PI)), 0.55);
    const grit = fbm(u * 28, v * 28, 3);
    h[y * size + x] = blade * 0.62 + clump * 0.38;
    const hot = clump > 0.48;
    const r = hot ? 28 + blade * 22 : 12 + blade * 16;
    const g = hot ? 198 + blade * 48 : 118 + blade * 36;
    const b = hot ? 22 + grit * 14 : 18 + grit * 10;
    const i = (y * size + x) * 4;
    alb[i] = r; alb[i + 1] = g; alb[i + 2] = b; alb[i + 3] = 255;
    const rk = 155 + blade * 70;
    rgh[i] = rk; rgh[i + 1] = rk; rgh[i + 2] = rk; rgh[i + 3] = 255;
  }
  const map = canvasTex(size, (data) => { data.set(alb); }, { srgb: true });
  map.repeat.set(56, 56);
  const roughnessMap = canvasTex(size, (data) => { data.set(rgh); });
  roughnessMap.repeat.set(56, 56);
  const normalMap = canvasTex(size, (data) => { data.set(heightToNormal(h, size, 3.4)); });
  normalMap.repeat.set(56, 56);
  return { map, roughnessMap, normalMap };
}

/** Alpha blade card — recipe-style cutout density, our own strokes. */
export function grassCardTex() {
  const w = 160, h = 220;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 16; i++) {
    const x = 14 + (i / 15) * 132 + (noise2(i, 2) - 0.5) * 12;
    const top = 6 + noise2(i, 5) * 36;
    const grd = ctx.createLinearGradient(x, h, x, top);
    grd.addColorStop(0, '#145218');
    grd.addColorStop(0.4, i % 2 ? '#2a9a26' : '#3ec12a');
    grd.addColorStop(1, '#8aea4a');
    ctx.strokeStyle = grd;
    ctx.lineWidth = 2.4 + (i % 3) * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, h - 2);
    ctx.quadraticCurveTo(x + (i % 2 ? 8 : -9), h * 0.48, x + (noise2(i, 8) - 0.5) * 16, top);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function placeGrassCards(count, around, radius, getY, { scale = 1, seed = 0 } = {}) {
  const tex = grassCardTex();
  const geo = new THREE.PlaneGeometry(0.48, 0.62);
  const mat = new THREE.MeshStandardMaterial({
    map: tex, transparent: true, alphaTest: 0.26, side: THREE.DoubleSide,
    roughness: 0.78, metalness: 0, color: 0xffffff,
  });
  mat.name = 'foliage';
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const dummy = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + noise2(i + seed, 1) * 0.5;
    const r = 1.6 + Math.sqrt(noise2(i + seed, 3)) * radius;
    const x = around.x + Math.cos(a) * r;
    const z = around.z + Math.sin(a) * r;
    dummy.position.set(x, (getY ? getY(x, z) : around.y) + 0.28 * scale, z);
    dummy.rotation.set(0, a + Math.PI / 2, (noise2(i, 7) - 0.5) * 0.18);
    dummy.scale.setScalar((0.85 + noise2(i, 9) * 0.85) * scale);
    dummy.updateMatrix();
    inst.setMatrixAt(n++, dummy.matrix);
  }
  inst.count = n;
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

/** Distant oak cards — one draw, our own silhouette, not a copied sprite. */
export function treeCardTex() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  ctx.fillStyle = '#3A2A22';
  ctx.fillRect(118, 150, 20, 96);
  ctx.beginPath();
  ctx.moveTo(110, 168);
  ctx.lineTo(72, 118);
  ctx.lineTo(118, 148);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(146, 168);
  ctx.lineTo(188, 122);
  ctx.lineTo(138, 148);
  ctx.fill();
  const blobs = [
    [128, 96, 78, '#1f5a22'], [88, 108, 52, '#2a7a28'], [172, 104, 56, '#3a9a2e'],
    [118, 62, 48, '#2f6b2a'], [150, 70, 42, '#247020'], [100, 78, 36, '#1a5a22'],
  ];
  for (const [x, y, r, col] of blobs) {
    const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.25, 4, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(20,70,28,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function placeTreeCards(count, getY) {
  const tex = treeCardTex();
  const geo = new THREE.PlaneGeometry(7.4, 8.6);
  const mat = new THREE.MeshStandardMaterial({
    map: tex, transparent: true, alphaTest: 0.32, side: THREE.DoubleSide,
    roughness: 0.9, metalness: 0, color: 0xffffff,
  });
  mat.name = 'foliage';
  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const dummy = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const side = i % 2 ? 1 : -1;
    const x = side * (70 + noise2(i, 2) * 110);
    const z = -40 + noise2(i, 4) * 160;
    if (Math.abs(x) < 36) continue;
    dummy.position.set(x, (getY ? getY(x, z) : 0) + 4.1, z);
    dummy.rotation.set(0, noise2(i, 6) * Math.PI, 0);
    dummy.scale.setScalar(0.85 + noise2(i, 8) * 0.7);
    dummy.updateMatrix();
    inst.setMatrixAt(n++, dummy.matrix);
  }
  inst.count = n;
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

/**
 * Alpine ridge. Lit faces stay blue-grey because the albedo is kept dark and
 * far layers ignore the key (MeshBasic) so ACES cannot snow them.
 */
export function makeRidgeMesh(width, depth, segW, segD, height, color, yFn, { lit = true } = {}) {
  const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color(color);
  const shade = new THREE.Color(0x1A2836);
  const cool = new THREE.Color(0x4A6580);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getY(i);
    const nx = x / width, nz = z / depth;
    const h = yFn(nx, nz, height);
    pos.setZ(i, h);
    const t = THREE.MathUtils.clamp(h / height, 0, 1);
    const cc = c.clone()
      .lerp(shade, 0.42 * (1 - t) + Math.max(0, nz) * 0.18)
      .lerp(cool, t * 0.22);
    col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const mat = lit
    ? new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true })
    : new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = lit;
  mesh.receiveShadow = lit;
  return mesh;
}

export function cloudCardTex() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  for (let i = 0; i < 8; i++) {
    const x = 64 + (i % 4) * 36, y = 108 + Math.floor(i / 4) * 26;
    const g = ctx.createRadialGradient(x, y, 3, x, y, 46 + (i % 3) * 8);
    g.addColorStop(0, 'rgba(255,255,255,0.78)');
    g.addColorStop(0.5, 'rgba(236,244,252,0.38)');
    g.addColorStop(1, 'rgba(236,244,252,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 54, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function placeCloudCards() {
  const tex = cloudCardTex();
  const geo = new THREE.PlaneGeometry(110, 42);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true,
  });
  const g = new THREE.Group();
  for (let n = 0; n < 9; n++) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(-280 + n * 78, 108 + (n % 3) * 22, -340 - (n % 5) * 70);
    m.rotation.y = 0.12 * (n % 3 - 1);
    m.scale.setScalar(1.15 + (n % 3) * 0.28);
    g.add(m);
  }
  return g;
}

/**
 * Display-space pastoral grade (after ACES). Lifts meadow green and sky blue
 * without a global milk filter — warehouse technique, our own weights.
 */
export function pastoralGrade() {
  return {
    uniforms: { tDiffuse: { value: null } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `
      uniform sampler2D tDiffuse; varying vec2 vUv;
      void main(){
        vec3 col = texture2D(tDiffuse, vUv).rgb;
        float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
        float green = smoothstep(0.10, 0.48, col.g) * (1.0 - smoothstep(0.62, 0.96, l));
        col.g = mix(col.g, min(1.0, col.g * 1.16), green * 0.62);
        col.r = mix(col.r, col.r * 0.92, green * 0.4);
        float sky = smoothstep(0.52, 0.90, l) * smoothstep(0.14, -0.02, col.g - col.b);
        col.b = mix(col.b, min(1.0, col.b * 1.22), sky * 0.78);
        col.g = mix(col.g, col.g * 0.96, sky * 0.28);
        col.r = mix(col.r, col.r * 0.84, sky * 0.5);
        vec2 c = vUv - 0.5;
        float v = smoothstep(0.94, 0.26, dot(c, c) * 2.05);
        col *= mix(1.0, v, 0.18);
        gl_FragColor = vec4(col, 1.0);
      }`,
  };
}

/** Point hide materials at the sky PMREM so the hero actually catches light. */
export function bindHeroEnv(root, env, intensity = 0.42) {
  if (!root || !env) return;
  root.traverse((o) => {
    const mats = o.isMesh ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      if (!m || !m.isMeshStandardMaterial) continue;
      m.envMap = env;
      m.envMapIntensity = intensity;
    }
  });
}
