import * as THREE from 'three';
import { ASSET, bakeStatic } from './assetlib.js?v=202609121011';
import { createRig } from './rig.js?v=202609121011';
import { Input } from './input.js?v=202609121011';
import { createAudio } from './audio.js?v=202609121011';
import { applySurfaces } from './surfaces.js?v=202609121011';
import { grassMaps, placeGrassCards, placeTreeCards, makeRidgeMesh, placeCloudCards, fbm, pastoralGrade, bindHeroEnv } from './look.js?v=202609121011';

const canvas = document.getElementById('c');
const loadEl = document.getElementById('load');
const barf = document.getElementById('barf');
const loadmsg = document.getElementById('loadmsg');
const startEl = document.getElementById('start');
const overEl = document.getElementById('over');
const hudEl = document.getElementById('hud');
const touchEl = document.getElementById('touch');

const BOOK = [
  { id: 'field_rabbit', file: './assets/field_rabbit.js', title: 'Rabbit', pts: 10, hp: 1, shy: 14, drop: { meat: 1, hide: 1, feather: 0 }, biome: 'meadow' },
  { id: 'brown_hare', file: './assets/brown_hare.js', title: 'Hare', pts: 14, hp: 1, shy: 16, drop: { meat: 1, hide: 1, feather: 0 }, biome: 'meadow' },
  { id: 'tree_squirrel', file: './assets/tree_squirrel.js', title: 'Squirrel', pts: 8, hp: 1, shy: 10, drop: { meat: 0, hide: 1, feather: 0 }, biome: 'wood' },
  { id: 'wood_pigeon', file: './assets/wood_pigeon.js', title: 'Pigeon', pts: 12, hp: 1, shy: 15, drop: { meat: 1, hide: 0, feather: 2 }, biome: 'wood' },
  { id: 'field_pheasant', file: './assets/field_pheasant.js', title: 'Pheasant', pts: 20, hp: 1, shy: 18, drop: { meat: 1, hide: 0, feather: 2 }, biome: 'wood' },
  { id: 'river_mallard', file: './assets/river_mallard.js', title: 'Mallard', pts: 18, hp: 1, shy: 14, drop: { meat: 1, hide: 0, feather: 2 }, biome: 'shore' },
  { id: 'grey_goose', file: './assets/grey_goose.js', title: 'Goose', pts: 24, hp: 2, shy: 16, drop: { meat: 2, hide: 0, feather: 3 }, biome: 'shore' },
  { id: 'red_fox', file: './assets/red_fox.js', title: 'Fox', pts: 35, hp: 2, shy: 20, drop: { meat: 1, hide: 2, feather: 0 }, biome: 'meadow' },
  { id: 'earth_badger', file: './assets/earth_badger.js', title: 'Badger', pts: 30, hp: 2, shy: 12, drop: { meat: 2, hide: 2, feather: 0 }, biome: 'wood' },
  { id: 'roe_doe', file: './assets/roe_doe.js', title: 'Roe', pts: 40, hp: 3, shy: 22, drop: { meat: 3, hide: 2, feather: 0 }, biome: 'meadow' },
  { id: 'reed_heron', file: './assets/reed_heron.js', title: 'Heron', pts: 36, hp: 2, shy: 20, drop: { meat: 2, hide: 0, feather: 3 }, biome: 'shore' },
  { id: 'wild_sheep', file: './assets/wild_sheep.js', title: 'Wild sheep', pts: 38, hp: 3, shy: 14, drop: { meat: 3, hide: 2, feather: 0 }, biome: 'hill' },
  { id: 'mountain_goat', file: './assets/mountain_goat.js', title: 'Goat', pts: 44, hp: 3, shy: 18, drop: { meat: 3, hide: 2, feather: 0 }, biome: 'hill' },
  { id: 'red_stag', file: './assets/red_stag.js', title: 'Stag', pts: 60, hp: 4, shy: 24, drop: { meat: 4, hide: 3, feather: 0 }, biome: 'meadow' },
  { id: 'wild_boar', file: './assets/wild_boar.js', title: 'Boar', pts: 55, hp: 4, shy: 12, drop: { meat: 4, hide: 2, feather: 0 }, biome: 'wood', charge: true },
  { id: 'grey_wolf', file: './assets/grey_wolf.js', title: 'Wolf', pts: 70, hp: 4, shy: 16, drop: { meat: 3, hide: 3, feather: 0 }, biome: 'hill', charge: true },
  { id: 'field_lynx', file: './assets/field_lynx.js', title: 'Lynx', pts: 75, hp: 3, shy: 22, drop: { meat: 2, hide: 3, feather: 0 }, biome: 'wood' },
  { id: 'brown_bear', file: './assets/brown_bear.js', title: 'Bear', pts: 90, hp: 6, shy: 10, drop: { meat: 5, hide: 4, feather: 0 }, biome: 'hill', charge: true },
  { id: 'meadow_elk', file: './assets/meadow_elk.js', title: 'Elk', pts: 85, hp: 5, shy: 26, drop: { meat: 5, hide: 3, feather: 0 }, biome: 'hill' },
  { id: 'wild_aurochs', file: './assets/wild_aurochs.js', title: 'Aurochs', pts: 110, hp: 7, shy: 18, drop: { meat: 6, hide: 4, feather: 0 }, biome: 'meadow', charge: true },
];

