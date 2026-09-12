// river_mallard — arm A low body, wide bill
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x2D5A27, 'fabric');
  const HIDE2 = mat(0x7EC850, 'foliage');
  const BEAK = mat(0xF0C27B, 'stone', { roughness: 0.55 });
  const DARK = mat(0x4A3728, 'fabric');
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  add(new THREE.SphereGeometry(0.09, 8, 6), HIDE, 0, 0.12, 0);
  add(new THREE.SphereGeometry(0.063, 7, 5), HIDE2, 0, 0.13999999999999999, -0.0315);
  add(new THREE.CylinderGeometry(0.03, 0.04, 0.063, 6), HIDE, 0, 0.1605, 0.0405, 0.8, 0, 0);
  add(new THREE.SphereGeometry(0.04, 7, 5), HIDE, 0, 0.183, 0.063);
  add(new THREE.ConeGeometry(0.013999999999999999, 0.05, 5), BEAK, 0, 0.1785, 0.088, Math.PI / 2, 0, 0);
  add(new THREE.BoxGeometry(0.13, 0.04, 0.099), HIDE2, 0.063, 0.13999999999999999, -0.02, 0, 0, 0.25);
  add(new THREE.BoxGeometry(0.13, 0.04, 0.099), HIDE2, -0.063, 0.13999999999999999, -0.02, 0, 0, -0.25);
  add(new THREE.BoxGeometry(0.05, 0.03, 0.072), HIDE2, 0, 0.12, -0.081);
  
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.054, 5), DARK, 0.04, 0.096, 0.04);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.054, 5), DARK, -0.04, 0.096, 0.04);
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
