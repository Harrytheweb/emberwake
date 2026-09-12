// meadow_bush — arm C: overlapping foliage spheres on a short timber fork
// 1.1 m
export default function (THREE) {
  const g = new THREE.Group();
  const WOOD = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.9, metalness: 0 });
  WOOD.name = 'timber';
  const LEAF = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.86, metalness: 0 });
  LEAF.name = 'foliage';
  const LITE = new THREE.MeshStandardMaterial({ color: 0x7EC850, roughness: 0.8, metalness: 0 });
  LITE.name = 'foliage';
  const add = (geo, m, x, y, z, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); g.add(mesh);
  };
  add(new THREE.CylinderGeometry(0.04, 0.06, 0.35, 6), WOOD, 0.05, 0.16, 0.02);
  add(new THREE.CylinderGeometry(0.03, 0.045, 0.28, 6), WOOD, -0.08, 0.22, -0.04);
  add(new THREE.SphereGeometry(0.38, 8, 6), LEAF, 0.02, 0.62, 0);
  add(new THREE.SphereGeometry(0.28, 7, 5), LITE, 0.28, 0.58, 0.12);
  add(new THREE.SphereGeometry(0.26, 7, 5), LEAF, -0.24, 0.55, -0.08);
  add(new THREE.SphereGeometry(0.22, 7, 5), LITE, 0.06, 0.82, -0.16);
  add(new THREE.SphereGeometry(0.18, 6, 5), LEAF, -0.1, 0.78, 0.2);
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
