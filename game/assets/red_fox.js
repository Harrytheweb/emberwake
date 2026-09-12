// red_fox — arm A low long body, full tail
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xE8A87C, 'fabric');
  const HIDE2 = mat(0xC2B280, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.11, 8, 6), HIDE, 0, 0.247, 0.0576);
  add(new THREE.SphereGeometry(0.1012, 8, 6), HIDE2, 0, 0.238, -0.08639999999999999);
  add(new THREE.CylinderGeometry(0.0935, 0.099, 0.48, 8), HIDE, 0, 0.2416, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.030800000000000004, 0.0385, 0.081, 7), HIDE, 0, 0.28300000000000003, 0.1824, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.07, 7, 5), HIDE2, 0, 0.319, 0.2496);
  add(new THREE.BoxGeometry(0.07700000000000001, 0.049, 0.098), HIDE, 0, 0.31, 0.2976);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, 0.049, 0.346, 0.24);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, -0.049, 0.346, 0.24);
  add(new THREE.CylinderGeometry(0.028000000000000004, 0.07, 0.216, 5), DARK, 0, 0.229, -0.2304, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.015400000000000002, 0.019799999999999998, 0.187, 6), HIDE2, x, 0.0924, z);
    add(new THREE.CylinderGeometry(0.011000000000000001, 0.0132, 0.0484, 5), DARK, x, 0.0176, z + 0.01);
  };
  leg(0.0495, 0.13440000000000002);
  leg(-0.0495, 0.13440000000000002);
  leg(0.0528, -0.13440000000000002);
  leg(-0.0528, -0.13440000000000002);
  
  
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
