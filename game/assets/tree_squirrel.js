// tree_squirrel — arm C sitting mass + bottle tail
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x4A3728, 'fabric');
  const HIDE2 = mat(0xE8A87C, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.055, 8, 6), HIDE, 0, 0.095, 0.016800000000000002);
  add(new THREE.SphereGeometry(0.0506, 8, 6), HIDE2, 0, 0.09, -0.0252);
  add(new THREE.CylinderGeometry(0.04675, 0.0495, 0.14, 8), HIDE, 0, 0.092, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.015400000000000002, 0.01925, 0.045000000000000005, 7), HIDE, 0, 0.11499999999999999, 0.053200000000000004, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.04, 7, 5), HIDE2, 0, 0.135, 0.0728);
  add(new THREE.BoxGeometry(0.044000000000000004, 0.027999999999999997, 0.055999999999999994), HIDE, 0, 0.13, 0.0868);
  add(new THREE.BoxGeometry(0.02, 0.032, 0.008), DARK, 0.027999999999999997, 0.15, 0.07);
  add(new THREE.BoxGeometry(0.02, 0.032, 0.008), DARK, -0.027999999999999997, 0.15, 0.07);
  add(new THREE.CylinderGeometry(0.022000000000000002, 0.055, 0.06300000000000001, 5), DARK, 0, 0.085, -0.06720000000000001, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.007700000000000001, 0.009899999999999999, 0.068, 6), HIDE2, x, 0.0336, z);
    add(new THREE.CylinderGeometry(0.0055000000000000005, 0.0066, 0.0176, 5), DARK, x, 0.0064, z + 0.01);
  };
  leg(0.02475, 0.039200000000000006);
  leg(-0.02475, 0.039200000000000006);
  leg(0.0264, -0.039200000000000006);
  leg(-0.0264, -0.039200000000000006);
  
  
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
