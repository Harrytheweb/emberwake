// riding_horse — arm A: boxed barrel + arched neck, dark hide, joints
// 1.62 m at the withers, ears near 2.0 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.04, ...o });
    if (name) m.name = name;
    return m;
  };
  const HIDE = mat(0x16100C, 'fabric', { roughness: 0.56 });
  const HIDE2 = mat(0x241812, 'fabric', { roughness: 0.64 });
  const RIM = mat(0x3A2A22, 'fabric', { roughness: 0.55 });
  const MANE = mat(0x0A0705, 'fabric', { roughness: 0.9 });
  const LEATH = mat(0x4A3728, 'fabric', { roughness: 0.6 });
  const HOOF = mat(0x0A0806, 'stone', { roughness: 0.88 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  };

  const body = new THREE.Group();
  body.position.set(0, 1.18, 0);
  g.add(body);
  add(body, new THREE.BoxGeometry(0.48, 0.46, 1.28), HIDE, 0, 0.04, 0);
  add(body, new THREE.BoxGeometry(0.52, 0.30, 0.38), HIDE, 0, 0.10, 0.46);
  add(body, new THREE.BoxGeometry(0.54, 0.34, 0.40), HIDE2, 0, 0.12, -0.48);
  add(body, new THREE.SphereGeometry(0.20, 8, 6), HIDE, 0, 0.02, 0.62, 0, 0, 0, 1.15, 0.95, 0.85);
  add(body, new THREE.SphereGeometry(0.22, 8, 6), HIDE2, 0, 0.06, -0.64, 0, 0, 0, 1.2, 1.0, 0.9);
  add(body, new THREE.SphereGeometry(0.16, 8, 6), HIDE2, 0, -0.18, 0.04, 0, 0, 0, 1.15, 0.7, 1.55);
  add(body, new THREE.SphereGeometry(0.12, 7, 5), RIM, 0, 0.22, 0.52);

  const neck = new THREE.Group();
  neck.position.set(0, 0.16, 0.52);
  neck.rotation.x = 0.62;
  neck.userData.restX = 0.62;
  body.add(neck);
  add(neck, new THREE.CylinderGeometry(0.145, 0.20, 0.64, 10), HIDE, 0, 0.28, 0.08);
  add(neck, new THREE.CylinderGeometry(0.12, 0.145, 0.30, 8), HIDE, 0, 0.56, 0.10);
  add(neck, new THREE.BoxGeometry(0.07, 0.46, 0.16), MANE, 0, 0.34, -0.04, 0.15, 0, 0);
  add(neck, new THREE.BoxGeometry(0.06, 0.22, 0.12), MANE, 0, 0.52, -0.02, 0.25, 0, 0);

  const head = new THREE.Group();
  head.position.set(0, 0.68, 0.14);
  head.rotation.x = -0.72;
  neck.add(head);
  add(head, new THREE.BoxGeometry(0.20, 0.17, 0.24), HIDE, 0, 0.02, 0.04);
  add(head, new THREE.BoxGeometry(0.15, 0.13, 0.32), RIM, 0, -0.01, 0.28);
  add(head, new THREE.BoxGeometry(0.12, 0.08, 0.10), HIDE2, 0, -0.04, 0.40);
  add(head, new THREE.BoxGeometry(0.04, 0.12, 0.05), MANE, -0.06, 0.14, -0.02, 0.15, 0, 0.12);
  add(head, new THREE.BoxGeometry(0.04, 0.12, 0.05), MANE, 0.06, 0.14, -0.02, 0.15, 0, -0.12);
  add(head, new THREE.CylinderGeometry(0.028, 0.032, 0.04, 6), MANE, 0, -0.02, 0.46, Math.PI / 2, 0, 0);
  add(head, new THREE.SphereGeometry(0.022, 6, 4), HIDE2, -0.08, 0.05, 0.08);
  add(head, new THREE.SphereGeometry(0.022, 6, 4), HIDE2, 0.08, 0.05, 0.08);

  const saddle = new THREE.Group();
  saddle.position.set(0, 0.30, -0.04);
  body.add(saddle);
  add(saddle, new THREE.BoxGeometry(0.42, 0.07, 0.46), LEATH, 0, 0, 0);
  add(saddle, new THREE.BoxGeometry(0.36, 0.12, 0.08), LEATH, 0, 0.06, 0.18);
  add(saddle, new THREE.BoxGeometry(0.34, 0.14, 0.08), LEATH, 0, 0.07, -0.18);
  add(saddle, new THREE.BoxGeometry(0.04, 0.24, 0.03), LEATH, 0.21, -0.08, 0.02);
  add(saddle, new THREE.BoxGeometry(0.04, 0.24, 0.03), LEATH, -0.21, -0.08, 0.02);

  const tail = new THREE.Group();
  tail.position.set(0, 0.10, -0.70);
  body.add(tail);
  add(tail, new THREE.CylinderGeometry(0.045, 0.09, 0.82, 7), MANE, 0, -0.34, -0.06, 0.28, 0, 0);
  add(tail, new THREE.SphereGeometry(0.08, 6, 5), MANE, 0, -0.70, -0.16);

  const leg = (x, z, rear) => {
    const j = new THREE.Group();
    j.position.set(x, 0.92, z);
    g.add(j);
    const up = rear ? 0.44 : 0.42;
    add(j, new THREE.CylinderGeometry(0.08, 0.10, up, 8), HIDE2, 0, -up / 2, 0.01);
    add(j, new THREE.SphereGeometry(0.075, 6, 5), RIM, 0, -up + 0.02, 0.02);
    add(j, new THREE.CylinderGeometry(0.055, 0.068, 0.40, 7), HIDE, 0, -up - 0.18, 0.02);
    add(j, new THREE.CylinderGeometry(0.058, 0.062, 0.10, 7), HOOF, 0, -up - 0.40, 0.03);
    return j;
  };
  const fl = leg(0.16, 0.38, false);
  const fr = leg(-0.16, 0.38, false);
  const bl = leg(0.17, -0.42, true);
  const br = leg(-0.17, -0.42, true);

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