const STATE = {
  running: false, over: false, score: 0, meat: 0, hide: 0, feather: 0,
  taken: new Set(), bow: 1, quiver: 24, mounted: true, sneak: false,
  yaw: Math.PI * 0.88, pitch: 0.04, speed: 0, airborne: 0, hop: 0, gaitPhase: 0, camMode: 0,
};
window.__GAME__ = { pos: [4, 36], fps: 60, speed: 0, score: 0, over: false, draws: 0, tris: 0 };
window.__READY__ = false;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
renderer.setSize(innerWidth, innerHeight, false);
renderer.info.autoReset = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.12, 2400);
const input = new Input(canvas);
const audio = createAudio();

let rig, horse, hunter, bowObj, horsePos, hunterPos;
const animals = [];
const fences = [];
const arrows = [];
const dust = [];
let stallPos = new THREE.Vector3(6, 0, 4);
const horsePosV = new THREE.Vector3(4, 0, 36);
const hunterWorld = new THREE.Vector3();
let lastT = performance.now();
let shopOpen = false;

function toast(t) {
  const el = document.getElementById('toast');
  el.textContent = t; el.style.opacity = '1';
  clearTimeout(toast._t); toast._t = setTimeout(() => { el.style.opacity = '0'; }, 1800);
}

function rumble(ms, mag) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) {
    if (p && p.vibrationActuator) p.vibrationActuator.playEffect('dual-rumble', {
      duration: ms, strongMagnitude: mag, weakMagnitude: mag * 0.6,
    }).catch(() => {});
  }
}

function groundY(x, z) {
  const roll = Math.sin(x * 0.016) * 3.6
    + Math.sin(z * 0.012 + 0.7) * 5.4
    + Math.sin((x * 0.65 + z) * 0.026) * 2.8
    + Math.sin(x * 0.042 + z * 0.034) * 1.35
    + (fbm(x * 0.007, z * 0.007, 3) - 0.5) * 3.4;
  const padHorse = 1 - THREE.MathUtils.smoothstep(Math.hypot(x - 4, z - 36), 7, 26);
  const padVillage = 1 - THREE.MathUtils.smoothstep(Math.hypot(x + 48, z - 22), 8, 22);
  const flatten = Math.max(padHorse, padVillage) * 0.78;
  const rise = THREE.MathUtils.smoothstep(-z, 50, 260) * 12;
  return roll * (1 - flatten) + rise;
}

function pickBiome(kind) {
  if (kind === 'shore') return { x: 170 + Math.random() * 40, z: -40 + Math.random() * 90 };
  if (kind === 'wood') return { x: -40 + Math.random() * 50, z: 40 + Math.random() * 70 };
  if (kind === 'hill') return { x: -90 + Math.random() * 60, z: -140 + Math.random() * 50 };
  return { x: -30 + Math.random() * 90, z: -20 + Math.random() * 80 };
}

