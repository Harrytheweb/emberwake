// hunting_bow — arm B: lathe tips + extruded limb curve
// 1.15 m tall unstrung height as held, front +Z
export default function (THREE) {
  const g = new THREE.Group();
  const WOOD = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.72, metalness: 0.02 });
  WOOD.name = 'timber';
  const CORD = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 0.85, metalness: 0.0 });
  CORD.name = 'fabric';
  const HIDE = new THREE.MeshStandardMaterial({ color: 0xE8A87C, roughness: 0.7, metalness: 0.0 });
  HIDE.name = 'fabric';

  const shape = new THREE.Shape();
  shape.moveTo(-0.018, -0.52);
  shape.lineTo(0.018, -0.52);
  shape.lineTo(0.014, 0);
  shape.lineTo(0.018, 0.52);
  shape.lineTo(-0.018, 0.52);
  shape.lineTo(-0.010, 0);
  shape.lineTo(-0.018, -0.52);
  const limb = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.028, bevelEnabled: false }), WOOD);
  limb.position.z = -0.014;
  g.add(limb);

  const tip = (y, s) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.08, 6), WOOD);
    m.position.set(0, y, 0);
    m.rotation.z = s;
    g.add(m);
  };
  tip(0.56, 0.15);
  tip(-0.56, Math.PI - 0.15);

  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.14, 8), HIDE);
  g.add(grip);

  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.08, 5), CORD);
  string.position.set(0.07, 0, 0);
  g.add(string);

  for (let i = 0; i < 4; i++) {
    const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.004, 5, 8), CORD);
    wrap.position.set(0, -0.18 + i * 0.12, 0);
    wrap.rotation.x = Math.PI / 2;
    g.add(wrap);
  }
  const nock = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.004, 4, 8), CORD);
  nock.position.set(0.07, 0.54, 0);
  nock.rotation.x = Math.PI / 2;
  g.add(nock);

  g.userData.mounts = ['left', 'right'];
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
