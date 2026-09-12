/**
 * Country look. Recipe technique (PBR canvases, displaced mass, two
 * temperatures) — not Nintendo, not Rockstar, not a neon card field.
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

/** Soil + meadow. Olive, earth, dry straw — never electric green. */
export function grassMaps() {
  const size = 512;
  const h = new Float32Array(size * size);
  const alb = new Uint8ClampedArray(size * size * 4);
  const rgh = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const clump = fbm(u * 5.2, v * 5.2, 5);
    const dirt = fbm(u * 9.5 + 4, v * 9.5, 4);
    const blade = Math.pow(Math.abs(Math.sin((u * 48 + fbm(u * 3, v * 14, 2) * 2) * Math.PI)), 0.7);
    h[y * size + x] = blade * 0.45 + clump * 0.55;
    const soil = dirt > 0.62;
    const dry = clump < 0.38;
    let r, g, b;
    if (soil) {
      r = 92 + dirt * 28; g = 72 + dirt * 18; b = 48 + dirt * 10;
    } else if (dry) {
      r = 98 + blade * 20; g = 108 + blade * 18; b = 52 + blade * 8;
    } else {
      r = 52 + blade * 18; g = 118 + blade * 30; b = 46 + blade * 10;
    }
    const i = (y * size + x) * 4;
    alb[i] = r; alb[i + 1] = g; alb[i + 2] = b; alb[i + 3] = 255;
    const rk = soil ? 210 : 170 + blade * 40;
    rgh[i] = rk; rgh[i + 1] = rk; rgh[i + 2] = rk; rgh[i + 3] = 255;
  }
  const map = canvasTex(size, (data) => { data.set(alb); }, { srgb: true });
  map.repeat.set(42, 42);
  const roughnessMap = canvasTex(size, (data) => { data.set(rgh); });
  roughnessMap.repeat.set(42, 42);
  const normalMap = canvasTex(size, (data) => { data.set(heightToNormal(h, size, 2.1)); });
  normalMap.repeat.set(42, 42);
  return { map, roughnessMap, normalMap };
}

/** Soft cloud volume, far and thin. */
export function cloudCardTex() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  for (let i = 0; i < 8; i++) {
    const x = 64 + (i % 4) * 36, y = 108 + Math.floor(i / 4) * 26;
    const g = ctx.createRadialGradient(x, y, 3, x, y, 46 + (i % 3) * 8);
    g.addColorStop(0, 'rgba(255,252,246,0.55)');
    g.addColorStop(0.5, 'rgba(236,240,246,0.22)');
    g.addColorStop(1, 'rgba(236,240,246,0)');
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
  const geo = new THREE.PlaneGeometry(140, 48);
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true,
  });
  const g = new THREE.Group();
  for (let n = 0; n < 6; n++) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(-260 + n * 90, 120 + (n % 3) * 16, -380 - (n % 4) * 50);
    m.rotation.y = 0.1 * (n % 3 - 1);
    m.scale.setScalar(1.2 + (n % 3) * 0.2);
    g.add(m);
  }
  return g;
}

/**
 * Mountain mass with strata. Smooth spines, rock bands, cool distance —
 * a wall of country, not a blue pancake and not shattered glass.
 */
export function makeRidgeMesh(width, depth, segW, segD, height, color, yFn, { lit = true } = {}) {
  const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const base = new THREE.Color(color);
  const band = new THREE.Color(0x4A463C);
  const high = new THREE.Color(0x7A8494);
  const shade = new THREE.Color(0x2A2E32);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getY(i);
    const nx = x / width, nz = z / depth;
    const h = yFn(nx, nz, height);
    pos.setZ(i, h);
    const t = THREE.MathUtils.clamp(h / Math.max(0.001, height), 0, 1);
    const strata = ((Math.sin(t * 18 + nx * 6) * 0.5 + 0.5) > 0.55) ? 1 : 0;
    const cc = base.clone()
      .lerp(band, strata * 0.28 * (1 - t))
      .lerp(high, t * 0.35)
      .lerp(shade, 0.22 * (1 - t) + Math.max(0, nz) * 0.12);
    col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const mat = lit
    ? new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true })
    : new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = lit;
  mesh.receiveShadow = lit;
  return mesh;
}

/** Matte hide: the sky as a faint reflection, never a chrome balloon. */
export function bindHeroEnv(root, env, intensity = 0.18) {
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