async function boot() {
  const jobs = [
    ['./assets/riding_horse.js', { keepHierarchy: true, surfaces: true }],
    ['./assets/young_hunter.js', { keepHierarchy: true, surfaces: true }],
    ['./assets/hunting_bow.js', { surfaces: true }],
    ['./assets/village_cottage.js', { surfaces: true }],
    ['./assets/shop_stall.js', { surfaces: true }],
    ['./assets/meadow_oak.js', { surfaces: true }],
    ['./assets/meadow_bush.js', { surfaces: true }],
    ['./assets/fence_bay.js', { surfaces: true }],
    ['./assets/grass_tuft.js', { surfaces: true }],
    ['./assets/horizon_peak.js', {}],
    ['./assets/dune_rise.js', { surfaces: true }],
    ['./assets/cloud_puff.js', {}],
    ...BOOK.map((b) => [b.file, { surfaces: true }]),
  ];
  let done = 0;
  const loaded = await Promise.all(jobs.map(async ([url, opts]) => {
    const obj = await ASSET(url, opts);
    done++;
    barf.style.width = ((done / jobs.length) * 100) + '%';
    loadmsg.textContent = url.replace('./assets/', '').replace('.js', '');
    return obj;
  }));
  let i = 0;
  horse = loaded[i++]; hunter = loaded[i++]; bowObj = loaded[i++];
  const cottage = loaded[i++]; const stall = loaded[i++];
  const oakProto = loaded[i++]; const bushProto = loaded[i++];
  const fenceProto = loaded[i++]; const tuftProto = loaded[i++];
  const peakProto = loaded[i++]; const duneProto = loaded[i++]; const cloudProto = loaded[i++];
  const animalProtos = {};
  for (const b of BOOK) animalProtos[b.id] = loaded[i++];

  rig = createRig(THREE, renderer, scene, {
    camera,
    hour: 10.2, azimuth: 305, elevation: 32,
    tier: input.wantsTouch ? 'phone' : 'high',
    fogStart: 220, fogDensity: 0.00038, fillChroma: 2.7,
    shadowDist: 260, sunIntensity: 12.4, exposure: 1.06,
    wrap: 0.5, envIntensity: 0.52, envDiffuse: 0.08,
    cascades: input.wantsTouch ? 1 : 2,
  });
  await rig.ready.catch(() => {});
  if (rig.post?.composer) {
    try {
      const { ShaderPass } = await import('three/addons/postprocessing/ShaderPass.js');
      rig.post.composer.addPass(new ShaderPass(pastoralGrade()));
    } catch { /* phone / no addons */ }
  }

  const dressGround = (geo, ox = 0, oz = 0) => {
    const gpos = geo.attributes.position;
    const gcol = new Float32Array(gpos.count * 3);
    const gc = new THREE.Color();
    const hot = new THREE.Color(0x3EC12A);
    const deep = new THREE.Color(0x1B7A24);
    const sandC = new THREE.Color(0xD2B48C);
    for (let i = 0; i < gpos.count; i++) {
      const x = gpos.getX(i) + ox, z = -gpos.getY(i) + oz;
      gpos.setZ(i, groundY(x, z));
      const sand = THREE.MathUtils.clamp((x - 155) / 70, 0, 1);
      const yHere = groundY(x, z);
      const slope = THREE.MathUtils.clamp((yHere - groundY(x + 2.4, z)) * 0.18 + 0.5, 0, 1);
      const mott = 0.38 + 0.32 * Math.sin(x * 0.038) * Math.cos(z * 0.032) + (1 - slope) * 0.22;
      gc.copy(hot).lerp(deep, mott * 0.48).lerp(sandC, sand);
      gcol[i * 3] = gc.r; gcol[i * 3 + 1] = gc.g; gcol[i * 3 + 2] = gc.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(gcol, 3));
    geo.computeVertexNormals();
  };
  const maps = grassMaps();
  const ggeo = new THREE.PlaneGeometry(980, 980, 188, 188);
  dressGround(ggeo);
  const ground = new THREE.Mesh(ggeo, new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.86, metalness: 0, vertexColors: true,
    map: maps.map, roughnessMap: maps.roughnessMap, normalMap: maps.normalMap,
    normalScale: new THREE.Vector2(1.15, 1.15),
  }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.material.name = 'ground';
  scene.add(ground);
  const ngeo = new THREE.PlaneGeometry(120, 120, 96, 96);
  dressGround(ngeo, 4, 36);
  const nearPatch = new THREE.Mesh(ngeo, ground.material);
  nearPatch.rotation.x = -Math.PI / 2;
  nearPatch.position.set(4, 0.03, 36);
  nearPatch.receiveShadow = true;
  scene.add(nearPatch);
  const grassN = input.wantsTouch ? 900 : 1800;
  scene.add(placeGrassCards(grassN, { x: 4, z: 36 }, 38, groundY));
  scene.add(placeGrassCards(input.wantsTouch ? 500 : 1000, { x: 4, z: 8 }, 70, groundY, { scale: 1.15, seed: 17 }));
  scene.add(placeTreeCards(input.wantsTouch ? 28 : 46, groundY));

  const sand = new THREE.Mesh(
    new THREE.CircleGeometry(90, 24),
    new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.96, metalness: 0 }),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(210, 0.02, 20);
  sand.material.name = 'ground';
  applySurfaces(THREE, sand);
  scene.add(sand);

  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 260),
    new THREE.MeshStandardMaterial({ color: 0x87CEEB, roughness: 0.35, metalness: 0.08 }),
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(310, -0.12, 20);
  scene.add(sea);

  cottage.position.set(-48, groundY(-48, 22), 22); cottage.rotation.y = 0.3; scene.add(cottage);
  stallPos.set(-38, 0, 24);
  stall.position.set(stallPos.x, groundY(stallPos.x, stallPos.z), stallPos.z);
  stall.rotation.y = -0.4; scene.add(stall);

  const village = new THREE.Group();
  for (const [x, z, y] of [[-56, 28, 1.2], [-44, 36, 2.1], [-62, 16, 0.4]]) {
    const o = oakProto.clone(true); o.position.set(x, groundY(x, z), z); o.rotation.y = y; village.add(o);
  }
  for (const [x, z] of [[-42, 26], [-52, 32], [-36, 30]]) {
    const b = bushProto.clone(true); b.position.set(x, groundY(x, z), z); village.add(b);
  }
  scene.add(bakeStatic(village));

  const meadow = new THREE.Group();
  for (let n = 0; n < 22; n++) {
    const side = n % 2 ? 1 : -1;
    const x = side * (52 + Math.random() * 105);
    const z = -30 + Math.random() * 160;
    if (x > 170 || Math.abs(x) < 36) continue;
    const o = oakProto.clone(true);
    o.position.set(x, groundY(x, z), z);
    o.rotation.y = Math.random() * 6;
    o.scale.setScalar(0.85 + Math.random() * 0.6);
    meadow.add(o);
  }
  for (let n = 0; n < 20; n++) {
    const x = (Math.random() < 0.5 ? -1 : 1) * (46 + Math.random() * 90);
    const z = 8 + Math.random() * 110;
    if (Math.abs(x) < 32) continue;
    const b = bushProto.clone(true);
    b.position.set(x, groundY(x, z), z);
    meadow.add(b);
  }
  for (let n = 0; n < 110; n++) {
    const a = Math.random() * Math.PI * 2, r = 4 + Math.random() * 90;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const t = tuftProto.clone(true);
    t.position.set(x, groundY(x, z), z);
    t.rotation.y = Math.random() * 6;
    t.scale.setScalar(0.8 + Math.random() * 0.7);
    meadow.add(t);
  }
  scene.add(bakeStatic(meadow));

  const rails = new THREE.Group();
  const line = (x0, z0, x1, z1) => {
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
    const yaw = Math.atan2(dx, dz);
    const n = Math.max(1, Math.round(len / 2.4));
    for (let k = 0; k < n; k++) {
      const f = fenceProto.clone(true);
      const t = (k + 0.5) / n;
      const px = x0 + dx * t, pz = z0 + dz * t;
      f.position.set(px, groundY(px, pz), pz);
      f.rotation.y = yaw;
      rails.add(f);
      fences.push({ x: f.position.x, z: f.position.z, yaw, half: 1.2 });
    }
  };
  line(72, 48, 98, 48); line(98, 48, 98, 22); line(-78, 56, -54, 56);
  scene.add(bakeStatic(rails));

  const dunes = new THREE.Group();
  for (let n = 0; n < 8; n++) {
    const d = duneProto.clone(true);
    const dx = 175 + Math.random() * 40, dz = -20 + n * 12;
    d.position.set(dx, groundY(dx, dz), dz);
    d.rotation.y = Math.random() * 6;
    d.scale.setScalar(1.2 + Math.random() * 1.4);
    dunes.add(d);
  }
  scene.add(bakeStatic(dunes));

  const ridges = new THREE.Group();
  const ridgeFn = (freq, seed) => (nx, nz, height) => {
    const swell = 0.55 + 0.45 * Math.sin((nx * freq + seed) * Math.PI);
    const roll = fbm(nx * 4.5 + seed, nz * 3.2, 4);
    const jag = swell * 0.62 + roll * 0.5;
    const envelope = Math.pow(Math.max(0, 1 - Math.abs(nx) * 1.05), 1.05);
    const depth = 0.32 + (0.45 - nz) * 0.7;
    return Math.max(0, jag * envelope * depth * height);
  };
  const rNear = makeRidgeMesh(760, 130, 130, 24, 48, 0x2A3842, ridgeFn(5.4, 0.2));
  rNear.position.set(8, 0.6, -275);
  const rMid = makeRidgeMesh(860, 150, 118, 22, 64, 0x314656, ridgeFn(6.0, 1.1), { lit: false });
  rMid.position.set(-16, 6, -400);
  const rFar = makeRidgeMesh(1040, 180, 108, 20, 82, 0x3A5470, ridgeFn(6.6, 2.4), { lit: false });
  rFar.position.set(20, 14, -560);
  ridges.add(rNear, rMid, rFar);
  for (let i = -2; i <= 2; i++) {
    const p = peakProto.clone(true);
    p.position.set(i * 78 + 6, 0.2, -238);
    p.scale.set(0.48, 0.62 + Math.abs(i) * 0.07, 0.46);
    p.rotation.y = i * 0.08;
    ridges.add(p);
  }
  scene.add(bakeStatic(ridges));
  scene.add(bakeStatic(placeCloudCards()));

  const near = new THREE.Group();
  for (let n = 0; n < 50; n++) {
    const t = tuftProto.clone(true);
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 28;
    const x = 8 + Math.cos(a) * r, z = 18 + Math.sin(a) * r;
    t.position.set(x, groundY(x, z), z);
    t.rotation.y = Math.random() * 6;
    near.add(t);
  }
  scene.add(bakeStatic(near));

  horse.position.copy(horsePosV);
  horse.position.y = groundY(horse.position.x, horse.position.z);
  bindHeroEnv(horse, scene.environment, 0.48);
  bindHeroEnv(hunter, scene.environment, 0.32);
  scene.add(horse);
  hunter.scale.setScalar(0.92);
  scene.add(hunter);
  bowObj.scale.setScalar(0.85);
  hunter.add(bowObj);
  const rarm = hunter.userData.joints?.rarm;
  if (rarm) {
    bowObj.position.set(0, -0.42, 0.06);
    bowObj.rotation.set(0.2, 0, -1.2);
    rarm.add(bowObj);
  } else {
    bowObj.position.set(0.22, 1.1, 0.15);
  }

  for (const def of BOOK) {
    const proto = animalProtos[def.id];
    const count = def.pts >= 70 ? 1 : def.pts >= 40 ? 2 : 3;
    for (let n = 0; n < count; n++) {
      const p = pickBiome(def.biome);
      const obj = proto.clone(true);
      obj.position.set(p.x, groundY(p.x, p.z), p.z);
      obj.rotation.y = Math.random() * 6;
      scene.add(obj);
      animals.push({
        def, obj, hp: def.hp, alive: true,
        vx: 0, vz: 0, heading: obj.rotation.y, spook: 0, cool: 0,
      });
    }
  }

  horsePos = horse.position;
  placeRider();
  loadEl.style.display = 'none';
  startEl.classList.add('on');
  window.__READY__ = true;
}

