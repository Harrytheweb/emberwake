// dune_rise — arm B: lathe sand mound
export default function (THREE) {
  const g = new THREE.Group();
  const SAND = new THREE.MeshStandardMaterial({ color: 0xE8A87C, roughness: 0.94, metalness: 0 });
  SAND.name = 'ground';
  const PALE = new THREE.MeshStandardMaterial({ color: 0xF0C27B, roughness: 0.9, metalness: 0 });
  PALE.name = 'ground';
  const pts = [[0, 0], [2.4, 0.02], [3.2, 0.35], [2.6, 0.7], [1.4, 0.95], [0.0, 1.05]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 12), SAND));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 5), PALE);
  cap.position.y = 0.85;
  cap.scale.set(1.3, 0.35, 1);
  g.add(cap);
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
