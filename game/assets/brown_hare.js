// brown_hare — arm A longer limbs and ears
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
  add(new THREE.SphereGeometry(0.08, 8, 6), HIDE, 0, 0.161, 0.036);
  add(new THREE.SphereGeometry(0.0736, 8, 6), HIDE2, 0, 0.15400000000000003, -0.054);
  add(new THREE.CylinderGeometry(0.068, 0.07200000000000001, 0.3, 8), HIDE, 0, 0.15680000000000002, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.022400000000000003, 0.027999999999999997, 0.06300000000000001, 7), HIDE, 0, 0.189, 0.11399999999999999, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.05, 7, 5), HIDE2, 0, 0.21700000000000003, 0.156);
  add(new THREE.BoxGeometry(0.05500000000000001, 0.034999999999999996, 0.06999999999999999), HIDE, 0, 0.21000000000000002, 0.186);
  add(new THREE.BoxGeometry(0.045, 0.072, 0.018), DARK, 0.034999999999999996, 0.23800000000000002, 0.15);
  add(new THREE.BoxGeometry(0.045, 0.072, 0.018), DARK, -0.034999999999999996, 0.23800000000000002, 0.15);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.135, 5), DARK, 0, 0.14700000000000002, -0.144, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.011200000000000002, 0.0144, 0.11900000000000001, 6), HIDE2, x, 0.058800000000000005, z);
    add(new THREE.CylinderGeometry(0.008, 0.0096, 0.030800000000000004, 5), DARK, x, 0.011200000000000002, z + 0.01);
  };
  leg(0.036000000000000004, 0.084);
  leg(-0.036000000000000004, 0.084);
  leg(0.0384, -0.084);
  leg(-0.0384, -0.084);
  
  
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