function placeRider() {
  if (STATE.mounted) {
    const saddle = horse.userData.joints?.saddle;
    hunter.position.set(0, 0.12, 0);
    if (saddle) {
      hunter.position.set(0, -0.86, 0.02);
      hunter.rotation.set(0.06, 0, 0);
      const jj = hunter.userData.joints || {};
      if (jj.lleg) { jj.lleg.rotation.x = 1.05; jj.lleg.rotation.z = 0.18; }
      if (jj.rleg) { jj.rleg.rotation.x = 1.05; jj.rleg.rotation.z = -0.18; }
      saddle.add(hunter);
    } else {
      hunter.position.copy(horse.position);
      hunter.position.y += 1.55;
      hunter.rotation.y = STATE.yaw;
    }
  } else {
    if (hunter.parent && hunter.parent !== scene) scene.add(hunter);
    const hx = horse.position.x + Math.sin(STATE.yaw) * 0.9;
    const hz = horse.position.z + Math.cos(STATE.yaw) * 0.9;
    hunter.position.set(hx, groundY(hx, hz), hz);
    hunter.rotation.set(0, STATE.yaw, 0);
    const jj = hunter.userData.joints || {};
    if (jj.lleg) { jj.lleg.rotation.x = 0; jj.lleg.rotation.z = 0; }
    if (jj.rleg) { jj.rleg.rotation.x = 0; jj.rleg.rotation.z = 0; }
  }
}

