// wild_aurochs — arm A horned cattle mass
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
  add(new THREE.SphereGeometry(0.38, 8, 6), HIDE, 0, 0.9825, 0.192);
  add(new THREE.SphereGeometry(0.3496, 8, 6), HIDE2, 0, 0.9550000000000001, -0.288);
  add(new THREE.CylinderGeometry(0.323, 0.342, 1.6, 8), HIDE, 0, 0.966, 0, Math.PI / 2, 0, 0);
  add(new THREE.SphereGeometry(0.20900000000000002, 7, 5), HIDE2, 0, 1.1475, -0.08000000000000002);
  add(new THREE.CylinderGeometry(0.10640000000000001, 0.13299999999999998, 0.24750000000000003, 7), HIDE, 0, 1.0925, 0.6080000000000001, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.16, 7, 5), HIDE2, 0, 1.2025000000000001, 0.8320000000000001);
  add(new THREE.BoxGeometry(0.17600000000000002, 0.11199999999999999, 0.22399999999999998), HIDE, 0, 1.175, 0.992);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, 0.11199999999999999, 1.2850000000000001, 0.8, 0, 0, 0.6);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, -0.11199999999999999, 1.2850000000000001, 0.8, 0, 0, -0.6);
  add(new THREE.CylinderGeometry(0.016, 0.04, 0.7200000000000001, 5), DARK, 0, 0.9275, -0.768, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.053200000000000004, 0.0684, 0.765, 6), HIDE2, x, 0.378, z);
    add(new THREE.CylinderGeometry(0.038000000000000006, 0.0456, 0.198, 5), DARK, x, 0.07200000000000001, z + 0.01);
  };
  leg(0.171, 0.44800000000000006);
  leg(-0.171, 0.44800000000000006);
  leg(0.1824, -0.44800000000000006);
  leg(-0.1824, -0.44800000000000006);
  
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.35, 5), BONE, 0.08, 1.3675000000000002, 0.768);
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.35, 5), BONE, -0.08, 1.3675000000000002, 0.768);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.1575, 5), BONE, 0.18, 1.4224999999999999, 0.8, 0, 0, 1.1);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.1575, 5), BONE, -0.18, 1.4224999999999999, 0.8, 0, 0, -1.1);
  
  
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
