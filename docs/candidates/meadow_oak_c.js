// meadow_oak — arm C: forked trunks + flattened foliage disks
export default function (THREE) {
  const g = new THREE.Group();
  const BARK = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.92, metalness: 0 });
  BARK.name = 'timber';
  const LEAF = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.86, metalness: 0 });
  LEAF.name = 'foliage';
  const add = (geo, m, x, y, z, rx = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.rotation.set(rx, 0, rz); g.add(mesh);
  };
  add(new THREE.CylinderGeometry(0.35, 0.55, 3.2, 8), BARK, 0, 1.6, 0);
  add(new THREE.CylinderGeometry(0.16, 0.22, 2.4, 6), BARK, 0.7, 4.0, 0.2, 0, -0.6);
  add(new THREE.CylinderGeometry(0.14, 0.2, 2.2, 6), BARK, -0.65, 4.1, -0.15, 0, 0.55);
  add(new THREE.CylinderGeometry(1.8, 1.8, 0.55, 8), LEAF, 0.2, 6.4, 0.1);
  add(new THREE.CylinderGeometry(1.3, 1.3, 0.45, 8), LEAF, 1.2, 6.0, 0.4);
  add(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 8), LEAF, -1.1, 6.2, -0.3);
  add(new THREE.CylinderGeometry(1.0, 1.0, 0.35, 7), LEAF, 0.1, 7.3, -0.2);
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