function riderPos() {
  if (STATE.mounted) return horse.position;
  return hunter.position;
}

function horseMax() {
  let g = 12.4;
  if (STATE.score >= 400) g = 14.2;
  if (STATE.score >= 800) g = 16.0;
  return g;
}

function shyBoost() {
  let s = 1;
  if (STATE.score >= 200) s *= 0.78;
  if (STATE.score >= 600) s *= 0.72;
  return s;
}

function tryJump(forced) {
  if (!STATE.mounted || STATE.airborne > 0) return;
  const px = horse.position.x, pz = horse.position.z;
  const fx = Math.sin(STATE.yaw), fz = Math.cos(STATE.yaw);
  let rail = false;
  for (const f of fences) {
    const dx = f.x - px, dz = f.z - pz;
    const along = dx * fx + dz * fz;
    const side = -dx * fz + dz * fx;
    if (along > 0.4 && along < 2.6 && Math.abs(side) < 1.35) { rail = true; break; }
  }
  if (!rail && !forced) return;
  if (!forced && STATE.speed < 4.5) return;
  STATE.airborne = 0.62;
  STATE.hop = rail ? 1.15 : 0.82;
  audio.hoof(1, 14, true);
  rumble(90, 0.35);
}

function moveMountedClean(dt, mv) {
  const fwd = mv.y;
  const mag = Math.max(Math.abs(fwd), Math.abs(mv.x) * 0.25);
  let target = 0;
  if (mag > 0.08) {
    if (mag < 0.38) target = 3.2;
    else if (mag < 0.72) target = 7.8;
    else target = horseMax();
    if (fwd < -0.05) target *= 0.42;
  }
  STATE.speed += (target - STATE.speed) * Math.min(1, dt * 3.5);
  const along = fwd < -0.05 ? -STATE.speed : (fwd > 0.04 || mag > 0.12 ? STATE.speed : 0);
  horse.position.x += Math.sin(STATE.yaw) * along * dt;
  horse.position.z += Math.cos(STATE.yaw) * along * dt;
  horse.position.x = THREE.MathUtils.clamp(horse.position.x, -240, 236);
  horse.position.z = THREE.MathUtils.clamp(horse.position.z, -220, 220);
  horse.rotation.y = STATE.yaw;
  if (STATE.airborne > 0) {
    STATE.airborne -= dt;
    horse.position.y = groundY(horse.position.x, horse.position.z) + Math.sin((1 - STATE.airborne / 0.62) * Math.PI) * STATE.hop;
    if (STATE.airborne <= 0) horse.position.y = groundY(horse.position.x, horse.position.z);
  } else {
    horse.position.y = groundY(horse.position.x, horse.position.z);
    tryJump(false);
  }
  STATE.gaitPhase += STATE.speed * dt * 2.1;
  const j = horse.userData.joints || {};
  if (j.neck && j.neck.userData.restX == null) j.neck.userData.restX = 0.42;
  const swing = Math.sin(STATE.gaitPhase) * Math.min(0.55, STATE.speed * 0.045);
  if (j.fl) j.fl.rotation.x = swing;
  if (j.fr) j.fr.rotation.x = -swing;
  if (j.bl) j.bl.rotation.x = -swing;
  if (j.br) j.br.rotation.x = swing;
  if (j.body) j.body.rotation.x = Math.sin(STATE.gaitPhase * 2) * Math.min(0.04, STATE.speed * 0.003);
  if (j.neck) j.neck.rotation.x = (j.neck.userData.restX || 0) - STATE.pitch * 0.25;
  if (STATE.speed > 10) {
    rumble(40, 0.18 + (STATE.speed - 10) * 0.02);
    if (Math.random() < dt * 8) spawnDust(horse.position);
  }
  audio.hoof(dt, STATE.speed, true);
}

