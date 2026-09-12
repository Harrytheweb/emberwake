// young_hunter — arm A: boxed masses + cylinder limbs, joints at shoulders/hips
// 1.68 m, light leather plates, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.03, ...o });
    if (name) m.name = name;
    return m;
  };
  const CLOTH = mat(0xC2B280, 'fabric', { roughness: 0.84 });
  const LEATH = mat(0x4A3728, 'fabric', { roughness: 0.7 });
  const PLATE = mat(0xD4D4D4, 'metal', { roughness: 0.55, metalness: 0.22 });
  const SKIN = mat(0xE8A87C, 'fabric', { roughness: 0.62 });
  const HAIR = mat(0x4A3728, 'fabric', { roughness: 0.9 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  };

  const hips = new THREE.Group();
  hips.position.set(0, 0.92, 0);
  g.add(hips);
  add(hips, new THREE.BoxGeometry(0.30, 0.16, 0.16), LEATH, 0, 0, 0);

  const spine = new THREE.Group();
  spine.position.set(0, 0.10, 0);
  hips.add(spine);
  add(spine, new THREE.BoxGeometry(0.32, 0.42, 0.18), CLOTH, 0, 0.22, 0);
  add(spine, new THREE.BoxGeometry(0.34, 0.16, 0.20), PLATE, 0, 0.28, 0.01);
  add(spine, new THREE.BoxGeometry(0.22, 0.08, 0.06), LEATH, 0, 0.08, 0.10);

  const head = new THREE.Group();
  head.position.set(0, 0.50, 0);
  spine.add(head);
  add(head, new THREE.SphereGeometry(0.11, 8, 6), SKIN, 0, 0.10, 0.02);
  add(head, new THREE.SphereGeometry(0.115, 8, 6), HAIR, 0, 0.14, -0.01);
  add(head, new THREE.BoxGeometry(0.16, 0.04, 0.12), HAIR, 0, 0.16, 0.02);

  const arm = (side) => {
    const j = new THREE.Group();
    j.position.set(side * 0.20, 0.36, 0);
    spine.add(j);
    add(j, new THREE.CylinderGeometry(0.045, 0.05, 0.28, 6), CLOTH, 0, -0.14, 0);
    add(j, new THREE.CylinderGeometry(0.04, 0.042, 0.26, 6), SKIN, 0, -0.38, 0);
    add(j, new THREE.BoxGeometry(0.07, 0.08, 0.09), SKIN, 0, -0.52, 0.01);
    return j;
  };
  const larm = arm(1);
  const rarm = arm(-1);

  const leg = (side) => {
    const j = new THREE.Group();
    j.position.set(side * 0.09, 0.88, 0);
    g.add(j);
    add(j, new THREE.CylinderGeometry(0.055, 0.06, 0.42, 6), LEATH, 0, -0.22, 0);
    add(j, new THREE.CylinderGeometry(0.045, 0.05, 0.36, 6), CLOTH, 0, -0.56, 0);
    add(j, new THREE.BoxGeometry(0.09, 0.07, 0.16), LEATH, 0, -0.76, 0.03);
    return j;
  };
  const lleg = leg(1);
  const rleg = leg(-1);

  g.userData.joints = { hips, spine, head, larm, rarm, lleg, rleg };

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
