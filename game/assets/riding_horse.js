// riding_horse — arm A: primitives (boxes, cylinders, spheres) with named joints
// pastoral chestnut, 1.62 m at the withers, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.04, ...o });
    if (name) m.name = name;
    return m;
  };
  const HIDE = mat(0x8a4a28, 'fabric', { roughness: 0.7 });
  const HIDE2 = mat(0x6b3a20, 'fabric', { roughness: 0.74 });
  const MANE = mat(0x4A3728, 'fabric', { roughness: 0.88 });
  const LEATH = mat(0x4A3728, 'fabric', { roughness: 0.62 });
  const BRASS = mat(0xC2B280, 'metal', { roughness: 0.45, metalness: 0.35 });
  const HOOF = mat(0x2a1c14, 'stone', { roughness: 0.9 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  };

  const body = new THREE.Group();
  body.position.set(0, 1.18, 0);
  g.add(body);
  add(body, new THREE.SphereGeometry(0.34, 10, 8), HIDE, 0, 0.06, 0.12);
  add(body, new THREE.SphereGeometry(0.32, 10, 8), HIDE, 0, 0.02, -0.28);
  add(body, new THREE.CylinderGeometry(0.30, 0.33, 0.72, 10), HIDE2, 0, 0.04, -0.06, Math.PI / 2, 0, 0);
  add(body, new THREE.SphereGeometry(0.22, 8, 6), HIDE, 0, 0.16, 0.38);

  const neck = new THREE.Group();
  neck.position.set(0, 0.16, 0.38);
  body.add(neck);
  add(neck, new THREE.CylinderGeometry(0.13, 0.18, 0.36, 8), HIDE, 0, 0.12, 0.10, 0.95, 0, 0);
  add(neck, new THREE.BoxGeometry(0.06, 0.16, 0.28), MANE, 0, 0.22, 0.04, 0.8, 0, 0);

  const head = new THREE.Group();
  head.position.set(0, 0.28, 0.26);
  neck.add(head);
  add(head, new THREE.BoxGeometry(0.16, 0.16, 0.28), HIDE, 0, 0.02, 0.10);
  add(head, new THREE.BoxGeometry(0.12, 0.10, 0.22), HIDE2, 0, -0.02, 0.28);
  add(head, new THREE.BoxGeometry(0.04, 0.10, 0.06), MANE, -0.07, 0.12, 0.02);
  add(head, new THREE.BoxGeometry(0.04, 0.10, 0.06), MANE, 0.07, 0.12, 0.02);
  add(head, new THREE.CylinderGeometry(0.025, 0.03, 0.04, 6), MANE, 0, 0.0, 0.40, Math.PI / 2, 0, 0);

  const saddle = new THREE.Group();
  saddle.position.set(0, 0.30, -0.04);
  body.add(saddle);
  add(saddle, new THREE.BoxGeometry(0.38, 0.07, 0.42), LEATH, 0, 0, 0);
  add(saddle, new THREE.BoxGeometry(0.36, 0.10, 0.08), LEATH, 0, 0.06, 0.18);
  add(saddle, new THREE.BoxGeometry(0.34, 0.12, 0.08), LEATH, 0, 0.07, -0.18);
  add(saddle, new THREE.TorusGeometry(0.055, 0.012, 4, 8), BRASS, 0.20, -0.12, 0.02, Math.PI / 2, 0, 0);
  add(saddle, new THREE.TorusGeometry(0.055, 0.012, 4, 8), BRASS, -0.20, -0.12, 0.02, Math.PI / 2, 0, 0);

  const tail = new THREE.Group();
  tail.position.set(0, 0.06, -0.58);
  body.add(tail);
  add(tail, new THREE.CylinderGeometry(0.04, 0.07, 0.72, 6), MANE, 0, -0.28, -0.08, 0.35, 0, 0);

  const leg = (x, z, rear) => {
    const j = new THREE.Group();
    j.position.set(x, 0.92, z);
    g.add(j);
    const up = rear ? 0.42 : 0.40;
    add(j, new THREE.CylinderGeometry(0.055, 0.07, up, 7), HIDE2, 0, -up / 2, 0);
    add(j, new THREE.CylinderGeometry(0.04, 0.05, 0.38, 6), HIDE, 0, -up - 0.16, 0.01);
    add(j, new THREE.CylinderGeometry(0.045, 0.05, 0.08, 6), HOOF, 0, -up - 0.36, 0.02);
    return j;
  };
  const fl = leg(0.16, 0.28, false);
  const fr = leg(-0.16, 0.28, false);
  const bl = leg(0.17, -0.38, true);
  const br = leg(-0.17, -0.38, true);

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