function moveFoot(dt, mv) {
  const sneak = mv.sneak;
  STATE.sneak = sneak;
  const max = sneak ? 1.15 : 2.85;
  const mag = Math.hypot(mv.x, mv.y);
  STATE.speed = mag * max;
  const fx = Math.sin(STATE.yaw) * mv.y + Math.sin(STATE.yaw + Math.PI / 2) * mv.x;
  const fz = Math.cos(STATE.yaw) * mv.y + Math.cos(STATE.yaw + Math.PI / 2) * mv.x;
  hunter.position.x += fx * max * dt;
  hunter.position.z += fz * max * dt;
  hunter.position.y = groundY(hunter.position.x, hunter.position.z) + (sneak ? -0.12 : 0);
  hunter.rotation.y = STATE.yaw;
  const j = hunter.userData.joints || {};
  const swing = Math.sin(performance.now() * 0.01 * (sneak ? 0.5 : 1)) * mag * 0.5;
  if (j.lleg) j.lleg.rotation.x = swing;
  if (j.rleg) j.rleg.rotation.x = -swing;
}

function spawnDust(p) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 5, 4),
    new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 1, transparent: true, opacity: 0.45 }),
  );
  m.position.set(p.x + (Math.random() - 0.5) * 0.4, 0.1, p.z + (Math.random() - 0.5) * 0.4);
  scene.add(m);
  dust.push({ m, t: 0.45 });
}

function updateCamera() {
  const look = input.consumeLook();
  STATE.yaw += look.x;
  STATE.pitch = THREE.MathUtils.clamp(STATE.pitch + look.y, -0.7, 0.55);
  const origin = riderPos();
  const zoom = input.fireHeld || input.aimHeld;
  const cams = [
    { back: 4.6, side: 5.1, height: 1.48 },
    { back: 7.6, side: 1.8, height: 1.68 },
    { back: 3.6, side: 0.35, height: 1.78 },
  ];
  const cam = cams[STATE.camMode] || cams[0];
  const back = STATE.mounted ? (zoom ? 4.4 : cam.back) : (STATE.sneak ? 2.6 : 3.8);
  const height = STATE.mounted ? (zoom ? 1.66 : cam.height) : (STATE.sneak ? 1.25 : 1.62);
  const fx = Math.sin(STATE.yaw), fz = Math.cos(STATE.yaw);
  const rx = Math.sin(STATE.yaw + Math.PI / 2), rz = Math.cos(STATE.yaw + Math.PI / 2);
  const side = STATE.mounted ? (zoom ? 0.9 : cam.side) : 0.2;
  camera.position.set(
    origin.x - fx * back + rx * side,
    origin.y + height + 0.28 - STATE.pitch * 1.2,
    origin.z - fz * back + rz * side,
  );
  camera.lookAt(origin.x + fx * 7.5, origin.y + 1.18 + STATE.pitch * 4.6, origin.z + fz * 7.5);
}

function loose() {
  if (STATE.quiver <= 0 || STATE.over) return;
  STATE.quiver--;
  audio.loose();
  const origin = riderPos().clone();
  origin.y += STATE.mounted ? 1.85 : 1.45;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.62, 5),
    new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.6 }),
  );
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  mesh.position.copy(origin);
  scene.add(mesh);
  arrows.push({ mesh, dir: dir.normalize(), life: 1.6, speed: 38 + STATE.bow * 6 });
}

