// earth_badger — arm A low stripe-ready masses
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x4A3728, 'fabric');
  const HIDE2 = mat(0xD4D4D4, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.12, 8, 6), HIDE, 0, 0.164, 0.05039999999999999);
  add(new THREE.SphereGeometry(0.1104, 8, 6), HIDE2, 0, 0.15600000000000003, -0.0756);
  add(new THREE.CylinderGeometry(0.102, 0.108, 0.42, 8), HIDE, 0, 0.1592, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.033600000000000005, 0.041999999999999996, 0.07200000000000001, 7), HIDE, 0, 0.196, 0.1596, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.07, 7, 5), HIDE2, 0, 0.22800000000000004, 0.2184);
  add(new THREE.BoxGeometry(0.07700000000000001, 0.049, 0.098), HIDE, 0, 0.22000000000000003, 0.26039999999999996);
  add(new THREE.BoxGeometry(0.02, 0.032, 0.008), DARK, 0.049, 0.252, 0.21, 0, 0, 0.6);
  add(new THREE.BoxGeometry(0.02, 0.032, 0.008), DARK, -0.049, 0.252, 0.21, 0, 0, -0.6);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.189, 5), DARK, 0, 0.14800000000000002, -0.20159999999999997, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.016800000000000002, 0.021599999999999998, 0.11900000000000001, 6), HIDE2, x, 0.058800000000000005, z);
    add(new THREE.CylinderGeometry(0.012, 0.0144, 0.030800000000000004, 5), DARK, x, 0.011200000000000002, z + 0.01);
  };
  leg(0.054, 0.11760000000000001);
  leg(-0.054, 0.11760000000000001);
  leg(0.0576, -0.11760000000000001);
  leg(-0.0576, -0.11760000000000001);
  
  
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
}
