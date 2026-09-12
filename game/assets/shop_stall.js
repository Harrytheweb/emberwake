// shop_stall — arm A: timber frame + cloth awning slabs
// 2.2 x 2.0 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o });
    m.name = n; return m;
  };
  const WOOD = mat(0x4A3728, 'timber');
  const CLOTH = mat(0xE8A87C, 'fabric', { roughness: 0.86, side: THREE.DoubleSide });
  const TOP = mat(0xF0C27B, 'fabric', { roughness: 0.84, side: THREE.DoubleSide });
  const BOARD = mat(0xC2B280, 'timber');
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  for (const [x, z] of [[-1.0, 0.55], [1.0, 0.55], [-1.0, -0.55], [1.0, -0.55]]) {
    add(new THREE.CylinderGeometry(0.05, 0.06, 2.0, 6), WOOD, x, 1.0, z);
  }
  add(new THREE.BoxGeometry(2.2, 0.07, 1.3), WOOD, 0, 1.98, 0);
  add(new THREE.BoxGeometry(2.15, 0.04, 1.05), TOP, 0, 2.06, 0.05);
  add(new THREE.BoxGeometry(2.15, 0.55, 0.04), CLOTH, 0, 1.72, 0.68, 0.25, 0, 0);
  add(new THREE.BoxGeometry(2.0, 0.08, 0.85), BOARD, 0, 0.92, 0);
  add(new THREE.BoxGeometry(0.22, 0.16, 0.22), mat(0x7EC850, 'foliage'), -0.45, 1.04, 0.1);
  add(new THREE.BoxGeometry(0.18, 0.12, 0.18), mat(0xC2B280, 'fabric'), 0.15, 1.02, 0.05);
  add(new THREE.BoxGeometry(0.20, 0.14, 0.16), mat(0x4A3728, 'fabric'), 0.48, 1.03, -0.08);
  add(new THREE.CylinderGeometry(0.07, 0.08, 0.16, 8), mat(0xE8A87C, 'stone'), 0.7, 1.04, 0.12);
  add(new THREE.BoxGeometry(1.9, 0.7, 0.04), CLOTH, 0, 0.55, -0.62);
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