function updateArrows(dt) {
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];
    a.mesh.position.addScaledVector(a.dir, a.speed * dt);
    a.life -= dt;
    let hit = false;
    for (const an of animals) {
      if (!an.alive) continue;
      const d = a.mesh.position.distanceTo(an.obj.position);
      if (d < 1.15 + (an.def.hp > 4 ? 0.4 : 0)) {
        an.hp -= STATE.bow;
        audio.hit();
        hit = true;
        if (an.hp <= 0) harvest(an);
        else { an.spook = 4; }
        break;
      }
    }
    if (hit || a.life <= 0 || a.mesh.position.y < -0.2) {
      scene.remove(a.mesh);
      arrows.splice(i, 1);
    }
  }
}

function harvest(an) {
  an.alive = false;
  an.obj.visible = false;
  const d = an.def;
  STATE.meat += d.drop.meat;
  STATE.hide += d.drop.hide;
  STATE.feather += d.drop.feather;
  STATE.score += d.pts;
  STATE.taken.add(d.id);
  audio.take();
  toast(`${d.title}  ·  +${d.pts}`);
  if (STATE.taken.size >= 20) {
    STATE.over = true;
    audio.win();
    document.getElementById('overp').textContent = `Twenty marks. ${STATE.score} points. The book is full.`;
    overEl.classList.add('on');
    hudEl.classList.remove('on');
  }
}

function updateAnimals(dt) {
  const p = riderPos();
  const noise = STATE.mounted ? (2.2 + STATE.speed * 0.55) : (STATE.sneak ? 0.45 : 1.15);
  const quiet = shyBoost();
  for (const an of animals) {
    if (!an.alive) continue;
    const dx = an.obj.position.x - p.x;
    const dz = an.obj.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    const hear = an.def.shy * quiet * (0.55 + noise * 0.18);
    an.cool -= dt;
    if (dist < hear) {
      an.spook = 3.5;
      if (an.def.charge && dist < hear * 0.45 && !STATE.sneak) {
        const inv = 1 / Math.max(0.2, dist);
        an.obj.position.x -= dx * inv * 5.5 * dt;
        an.obj.position.z -= dz * inv * 5.5 * dt;
        an.obj.rotation.y = Math.atan2(-dx, -dz);
        continue;
      }
    }
    if (an.spook > 0) {
      an.spook -= dt;
      const inv = 1 / Math.max(0.2, dist);
      an.obj.position.x += dx * inv * 7.5 * dt;
      an.obj.position.z += dz * inv * 7.5 * dt;
      an.obj.rotation.y = Math.atan2(dx, dz);
    } else {
      if (an.cool <= 0) {
        an.heading += (Math.random() - 0.5) * 1.4;
        an.cool = 1.5 + Math.random() * 2.5;
      }
      const step = 0.7 + (an.def.shy > 20 ? 0.4 : 0);
      an.obj.position.x += Math.sin(an.heading) * step * dt;
      an.obj.position.z += Math.cos(an.heading) * step * dt;
      an.obj.rotation.y = an.heading;
    }
    an.obj.position.x = THREE.MathUtils.clamp(an.obj.position.x, -230, 230);
    an.obj.position.z = THREE.MathUtils.clamp(an.obj.position.z, -210, 210);
    an.obj.position.y = groundY(an.obj.position.x, an.obj.position.z);
  }
}

function nearStall() {
  const p = riderPos();
  return Math.hypot(p.x - stallPos.x, p.z - stallPos.z) < 3.4;
}

function fillBook() {
  const el = document.getElementById('booklist');
  if (!el) return;
  el.innerHTML = BOOK.map((b) => {
    const got = STATE.taken.has(b.id);
    return `<div class="${got ? 'got' : 'no'}">${got ? '✓' : '·'} ${b.title}</div>`;
  }).join('');
}

function hud() {
  document.getElementById('objs').textContent = `${STATE.taken.size} / 20 taken`;
  document.getElementById('objc').textContent = STATE.mounted
    ? (STATE.speed > 10 ? 'Gallop' : STATE.speed > 5 ? 'Canter' : STATE.speed > 0.4 ? 'Walk' : 'Halted')
    : (STATE.sneak ? 'Creeping' : 'On foot');
  document.getElementById('gait').textContent = STATE.mounted ? 'mounted' : 'on foot';
  document.getElementById('pack').textContent = `meat ${STATE.meat} · hide ${STATE.hide} · feather ${STATE.feather} · bow ${STATE.bow}`;
  document.getElementById('scoren').textContent = String(STATE.score);
  const mount = document.getElementById('bmount');
  if (mount) mount.textContent = STATE.mounted ? 'DISMOUNT' : 'MOUNT';
  const sneakBtn = document.getElementById('bsneak');
  if (sneakBtn) sneakBtn.classList.toggle('on', STATE.sneak);
  const shop = document.getElementById('shop');
  if (!input.wantsTouch) {
    if (nearStall() && !STATE.over) shop.classList.add('on');
    else if (!shopOpen) shop.classList.remove('on');
  }
}

