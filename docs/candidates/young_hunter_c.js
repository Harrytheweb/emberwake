// young_hunter — arm C: capsule limbs, different plate reading
export default function (THREE) {
  const g = new THREE.Group();
  const CLOTH = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 0.84, metalness: 0 });
  CLOTH.name = 'fabric';
  const LEATH = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.7, metalness: 0 });
  LEATH.name = 'fabric';
  const SKIN = new THREE.MeshStandardMaterial({ color: 0xE8A87C, roughness: 0.6, metalness: 0 });
  SKIN.name = 'fabric';
  const add = (geo, m, x, y, z) => { const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); g.add(mesh); };
  add(new THREE.CapsuleGeometry(0.11, 0.42, 4, 8), CLOTH, 0, 1.22, 0);
  add(new THREE.SphereGeometry(0.11, 8, 6), SKIN, 0, 1.62, 0.02);
  add(new THREE.CapsuleGeometry(0.045, 0.32, 3, 6), CLOTH, 0.18, 1.2, 0);
  add(new THREE.CapsuleGeometry(0.045, 0.32, 3, 6), CLOTH, -0.18, 1.2, 0);
  add(new THREE.CapsuleGeometry(0.055, 0.48, 3, 6), LEATH, 0.08, 0.52, 0);
  add(new THREE.CapsuleGeometry(0.055, 0.48, 3, 6), LEATH, -0.08, 0.52, 0);
  add(new THREE.BoxGeometry(0.28, 0.12, 0.18), LEATH, 0, 1.35, 0.02);
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
