// meadow_elk — arm A tall neck, palmate antler bars
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
  add(new THREE.SphereGeometry(0.28, 8, 6), HIDE, 0, 0.9249999999999999, 0.162);
  add(new THREE.SphereGeometry(0.25760000000000005, 8, 6), HIDE2, 0, 0.9, -0.243);
  add(new THREE.CylinderGeometry(0.23800000000000002, 0.25200000000000006, 1.35, 8), HIDE, 0, 0.9099999999999999, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.1, 0.098, 0.225, 7), HIDE, 0, 1.025, 0.513, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.13, 7, 5), HIDE2, 0, 1.125, 0.7020000000000001);
  add(new THREE.BoxGeometry(0.14300000000000002, 0.091, 0.182), HIDE, 0, 1.1, 0.8370000000000001);
  add(new THREE.BoxGeometry(0.06, 0.096, 0.024), DARK, 0.091, 1.2, 0.675);
  add(new THREE.BoxGeometry(0.06, 0.096, 0.024), DARK, -0.091, 1.2, 0.675);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.6075, 5), DARK, 0, 0.875, -0.648, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.039200000000000006, 0.0504, 0.7224999999999999, 6), HIDE2, x, 0.357, z);
    add(new THREE.CylinderGeometry(0.028000000000000004, 0.033600000000000005, 0.187, 5), DARK, x, 0.068, z + 0.01);
  };
  leg(0.12600000000000003, 0.37800000000000006);
  leg(-0.12600000000000003, 0.37800000000000006);
  leg(0.13440000000000002, -0.37800000000000006);
  leg(-0.13440000000000002, -0.37800000000000006);
  
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.55, 5), BONE, 0.08, 1.275, 0.648);
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.55, 5), BONE, -0.08, 1.275, 0.648);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.24750000000000003, 5), BONE, 0.18, 1.325, 0.675, 0, 0, 1.1);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.24750000000000003, 5), BONE, -0.18, 1.325, 0.675, 0, 0, -1.1);
  
  
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