function buyBow() {
  if (STATE.meat >= 40 && STATE.hide >= 20) {
    STATE.meat -= 40; STATE.hide -= 20; STATE.bow = Math.min(4, STATE.bow + 1);
    audio.shop(); toast('Bow draws harder');
  } else toast('The stall wants more meat and hide');
}
function buyArr() {
  if (STATE.meat >= 15 && STATE.feather >= 10) {
    STATE.meat -= 15; STATE.feather -= 10; STATE.quiver += 16;
    audio.shop(); toast('Quiver filled');
  } else toast('Need meat and feathers');
}

function frame() {
  const now = performance.now();
  const raw = (now - lastT) / 1000;
  lastT = now;
  const fps = 1 / Math.max(1e-4, raw);
  const dt = Math.min(0.05, raw);

  if (!horse) {
    requestAnimationFrame(frame);
    return;
  }

  if (STATE.running && !STATE.over) {
    const mv = input.sample();
    updateCamera();
    if (input.mountTap) {
      input.mountTap = false;
      const p = riderPos();
      const d = Math.hypot(p.x - horse.position.x, p.z - horse.position.z);
      if (STATE.mounted) {
        STATE.mounted = false;
        if (hunter.parent !== scene) scene.add(hunter);
        hunter.position.set(horse.position.x + 0.9, 0, horse.position.z);
        hunter.rotation.y = STATE.yaw;
        toast('On foot');
      } else if (d < 2.6) {
        STATE.mounted = true;
        placeRider();
        toast('Mounted');
      }
    }
    if (STATE.mounted) {
      moveMountedClean(dt, mv);
      placeRider();
    } else {
      moveFoot(dt, mv);
      STATE.speed = Math.hypot(mv.x, mv.y) * (mv.sneak ? 1.15 : 2.85);
    }
    if (input.jumpTap) {
      input.jumpTap = false;
      if (STATE.mounted) tryJump(true);
      else toast('Mount to jump');
    }
    if (input.fireTap) { input.fireTap = false; loose(); }
    if (input.shopTap) {
      input.shopTap = false;
      if (nearStall() && !STATE.over) {
        shopOpen = true;
        document.getElementById('shop').classList.add('on');
      } else toast('Ride to the village stall to trade');
    }
    if (input.bookTap) {
      input.bookTap = false;
      const book = document.getElementById('book');
      book.classList.toggle('on');
      fillBook();
    }
    if (input.camTap) {
      input.camTap = false;
      STATE.camMode = (STATE.camMode + 1) % 3;
      toast(['Flank camera', 'Chase camera', 'Close camera'][STATE.camMode]);
    }
    updateArrows(dt);
    updateAnimals(dt);
    for (let i = dust.length - 1; i >= 0; i--) {
      dust[i].t -= dt; dust[i].m.position.y += dt * 0.4; dust[i].m.material.opacity = dust[i].t;
      if (dust[i].t <= 0) { scene.remove(dust[i].m); dust.splice(i, 1); }
    }
    hud();
  } else {
    updateCamera();
  }

  renderer.info.reset();
  if (rig) rig.render(camera, dt);
  else renderer.render(scene, camera);

  const p = riderPos();
  window.__GAME__.pos = [p.x, p.z];
  window.__GAME__.fps = fps;
  window.__GAME__.speed = STATE.speed;
  window.__GAME__.score = STATE.score;
  window.__GAME__.over = STATE.over;
  window.__GAME__.draws = renderer.info.render.calls;
  window.__GAME__.tris = renderer.info.render.triangles;
  requestAnimationFrame(frame);
}

function startPlay() {
  startEl.classList.remove('on');
  hudEl.classList.add('on');
  if (input.wantsTouch) {
    touchEl.classList.add('on');
    hudEl.classList.add('touch');
  }
  STATE.running = true;
  audio.resume();
  input.requestLock();
  lastT = performance.now();
}

window.__START__ = startPlay;
document.getElementById('startb').addEventListener('click', startPlay);
document.getElementById('startb').addEventListener('touchend', (e) => { e.preventDefault(); startPlay(); }, { passive: false });
document.getElementById('overb').addEventListener('click', () => location.reload());
document.getElementById('buybow').addEventListener('click', buyBow);
document.getElementById('buyarr').addEventListener('click', buyArr);
document.getElementById('closeshop').addEventListener('click', () => {
  shopOpen = false; document.getElementById('shop').classList.remove('on');
});
document.getElementById('closebook').addEventListener('click', () => {
  document.getElementById('book').classList.remove('on');
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
  if (rig) rig.resize(innerWidth, innerHeight);
});

boot().catch((e) => {
  console.error(e);
  loadmsg.textContent = 'failed to wake';
});
requestAnimationFrame(frame);
