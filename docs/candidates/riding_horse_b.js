// riding_horse — arm B: lathe barrel + primitive legs (alt reading)
export default function (THREE) {
  const g = new THREE.Group();
  const HIDE = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 0.72, metalness: 0.04 });
  HIDE.name = 'fabric';
  const DARK = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.85, metalness: 0 });
  DARK.name = 'fabric';
  const pts = [
    [0.02, 0], [0.28, 0.05], [0.32, 0.35], [0.30, 0.7], [0.22, 1.05], [0.0, 1.12],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const barrel = new THREE.Mesh(new THREE.LatheGeometry(pts, 12), HIDE);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0, 1.05, 0);
  g.add(barrel);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.55, 8), HIDE);
  neck.position.set(0, 1.45, 0.55);
  neck.rotation.x = 0.8;
  g.add(neck);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.32), HIDE);
  head.position.set(0, 1.72, 0.82);
  g.add(head);
  for (const [x, z] of [[0.16, 0.32], [-0.16, 0.32], [0.16, -0.35], [-0.16, -0.35]]) {
    const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.95, 7), DARK);
    lg.position.set(x, 0.48, z);
    g.add(lg);
  }
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.4), DARK);
  saddle.position.set(0, 1.42, 0);
  g.add(saddle);
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.7, 6), DARK);
  tail.position.set(0, 1.0, -0.7);
  tail.rotation.x = 0.4;
  g.add(tail);
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
