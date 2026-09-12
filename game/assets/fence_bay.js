// fence_bay — arm A: posts and rails as boxes
// 2.4 m long, 1.15 m high, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const WOOD = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.84, metalness: 0.0 });
  WOOD.name = 'timber';
  const LIME = new THREE.MeshStandardMaterial({ color: 0x5A4030, roughness: 0.88, metalness: 0.0 });
  LIME.name = 'timber';
  const add = (geo, m, x, y, z) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    g.add(mesh);
    return mesh;
  };
  add(new THREE.BoxGeometry(0.14, 1.18, 0.14), LIME, -1.13, 0.59, 0);
  add(new THREE.BoxGeometry(0.14, 1.18, 0.14), LIME, 1.13, 0.59, 0);
  add(new THREE.BoxGeometry(0.16, 0.08, 0.16), WOOD, -1.13, 1.20, 0);
  add(new THREE.BoxGeometry(0.16, 0.08, 0.16), WOOD, 1.13, 1.20, 0);
  add(new THREE.BoxGeometry(2.28, 0.08, 0.07), WOOD, 0, 0.38, 0);
  add(new THREE.BoxGeometry(2.28, 0.08, 0.07), WOOD, 0, 0.68, 0);
  add(new THREE.BoxGeometry(2.28, 0.08, 0.07), WOOD, 0, 0.98, 0);
  add(new THREE.BoxGeometry(0.06, 0.72, 0.05), WOOD, 0, 0.68, 0.01);
  add(new THREE.BoxGeometry(0.05, 0.7, 0.05), WOOD, -0.55, 0.68, 0);
  add(new THREE.BoxGeometry(0.05, 0.7, 0.05), WOOD, 0.55, 0.68, 0);
  add(new THREE.BoxGeometry(0.08, 0.08, 0.08), WOOD, -1.13, 0.08, 0);
  add(new THREE.BoxGeometry(0.08, 0.08, 0.08), WOOD, 1.13, 0.08, 0);
  add(new THREE.BoxGeometry(2.2, 0.04, 0.04), LIME, 0, 1.12, 0);
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
