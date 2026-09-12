// horizon_peak — arm C: stacked tapering masses, different reading as a ridge
// authored 28 m tall
export default function (THREE) {
  const g = new THREE.Group();
  const ROCK = new THREE.MeshStandardMaterial({ color: 0xD4D4D4, roughness: 0.92, metalness: 0 });
  ROCK.name = 'stone';
  const SHADE = new THREE.MeshStandardMaterial({ color: 0x87CEEB, roughness: 0.88, metalness: 0 });
  SHADE.name = 'stone';
  const EARTH = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 0.9, metalness: 0 });
  EARTH.name = 'ground';
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  add(new THREE.ConeGeometry(11, 28, 7), ROCK, 0, 14, 0);
  add(new THREE.ConeGeometry(7.5, 20, 6), SHADE, 8, 10, -3);
  add(new THREE.ConeGeometry(6.2, 16, 6), ROCK, -7, 8, 2);
  add(new THREE.CylinderGeometry(12, 14, 4, 8), EARTH, 1, 2, 0);
  add(new THREE.BoxGeometry(6, 3.5, 5), ROCK, 3, 18, -1, 0, 0.4, 0.15);
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
