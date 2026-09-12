// field_rabbit — arm A primitives, compact crouched body
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xC2B280, 'fabric');
  const HIDE2 = mat(0xE8A87C, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.07, 8, 6), HIDE, 0, 0.108, 0.0264);
  add(new THREE.SphereGeometry(0.06440000000000001, 8, 6), HIDE2, 0, 0.102, -0.039599999999999996);
  add(new THREE.CylinderGeometry(0.059500000000000004, 0.06300000000000001, 0.22, 8), HIDE, 0, 0.10439999999999999, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.019600000000000003, 0.0245, 0.054, 7), HIDE, 0, 0.132, 0.08360000000000001, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.045, 7, 5), HIDE2, 0, 0.156, 0.1144);
  add(new THREE.BoxGeometry(0.0495, 0.0315, 0.063), HIDE, 0, 0.15, 0.1364);
  add(new THREE.BoxGeometry(0.03, 0.048, 0.012), DARK, 0.0315, 0.174, 0.11);
  add(new THREE.BoxGeometry(0.03, 0.048, 0.012), DARK, -0.0315, 0.174, 0.11);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.099, 5), DARK, 0, 0.096, -0.1056, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.009800000000000001, 0.0126, 0.0765, 6), HIDE2, x, 0.0378, z);
    add(new THREE.CylinderGeometry(0.007000000000000001, 0.008400000000000001, 0.019799999999999998, 5), DARK, x, 0.0072, z + 0.01);
  };
  leg(0.03150000000000001, 0.06160000000000001);
  leg(-0.03150000000000001, 0.06160000000000001);
  leg(0.033600000000000005, -0.06160000000000001);
  leg(-0.033600000000000005, -0.06160000000000001);
  
  
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
