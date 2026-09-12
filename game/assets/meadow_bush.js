// meadow_bush — arm C: low irregular hedge clump
export default function (THREE) {
  const g = new THREE.Group();
  const WOOD = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.9, metalness: 0 });
  WOOD.name = 'timber';
  const LEAF = new THREE.MeshStandardMaterial({ color: 0x2A5E26, roughness: 0.86, metalness: 0 });
  LEAF.name = 'foliage';
  const LITE = new THREE.MeshStandardMaterial({ color: 0x3A9A2E, roughness: 0.8, metalness: 0 });
  LITE.name = 'foliage';
  const add = (geo, m, x, y, z, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); g.add(mesh);
  };
  add(new THREE.CylinderGeometry(0.04, 0.06, 0.28, 6), WOOD, 0.06, 0.12, 0.02);
  add(new THREE.CylinderGeometry(0.03, 0.045, 0.22, 6), WOOD, -0.1, 0.16, -0.05);
  add(new THREE.SphereGeometry(0.42, 8, 6), LEAF, 0.02, 0.42, 0, 1.45, 0.58, 1.2);
  add(new THREE.SphereGeometry(0.30, 7, 5), LITE, 0.38, 0.38, 0.12, 1.2, 0.48, 1.0);
  add(new THREE.SphereGeometry(0.28, 7, 5), LEAF, -0.34, 0.36, -0.1, 1.15, 0.46, 0.95);
  add(new THREE.SphereGeometry(0.22, 6, 5), LITE, 0.06, 0.58, -0.16, 1.05, 0.4, 0.85);
  add(new THREE.SphereGeometry(0.20, 6, 5), LEAF, -0.14, 0.52, 0.22, 1.0, 0.38, 0.8);
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
