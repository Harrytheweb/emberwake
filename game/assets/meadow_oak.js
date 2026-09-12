// meadow_oak — arm A: trunk cylinders + clumped foliage spheres
// 9.4 m, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const BARK = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.92, metalness: 0.0 });
  BARK.name = 'timber';
  const LEAF = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.88, metalness: 0.0 });
  LEAF.name = 'foliage';
  const SUN = new THREE.MeshStandardMaterial({ color: 0x7EC850, roughness: 0.82, metalness: 0.0 });
  SUN.name = 'foliage';
  const add = (geo, m, x, y, z, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    g.add(mesh);
    return mesh;
  };
  add(new THREE.CylinderGeometry(0.42, 0.62, 1.2, 8), BARK, 0, 0.6, 0);
  add(new THREE.CylinderGeometry(0.28, 0.40, 3.4, 8), BARK, 0.04, 2.7, -0.04);
  add(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 6), BARK, 0.55, 4.6, 0.2, 1, 1, 1).rotation.z = -0.55;
  add(new THREE.CylinderGeometry(0.11, 0.16, 1.4, 6), BARK, -0.5, 4.8, -0.15).rotation.z = 0.6;
  add(new THREE.CylinderGeometry(0.10, 0.14, 1.2, 6), BARK, 0.1, 5.1, 0.55).rotation.x = 0.55;
  add(new THREE.SphereGeometry(1.55, 9, 7), LEAF, 0.15, 6.6, 0.1);
  add(new THREE.SphereGeometry(1.15, 8, 6), SUN, 1.15, 6.2, 0.45);
  add(new THREE.SphereGeometry(1.05, 8, 6), LEAF, -1.05, 6.4, -0.2);
  add(new THREE.SphereGeometry(0.95, 8, 6), SUN, 0.2, 7.6, -0.55);
  add(new THREE.SphereGeometry(0.85, 8, 6), LEAF, -0.35, 7.3, 0.85);
  add(new THREE.SphereGeometry(0.7, 7, 5), SUN, 0.85, 7.1, 0.9);
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
