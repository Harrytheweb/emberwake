// young_hunter — readable human, light leather, no branded cloth, joints
// 1.68 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.02, ...o });
    if (name) m.name = name;
    return m;
  };
  const LINEN = mat(0xB8A890, 'fabric', { roughness: 0.86 });
  const LEATH = mat(0x3A2A22, 'fabric', { roughness: 0.8 });
  const PLATE = mat(0x5A4030, 'fabric', { roughness: 0.74 });
  const SKIN = mat(0xC4A07A, 'fabric', { roughness: 0.68 });
  const HAIR = mat(0x1A120E, 'fabric', { roughness: 0.92 });
  const TROU = mat(0x2A2A2C, 'fabric', { roughness: 0.84 });

  const add = (parent, geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  };

  const hips = new THREE.Group();
  hips.position.set(0, 0.94, 0);
  g.add(hips);
  add(hips, new THREE.BoxGeometry(0.28, 0.14, 0.15), TROU, 0, 0, 0);

  const spine = new THREE.Group();
  spine.position.set(0, 0.08, 0);
  hips.add(spine);
  add(spine, new THREE.CylinderGeometry(0.11, 0.13, 0.40, 8), LINEN, 0, 0.22, 0);
  add(spine, new THREE.SphereGeometry(0.09, 8, 6), LINEN, 0.12, 0.30, 0.01);
  add(spine, new THREE.SphereGeometry(0.09, 8, 6), LINEN, -0.12, 0.30, 0.01);
  add(spine, new THREE.BoxGeometry(0.30, 0.16, 0.18), PLATE, 0, 0.26, 0.02);
  add(spine, new THREE.BoxGeometry(0.10, 0.08, 0.04), LEATH, 0.12, 0.34, 0.08);
  add(spine, new THREE.BoxGeometry(0.10, 0.08, 0.04), LEATH, -0.12, 0.34, 0.08);
  add(spine, new THREE.CylinderGeometry(0.055, 0.06, 0.08, 6), SKIN, 0, 0.46, 0.01);

  const head = new THREE.Group();
  head.position.set(0, 0.52, 0);
  spine.add(head);
  add(head, new THREE.SphereGeometry(0.10, 8, 7), SKIN, 0, 0.08, 0.02);
  add(head, new THREE.SphereGeometry(0.102, 8, 6), HAIR, 0, 0.11, -0.01);
  add(head, new THREE.CylinderGeometry(0.102, 0.102, 0.04, 8), LEATH, 0, 0.16, 0);

  const arm = (side) => {
    const j = new THREE.Group();
    j.position.set(side * 0.17, 0.34, 0);
    spine.add(j);
    add(j, new THREE.CylinderGeometry(0.038, 0.044, 0.26, 6), LINEN, 0, -0.13, 0);
    add(j, new THREE.CylinderGeometry(0.034, 0.036, 0.24, 6), SKIN, 0, -0.36, 0);
    add(j, new THREE.BoxGeometry(0.06, 0.07, 0.08), SKIN, 0, -0.50, 0.01);
    return j;
  };
  const larm = arm(1);
  const rarm = arm(-1);

  const leg = (side) => {
    const j = new THREE.Group();
    j.position.set(side * 0.08, 0.90, 0);
    g.add(j);
    add(j, new THREE.CylinderGeometry(0.05, 0.055, 0.40, 6), TROU, 0, -0.20, 0);
    add(j, new THREE.CylinderGeometry(0.04, 0.046, 0.34, 6), TROU, 0, -0.54, 0);
    add(j, new THREE.BoxGeometry(0.085, 0.06, 0.15), LEATH, 0, -0.74, 0.03);
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
