// roe_doe — arm A slender deer without antlers
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xC2B280, 'fabric');
  const HIDE2 = mat(0x4A3728, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.18, 8, 6), HIDE, 0, 0.528, 0.102);
  add(new THREE.SphereGeometry(0.1656, 8, 6), HIDE2, 0, 0.512, -0.153);
  add(new THREE.CylinderGeometry(0.153, 0.162, 0.85, 8), HIDE, 0, 0.5184, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.0504, 0.063, 0.14400000000000002, 7), HIDE, 0, 0.592, 0.323, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.09, 7, 5), HIDE2, 0, 0.656, 0.442);
  add(new THREE.BoxGeometry(0.099, 0.063, 0.126), HIDE, 0, 0.64, 0.527);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, 0.063, 0.704, 0.425);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, -0.063, 0.704, 0.425);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.3825, 5), DARK, 0, 0.496, -0.408, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.0252, 0.0324, 0.408, 6), HIDE2, x, 0.20159999999999997, z);
    add(new THREE.CylinderGeometry(0.018, 0.021599999999999998, 0.1056, 5), DARK, x, 0.0384, z + 0.01);
  };
  leg(0.081, 0.23800000000000002);
  leg(-0.081, 0.23800000000000002);
  leg(0.08639999999999999, -0.23800000000000002);
  leg(-0.08639999999999999, -0.23800000000000002);
  
  
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
