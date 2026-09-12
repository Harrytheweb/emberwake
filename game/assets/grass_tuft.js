// grass_tuft — arm B: thin extruded blades fanned from a ground knot
// 0.42 m
export default function (THREE) {
  const g = new THREE.Group();
  const A = new THREE.MeshStandardMaterial({ color: 0x7EC850, roughness: 0.86, metalness: 0, side: THREE.DoubleSide });
  A.name = 'foliage';
  const B = new THREE.MeshStandardMaterial({ color: 0x2D5A27, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
  B.name = 'foliage';
  const C = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 0.84, metalness: 0, side: THREE.DoubleSide });
  C.name = 'ground';
  const blade = (h, w, mat) => {
    const sh = new THREE.Shape();
    sh.moveTo(-w, 0); sh.lineTo(w, 0); sh.lineTo(w * 0.2, h); sh.lineTo(-w * 0.15, h * 0.96);
    return new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false });
  };
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const h = 0.28 + (i % 3) * 0.05;
    const mesh = new THREE.Mesh(blade(h, 0.018, i % 2 ? A : B), i % 3 === 0 ? C : (i % 2 ? A : B));
    mesh.position.set(Math.sin(a) * 0.05, 0, Math.cos(a) * 0.05);
    mesh.rotation.y = a;
    mesh.rotation.x = -0.12;
    g.add(mesh);
  }
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), C);
  knot.position.y = 0.02;
  g.add(knot);
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
