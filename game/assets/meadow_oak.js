// meadow_oak — arm C: forked timber + wide broken canopy, not a lollipop
export default function (THREE) {
  const g = new THREE.Group();
  const BARK = new THREE.MeshStandardMaterial({ color: 0x3A2A22, roughness: 0.93, metalness: 0 });
  BARK.name = 'timber';
  const LEAF = new THREE.MeshStandardMaterial({ color: 0x2A5E26, roughness: 0.88, metalness: 0 });
  LEAF.name = 'foliage';
  const SUN = new THREE.MeshStandardMaterial({ color: 0x3A9A2E, roughness: 0.84, metalness: 0 });
  SUN.name = 'foliage';
  const SHADE = new THREE.MeshStandardMaterial({ color: 0x1A5A22, roughness: 0.9, metalness: 0 });
  SHADE.name = 'foliage';
  const add = (geo, m, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.rotation.set(rx, 0, rz);
    g.add(mesh);
    return mesh;
  };
  add(new THREE.CylinderGeometry(0.42, 0.62, 1.35, 8), BARK, 0, 0.67, 0);
  add(new THREE.CylinderGeometry(0.22, 0.38, 2.6, 8), BARK, 0.08, 2.4, -0.06);
  add(new THREE.CylinderGeometry(0.13, 0.20, 2.4, 6), BARK, 1.15, 3.7, 0.25, 1, 1, 1, 0.15, -1.05);
  add(new THREE.CylinderGeometry(0.12, 0.18, 2.2, 6), BARK, -1.05, 3.75, -0.35, 1, 1, 1, -0.1, 1.0);
  add(new THREE.CylinderGeometry(0.11, 0.16, 1.9, 6), BARK, 0.2, 4.15, 1.05, 1, 1, 1, 0.85, 0.1);
  add(new THREE.CylinderGeometry(0.10, 0.14, 1.6, 6), BARK, -0.15, 4.2, -0.95, 1, 1, 1, -0.7, -0.15);
  add(new THREE.SphereGeometry(1.55, 8, 6), LEAF, 0.15, 5.15, 0.1, 1.55, 0.55, 1.35);
  add(new THREE.SphereGeometry(1.15, 7, 5), SUN, 1.7, 4.85, 0.45, 1.25, 0.48, 1.1);
  add(new THREE.SphereGeometry(1.1, 7, 5), SHADE, -1.55, 4.9, -0.4, 1.2, 0.46, 1.05);
  add(new THREE.SphereGeometry(0.95, 7, 5), LEAF, 0.25, 5.85, -0.85, 1.1, 0.42, 0.95);
  add(new THREE.SphereGeometry(0.85, 6, 5), SUN, -0.35, 5.7, 1.05, 1.05, 0.4, 0.9);
  add(new THREE.SphereGeometry(0.9, 6, 5), SHADE, 0.9, 4.35, 1.15, 1.15, 0.44, 0.95);
  add(new THREE.SphereGeometry(0.75, 6, 5), LEAF, -0.8, 4.2, -1.05, 1.05, 0.4, 0.85);
  add(new THREE.SphereGeometry(0.7, 6, 5), SUN, 1.15, 5.35, -0.55, 1.05, 0.38, 0.88);
  add(new THREE.SphereGeometry(0.65, 6, 5), SHADE, -1.15, 5.4, 0.55, 1.0, 0.36, 0.82);
  add(new THREE.SphereGeometry(0.55, 6, 5), LEAF, 0.05, 4.05, 0.15, 1.2, 0.34, 1.05);
  add(new THREE.SphereGeometry(0.62, 6, 5), SUN, 1.55, 5.55, 0.85, 0.95, 0.36, 0.8);
  add(new THREE.SphereGeometry(0.58, 6, 5), SHADE, -1.45, 5.6, -0.85, 0.92, 0.34, 0.78);
  add(new THREE.SphereGeometry(0.5, 6, 5), LEAF, 0.45, 6.15, 0.35, 0.88, 0.32, 0.72);
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
