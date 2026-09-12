// reed_heron — arm B tall stilts + S neck
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x87CEEB, 'fabric');
  const HIDE2 = mat(0xD4D4D4, 'foliage');
  const BEAK = mat(0xF0C27B, 'stone', { roughness: 0.55 });
  const DARK = mat(0x4A3728, 'fabric');
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  add(new THREE.SphereGeometry(0.12, 8, 6), HIDE, 0, 0.55, 0);
  add(new THREE.SphereGeometry(0.08399999999999999, 7, 5), HIDE2, 0, 0.5700000000000001, -0.041999999999999996);
  add(new THREE.CylinderGeometry(0.025, 0.025, 0.08399999999999999, 6), HIDE, 0, 0.6040000000000001, 0.054, 0.8, 0, 0);
  add(new THREE.SphereGeometry(0.045, 7, 5), HIDE, 0, 0.634, 0.08399999999999999);
  add(new THREE.ConeGeometry(0.01575, 0.1, 5), BEAK, 0, 0.628, 0.134, Math.PI / 2, 0, 0);
  add(new THREE.BoxGeometry(0.22, 0.04, 0.132), HIDE2, 0.08399999999999999, 0.5700000000000001, -0.02, 0, 0, 0.25);
  add(new THREE.BoxGeometry(0.22, 0.04, 0.132), HIDE2, -0.08399999999999999, 0.5700000000000001, -0.02, 0, 0, -0.25);
  add(new THREE.BoxGeometry(0.06, 0.03, 0.096), HIDE2, 0, 0.55, -0.108);
  
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.4675, 5), DARK, 0.04, 0.340, 0.04);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.4675, 5), DARK, -0.04, 0.340, 0.04);
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
