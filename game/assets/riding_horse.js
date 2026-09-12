// riding_horse — country mount: lathed barrel, arched neck, dark matte hide, gait joints
// 1.62 m at the withers, ears near 2.0 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.02, ...o });
    if (name) m.name = name;
    return m;
  };
  const HIDE = mat(0x1A120E, 'fabric', { roughness: 0.82, metalness: 0.02 });
  const HIDE2 = mat(0x241810, 'fabric', { roughness: 0.84, metalness: 0.02 });
  const MUZ = mat(0x2E2018, 'fabric', { roughness: 0.78 });
  const MANE = mat(0x0E0C0A, 'fabric', { roughness: 0.94, metalness: 0 });
  const LEATH = mat(0x4A3728, 'fabric', { roughness: 0.7 });
  const HOOF = mat(0x1A140E, 'stone', { roughness: 0.9, metalness: 0 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  };

  const body = new THREE.Group();
  body.position.set(0, 1.14, 0);
  body.userData.restY = 1.14;
  g.add(body);

  const profile = [
    [0.04, -0.72], [0.16, -0.68], [0.22, -0.52], [0.24, -0.22],
    [0.25, 0.04], [0.24, 0.28], [0.20, 0.50], [0.12, 0.62], [0.04, 0.68],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const barrel = new THREE.LatheGeometry(profile, 16);
  barrel.rotateX(Math.PI / 2);
  add(body, barrel, HIDE, 0, 0.02, 0, 0, 0, 0, 0.92, 0.95, 1);
  add(body, new THREE.SphereGeometry(0.14, 10, 7), HIDE2, 0, 0.18, 0.16, 0, 0, 0, 1.05, 0.55, 0.8);
  add(body, new THREE.SphereGeometry(0.18, 10, 8), HIDE, 0, 0.02, 0.50, 0, 0, 0, 1.05, 0.95, 0.82);
  add(body, new THREE.SphereGeometry(0.19, 10, 8), HIDE2, 0, 0.04, -0.52, 0, 0, 0, 1.08, 0.98, 0.88);
  add(body, new THREE.SphereGeometry(0.11, 8, 6), HIDE2, 0.14, 0.04, 0.32);
  add(body, new THREE.SphereGeometry(0.11, 8, 6), HIDE2, -0.14, 0.04, 0.32);
  add(body, new THREE.SphereGeometry(0.12, 8, 6), HIDE2, 0.15, 0.06, -0.34);
  add(body, new THREE.SphereGeometry(0.12, 8, 6), HIDE2, -0.15, 0.06, -0.34);
  add(body, new THREE.SphereGeometry(0.14, 8, 6), HIDE2, 0, -0.16, 0.04, 0, 0, 0, 1.15, 0.55, 1.35);

  const neck = new THREE.Group();
  neck.position.set(0, 0.14, 0.48);
  neck.rotation.x = 0.38;
  neck.userData.restX = 0.38;
  body.add(neck);
  add(neck, new THREE.CylinderGeometry(0.12, 0.18, 0.28, 10), HIDE, 0, 0.12, 0.03);
  add(neck, new THREE.CylinderGeometry(0.10, 0.12, 0.22, 10), HIDE, 0, 0.34, 0.05);
  add(neck, new THREE.SphereGeometry(0.12, 8, 7), HIDE, 0, 0.22, 0.04);
  for (let i = 0; i < 7; i++) {
    add(neck, new THREE.BoxGeometry(0.04, 0.10, 0.07), MANE, 0, 0.02 + i * 0.07, -0.09, 0.22, 0, 0);
  }

  const head = new THREE.Group();
  head.position.set(0, 0.46, 0.08);
  head.rotation.x = -0.42;
  head.userData.restX = -0.42;
  neck.add(head);
  add(head, new THREE.SphereGeometry(0.11, 9, 7), HIDE, 0, 0.03, 0.0, 0, 0, 0, 1.02, 0.88, 0.95);
  const muzProf = [[0.02, 0], [0.055, 0.04], [0.05, 0.12], [0.03, 0.20]].map(([x, y]) => new THREE.Vector2(x, y));
  const muz = new THREE.LatheGeometry(muzProf, 8);
  muz.rotateX(Math.PI / 2);
  add(head, muz, MUZ, 0, -0.02, 0.16);
  add(head, new THREE.BoxGeometry(0.03, 0.11, 0.038), MANE, -0.048, 0.13, -0.02, 0.14, 0, 0.12);
  add(head, new THREE.BoxGeometry(0.03, 0.11, 0.038), MANE, 0.048, 0.13, -0.02, 0.14, 0, -0.12);
  add(head, new THREE.SphereGeometry(0.016, 5, 4), HIDE2, -0.068, 0.04, 0.04);
  add(head, new THREE.SphereGeometry(0.016, 5, 4), HIDE2, 0.068, 0.04, 0.04);
  add(head, new THREE.CylinderGeometry(0.02, 0.024, 0.025, 6), MANE, 0, -0.03, 0.28, Math.PI / 2, 0, 0);

  const saddle = new THREE.Group();
  saddle.position.set(0, 0.26, -0.02);
  body.add(saddle);
  add(saddle, new THREE.BoxGeometry(0.36, 0.05, 0.42), LEATH, 0, 0, 0);
  add(saddle, new THREE.BoxGeometry(0.30, 0.10, 0.07), LEATH, 0, 0.05, 0.16);
  add(saddle, new THREE.BoxGeometry(0.28, 0.11, 0.07), LEATH, 0, 0.06, -0.16);
  add(saddle, new THREE.BoxGeometry(0.03, 0.20, 0.025), LEATH, 0.18, -0.07, 0.02);
  add(saddle, new THREE.BoxGeometry(0.03, 0.20, 0.025), LEATH, -0.18, -0.07, 0.02);

  const tail = new THREE.Group();
  tail.position.set(0, 0.08, -0.70);
  tail.userData.restX = 0.22;
  body.add(tail);
  add(tail, new THREE.CylinderGeometry(0.035, 0.08, 0.72, 7), MANE, 0, -0.30, -0.06, 0.28, 0, 0);
  add(tail, new THREE.CylinderGeometry(0.025, 0.04, 0.42, 6), MANE, 0.02, -0.38, -0.03, 0.34, 0, 0.1);
  add(tail, new THREE.SphereGeometry(0.07, 6, 5), MANE, 0, -0.64, -0.14);

  const leg = (x, z, rear) => {
    const j = new THREE.Group();
    j.position.set(x, 0.92, z);
    g.add(j);
    const up = rear ? 0.40 : 0.38;
    add(j, new THREE.SphereGeometry(0.075, 7, 6), HIDE2, 0, 0.01, 0.01);
    add(j, new THREE.CylinderGeometry(0.065, 0.085, up, 8), HIDE2, 0, -up / 2, 0.01);
    const low = new THREE.Group();
    low.position.set(0, -up, 0.015);
    j.add(low);
    add(low, new THREE.SphereGeometry(0.055, 6, 5), MUZ, 0, 0, 0);
    add(low, new THREE.CylinderGeometry(0.042, 0.055, 0.36, 7), HIDE, 0, -0.18, 0.01);
    add(low, new THREE.CylinderGeometry(0.048, 0.05, 0.09, 7), HOOF, 0, -0.38, 0.02);
    return { j, low };
  };
  const FL = leg(0.15, 0.34, false);
  const FR = leg(-0.15, 0.34, false);
  const BL = leg(0.16, -0.42, true);
  const BR = leg(-0.16, -0.42, true);

  g.userData.joints = {
    body, neck, head, saddle, tail,
    fl: FL.j, fr: FR.j, bl: BL.j, br: BR.j,
    flLow: FL.low, frLow: FR.low, blLow: BL.low, brLow: BR.low,
  };

  const box = new THREE.Box3(), v = new THREE.Vector3(), m = new THREE.Matrix4(), im = new THREE.Matrix4();
  g.updateMatrixWorld(true);
  g.traverse((n) => {
    const p = n.isMesh && n.geometry.attributes.position; if (!p) return;
    const put = (mat) => { for (let i = 0; i < p.count; i++) box.expandByPoint(v.fromBufferAttribute(p, i).applyMatrix4(mat)); };
    if (n.isInstancedMesh) { for (let c = 0; c < n.count; c++) { n.getMatrixAt(c, im); put(m.multiplyMatrices(n.matrixWorld, im)); } return; }
    put(n.matrixWorld);
  });
  const c = box.getCenter(new THREE.Vector3());
  g.children.forEach((o) => { o.position.x -= c.x; o.position.y -= box.min.y; o.position.z -= c.z; });
  return g;
}
