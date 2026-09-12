// cloud_puff — arm A: flattened white masses
export default function (THREE) {
  const g = new THREE.Group();
  const C = new THREE.MeshStandardMaterial({
    color: 0xF4F7FA, roughness: 1, metalness: 0, emissive: 0xDDE6F0, emissiveIntensity: 0.18,
  });
  C.name = 'plaster';
  const add = (x, y, z, sx, sy, sz) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), C);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    g.add(m);
  };
  add(0, 0.8, 0, 3.2, 0.85, 2.1);
  add(1.8, 0.95, 0.3, 2.2, 0.7, 1.6);
  add(-1.6, 0.75, -0.2, 2.0, 0.65, 1.5);
  add(0.4, 1.35, -0.4, 1.6, 0.55, 1.2);
  add(-0.5, 0.55, 0.6, 1.8, 0.5, 1.3);
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
