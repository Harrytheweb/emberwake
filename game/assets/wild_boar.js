// wild_boar — arm A shoulder hump and tusks
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x4A3728, 'fabric');
  const HIDE2 = mat(0xC2B280, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.22, 8, 6), HIDE, 0, 0.474, 0.11399999999999999);
  add(new THREE.SphereGeometry(0.2024, 8, 6), HIDE2, 0, 0.45599999999999996, -0.17099999999999999);
  add(new THREE.CylinderGeometry(0.187, 0.198, 0.95, 8), HIDE, 0, 0.4632, 0, Math.PI / 2, 0, 0);
  add(new THREE.SphereGeometry(0.12100000000000001, 7, 5), HIDE2, 0, 0.582, -0.0475);
  add(new THREE.CylinderGeometry(0.06160000000000001, 0.077, 0.162, 7), HIDE, 0, 0.546, 0.361, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.12, 7, 5), HIDE2, 0, 0.618, 0.494);
  add(new THREE.BoxGeometry(0.132, 0.08399999999999999, 0.16799999999999998), HIDE, 0, 0.6, 0.589);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, 0.08399999999999999, 0.6719999999999999, 0.475, 0, 0, 0.6);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, -0.08399999999999999, 0.6719999999999999, 0.475, 0, 0, -0.6);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.4275, 5), DARK, 0, 0.438, -0.45599999999999996, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.030800000000000004, 0.039599999999999996, 0.357, 6), HIDE2, x, 0.17639999999999997, z);
    add(new THREE.CylinderGeometry(0.022000000000000002, 0.0264, 0.0924, 5), DARK, x, 0.0336, z + 0.01);
  };
  leg(0.099, 0.266);
  leg(-0.099, 0.266);
  leg(0.1056, -0.266);
  leg(-0.1056, -0.266);
  
  
  add(new THREE.CylinderGeometry(0.012, 0.02, 0.12, 5), BONE, 0.06, 0.5568, 0.6839999999999999, 1.2, 0, 0);
  add(new THREE.CylinderGeometry(0.012, 0.02, 0.12, 5), BONE, -0.06, 0.5568, 0.6839999999999999, 1.2, 0, 0);
  
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
