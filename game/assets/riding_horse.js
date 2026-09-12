// riding_horse — arm A: lathed barrel, muscle masses, dark hide, joints
// 1.62 m at the withers, ears near 2.0 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0.06, ...o });
    if (name) m.name = name;
    return m;
  };
  const HIDE = mat(0x2A1C16, 'fabric', { roughness: 0.42, metalness: 0.08 });
  const HIDE2 = mat(0x3A2A22, 'fabric', { roughness: 0.48, metalness: 0.06 });
  const RIM = mat(0x4A3728, 'fabric', { roughness: 0.44 });
  const MANE = mat(0x12100C, 'fabric', { roughness: 0.9 });
  const LEATH = mat(0x5A4030, 'fabric', { roughness: 0.52 });
  const HOOF = mat(0x1A140E, 'stone', { roughness: 0.86 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  };

  const body = new THREE.Group();
  body.position.set(0, 1.16, 0);
  g.add(body);

  const profile = [[0.05, -0.62], [0.22, -0.56], [0.29, -0.34], [0.30, -0.04], [0.28, 0.24], [0.22, 0.48], [0.12, 0.58], [0.04, 0.62]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const barrel = new THREE.LatheGeometry(profile, 18);
  barrel.rotateX(Math.PI / 2);
  add(body, barrel, HIDE, 0, 0.02, 0, 0, 0, 0, 1.12, 0.98, 1.02);
  add(body, new THREE.SphereGeometry(0.16, 10, 7), HIDE2, 0, 0.20, 0.18, 0, 0, 0, 1.15, 0.7, 0.85);
  add(body, new THREE.SphereGeometry(0.24, 12, 8), HIDE, 0, 0.04, 0.52, 0, 0, 0, 1.18, 1.02, 0.88);
  add(body, new THREE.SphereGeometry(0.25, 12, 8), HIDE2, 0, 0.06, -0.54, 0, 0, 0, 1.22, 1.08, 0.96);
  add(body, new THREE.SphereGeometry(0.15, 10, 7), HIDE2, 0.17, 0.08, 0.34);
  add(body, new THREE.SphereGeometry(0.15, 10, 7), HIDE2, -0.17, 0.08, 0.34);
  add(body, new THREE.SphereGeometry(0.16, 10, 7), HIDE2, 0.18, 0.10, -0.36);
  add(body, new THREE.SphereGeometry(0.16, 10, 7), HIDE2, -0.18, 0.10, -0.36);
  add(body, new THREE.SphereGeometry(0.19, 10, 7), HIDE2, 0, -0.18, 0.02, 0, 0, 0, 1.25, 0.62, 1.55);

  const neck = new THREE.Group();
  neck.position.set(0, 0.16, 0.46);
  neck.rotation.x = 0.42;
  neck.userData.restX = 0.42;
  body.add(neck);
  add(neck, new THREE.CylinderGeometry(0.14, 0.22, 0.26, 12), HIDE, 0, 0.12, 0.04);
  add(neck, new THREE.CylinderGeometry(0.11, 0.14, 0.22, 12), HIDE, 0, 0.32, 0.06);
  add(neck, new THREE.SphereGeometry(0.14, 10, 8), HIDE, 0, 0.22, 0.05);
  for (let i = 0; i < 5; i++) {
    add(neck, new THREE.BoxGeometry(0.06, 0.11, 0.09), MANE, 0, 0.04 + i * 0.08, -0.08, 0.18, 0, 0);
  }

  const head = new THREE.Group();
  head.position.set(0, 0.44, 0.10);
  head.rotation.x = -0.48;
  neck.add(head);
  add(head, new THREE.SphereGeometry(0.125, 10, 8), HIDE, 0, 0.03, 0.01, 0, 0, 0, 1.08, 0.92, 1.05);
  add(head, new THREE.BoxGeometry(0.13, 0.11, 0.22), RIM, 0, -0.02, 0.18);
  add(head, new THREE.SphereGeometry(0.065, 8, 6), HIDE2, 0, -0.03, 0.30);
  add(head, new THREE.BoxGeometry(0.034, 0.12, 0.042), MANE, -0.052, 0.14, -0.02, 0.16, 0, 0.14);
  add(head, new THREE.BoxGeometry(0.034, 0.12, 0.042), MANE, 0.052, 0.14, -0.02, 0.16, 0, -0.14);
  add(head, new THREE.CylinderGeometry(0.024, 0.028, 0.03, 6), MANE, 0, -0.02, 0.36, Math.PI / 2, 0, 0);
  add(head, new THREE.SphereGeometry(0.02, 6, 5), HIDE2, -0.072, 0.05, 0.06);
  add(head, new THREE.SphereGeometry(0.02, 6, 5), HIDE2, 0.072, 0.05, 0.06);

  const saddle = new THREE.Group();
  saddle.position.set(0, 0.30, -0.04);
  body.add(saddle);
  add(saddle, new THREE.BoxGeometry(0.40, 0.06, 0.46), LEATH, 0, 0, 0);
  add(saddle, new THREE.BoxGeometry(0.34, 0.11, 0.08), LEATH, 0, 0.06, 0.17);
  add(saddle, new THREE.BoxGeometry(0.32, 0.13, 0.08), LEATH, 0, 0.07, -0.17);
  add(saddle, new THREE.BoxGeometry(0.035, 0.22, 0.03), LEATH, 0.20, -0.08, 0.02);
  add(saddle, new THREE.BoxGeometry(0.035, 0.22, 0.03), LEATH, -0.20, -0.08, 0.02);

  const tail = new THREE.Group();
  tail.position.set(0, 0.10, -0.68);
  body.add(tail);
  add(tail, new THREE.CylinderGeometry(0.04, 0.095, 0.84, 8), MANE, 0, -0.34, -0.08, 0.32, 0, 0);
  add(tail, new THREE.CylinderGeometry(0.03, 0.05, 0.5, 7), MANE, 0.03, -0.42, -0.04, 0.38, 0, 0.12);
  add(tail, new THREE.SphereGeometry(0.09, 7, 6), MANE, 0, -0.72, -0.18);

  const leg = (x, z, rear) => {
    const j = new THREE.Group();
    j.position.set(x, 0.90, z);
    g.add(j);
    const up = rear ? 0.44 : 0.42;
    add(j, new THREE.SphereGeometry(0.09, 8, 6), HIDE2, 0, 0.02, 0.01);
    add(j, new THREE.CylinderGeometry(0.078, 0.10, up, 10), HIDE2, 0, -up / 2, 0.01);
    add(j, new THREE.SphereGeometry(0.07, 7, 6), RIM, 0, -up + 0.02, 0.02);
    add(j, new THREE.CylinderGeometry(0.052, 0.066, 0.40, 8), HIDE, 0, -up - 0.18, 0.02);
    add(j, new THREE.CylinderGeometry(0.056, 0.06, 0.10, 8), HOOF, 0, -up - 0.40, 0.03);
    return j;
  };
  const fl = leg(0.16, 0.36, false);
  const fr = leg(-0.16, 0.36, false);
  const bl = leg(0.17, -0.40, true);
  const br = leg(-0.17, -0.40, true);

  g.userData.joints = { body, neck, head, saddle, tail, fl, fr, bl, br };

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
