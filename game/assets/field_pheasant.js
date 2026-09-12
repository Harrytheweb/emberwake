// field_pheasant — arm C long tail and neck
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xE8A87C, 'fabric');
  const HIDE2 = mat(0x7EC850, 'foliage');
  const BEAK = mat(0xC2B280, 'stone', { roughness: 0.55 });
  const DARK = mat(0x4A3728, 'fabric');
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  add(new THREE.SphereGeometry(0.1, 8, 6), HIDE, 0, 0.16, 0);
  add(new THREE.SphereGeometry(0.06999999999999999, 7, 5), HIDE2, 0, 0.18, -0.034999999999999996);
  add(new THREE.CylinderGeometry(0.03, 0.04, 0.06999999999999999, 6), HIDE, 0, 0.20500000000000002, 0.045000000000000005, 0.8, 0, 0);
  add(new THREE.SphereGeometry(0.04, 7, 5), HIDE, 0, 0.22999999999999998, 0.06999999999999999);
  add(new THREE.ConeGeometry(0.013999999999999999, 0.04, 5), BEAK, 0, 0.225, 0.09, Math.PI / 2, 0, 0);
  add(new THREE.BoxGeometry(0.14, 0.04, 0.11000000000000001), HIDE2, 0.06999999999999999, 0.18, -0.02, 0, 0, 0.25);
  add(new THREE.BoxGeometry(0.14, 0.04, 0.11000000000000001), HIDE2, -0.06999999999999999, 0.18, -0.02, 0, 0, -0.25);
  add(new THREE.BoxGeometry(0.16, 0.03, 0.08000000000000002), HIDE2, 0, 0.16, -0.09000000000000001);
  add(new THREE.BoxGeometry(0.02, 0.05, 0.08), HIDE2, 0, 0.25, 0.068);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.07200000000000001, 5), DARK, 0.04, 0.128, 0.04);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.07200000000000001, 5), DARK, -0.04, 0.128, 0.04);
  add(new THREE.BoxGeometry(0.05, 0.015, 0.07), DARK, 0.04, 0.01, 0.06);
  add(new THREE.BoxGeometry(0.05, 0.015, 0.07), DARK, -0.04, 0.01, 0.06);
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
