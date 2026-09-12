// riding_horse — arm A: lathed barrel, muscle masses, dark hide, joints
// 1.62 m at the withers, ears near 2.0 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0.06, ...o });
    if (name) m.name = name;
    return m;
  };
  const HIDE = mat(0x2A1C16, 'fabric', { roughness: 0.52 });
  const HIDE2 = mat(0x3A2A22, 'fabric', { roughness: 0.6 });
  const RIM = mat(0x4A3728, 'fabric', { roughness: 0.5 });
  const MANE = mat(0x12100C, 'fabric', { roughness: 0.88 });
  const LEATH = mat(0x5A4030, 'fabric', { roughness: 0.55 });
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

  const profile = [[0.04, -0.64], [0.20, -0.58], [0.27, -0.38], [0.28, -0.08], [0.27, 0.22], [0.24, 0.46], [0.15, 0.60], [0.05, 0.66]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const barrel = new THREE.LatheGeometry(profile, 14);
  barrel.rotateX(Math.PI / 2);
  add(body, barrel, HIDE, 0, 0.04, 0, 0, 0, 0, 1.05, 0.92, 1);
  add(body, new THREE.SphereGeometry(0.22, 12, 8), HIDE, 0, 0.06, 0.58, 0, 0, 0, 1.15, 1.0, 0.9);
  add(body, new THREE.SphereGeometry(0.24, 12, 8), HIDE2, 0, 0.08, -0.58, 0, 0, 0, 1.2, 1.05, 0.95);
  add(body, new THREE.SphereGeometry(0.14, 10, 7), HIDE2, 0.16, 0.10, 0.38);
  add(body, new THREE.SphereGeometry(0.14, 10, 7), HIDE2, -0.16, 0.10, 0.38);
  add(body, new THREE.SphereGeometry(0.15, 10, 7), HIDE2, 0.17, 0.12, -0.40);
  add(body, new THREE.SphereGeometry(0.15, 10, 7), HIDE2, -0.17, 0.12, -0.40);
  add(body, new THREE.SphereGeometry(0.18, 10, 7), HIDE2, 0, -0.16, 0.02, 0, 0, 0, 1.2, 0.65, 1.6);

  const neck = new THREE.Group();
  neck.position.set(0, 0.18, 0.50);
  neck.rotation.x = 0.78;
  neck.userData.restX = 0.78;
  body.add(neck);
  add(neck, new THREE.CylinderGeometry(0.13, 0.20, 0.38, 12), HIDE, 0, 0.16, 0.06);
  add(neck, new THREE.CylinderGeometry(0.11, 0.14, 0.34, 12), HIDE, 0, 0.48, 0.08);
  add(neck, new THREE.SphereGeometry(0.13, 10, 8), HIDE, 0, 0.32, 0.07);
  for (let i = 0; i < 6; i++) {
    add(neck, new THREE.BoxGeometry(0.055, 0.10, 0.08), MANE, 0, 0.10 + i * 0.09, -0.07, 0.12, 0, 0);
  }

  const head = new THREE.Group();
  head.position.set(0, 0.66, 0.12);
  head.rotation.x = -0.70;
  neck.add(head);
  add(head, new THREE.SphereGeometry(0.12, 10, 8), HIDE, 0, 0.04, 0.02, 0, 0, 0, 1.05, 0.95, 1.1);
  add(head, new THREE.BoxGeometry(0.14, 0.12, 0.28), RIM, 0, -0.01, 0.24);
  add(head, new THREE.SphereGeometry(0.07, 8, 6), HIDE2, 0, -0.02, 0.38);
  add(head, new THREE.BoxGeometry(0.035, 0.13, 0.045), MANE, -0.055, 0.15, -0.02, 0.18, 0, 0.15);
  add(head, new THREE.BoxGeometry(0.035, 0.13, 0.045), MANE, 0.055, 0.15, -0.02, 0.18, 0, -0.15);
  add(head, new THREE.CylinderGeometry(0.026, 0.03, 0.035, 6), MANE, 0, -0.02, 0.46, Math.PI / 2, 0, 0);
  add(head, new THREE.SphereGeometry(0.02, 6, 5), HIDE2, -0.075, 0.06, 0.08);
  add(head, new THREE.SphereGeometry(0.02, 6, 5), HIDE2, 0.075, 0.06, 0.08);

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
