// village_cottage — arm A: boxed masses, thatch as stacked wedges
// 4.8 m to ridge, front +Z (door)
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (color, name, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0.02, ...o });
    if (name) m.name = name;
    return m;
  };
  const WALL = mat(0xD4D4D4, 'plaster', { roughness: 0.9 });
  const TIMB = mat(0x4A3728, 'timber', { roughness: 0.8 });
  const THATCH = mat(0xF0C27B, 'ground', { roughness: 0.92 });
  const TH2 = mat(0xC2B280, 'ground', { roughness: 0.9 });
  const STONE = mat(0xD4D4D4, 'stone', { roughness: 0.88 });
  const DARK = mat(0x4A3728, 'timber', { roughness: 0.75 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    g.add(mesh);
    return mesh;
  };
  add(new THREE.BoxGeometry(5.2, 0.38, 4.4), STONE, 0, 0.19, 0);
  add(new THREE.BoxGeometry(4.8, 2.35, 4.0), WALL, 0, 1.55, 0);
  add(new THREE.BoxGeometry(0.16, 2.35, 4.04), TIMB, -2.32, 1.55, 0);
  add(new THREE.BoxGeometry(0.16, 2.35, 4.04), TIMB, 2.32, 1.55, 0);
  add(new THREE.BoxGeometry(4.84, 0.14, 0.14), TIMB, 0, 2.66, 1.96);
  add(new THREE.BoxGeometry(4.84, 0.14, 0.14), TIMB, 0, 2.66, -1.96);
  add(new THREE.BoxGeometry(0.14, 2.2, 0.14), TIMB, -1.1, 1.5, 2.01);
  add(new THREE.BoxGeometry(0.14, 2.2, 0.14), TIMB, 1.1, 1.5, 2.01);
  add(new THREE.BoxGeometry(0.72, 1.55, 0.08), DARK, 0, 1.15, 2.05);
  add(new THREE.BoxGeometry(0.08, 1.55, 0.04), TIMB, 0, 1.15, 2.10);
  add(new THREE.BoxGeometry(0.55, 0.48, 0.08), DARK, -1.45, 1.85, 2.04);
  add(new THREE.BoxGeometry(0.55, 0.48, 0.08), DARK, 1.45, 1.85, 2.04);
  add(new THREE.BoxGeometry(0.55, 0.48, 0.08), DARK, -1.55, 1.75, -2.04);
  add(new THREE.BoxGeometry(5.6, 0.22, 4.7), TH2, 0, 2.82, 0);
  add(new THREE.BoxGeometry(5.4, 0.85, 2.5), THATCH, 0, 3.35, 0.85, 0.48, 0, 0);
  add(new THREE.BoxGeometry(5.4, 0.85, 2.5), THATCH, 0, 3.35, -0.85, -0.48, 0, 0);
  add(new THREE.BoxGeometry(5.2, 0.28, 0.55), TH2, 0, 3.85, 0);
  add(new THREE.CylinderGeometry(0.22, 0.26, 1.1, 8), STONE, 1.7, 4.35, -0.4);
  add(new THREE.BoxGeometry(0.55, 0.22, 0.55), STONE, 1.7, 4.95, -0.4);
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
