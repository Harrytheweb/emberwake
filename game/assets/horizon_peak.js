// horizon_peak — arm C: jagged extruded ridgeline, blue-grey stone, no pancake
export default function (THREE) {
  const g = new THREE.Group();
  const NEAR = new THREE.MeshStandardMaterial({ color: 0x6A7A78, roughness: 0.96, metalness: 0 });
  NEAR.name = 'stone';
  const MID = new THREE.MeshStandardMaterial({ color: 0x7A8C94, roughness: 0.94, metalness: 0 });
  MID.name = 'stone';
  const FAR = new THREE.MeshStandardMaterial({ color: 0x8FA3B8, roughness: 0.93, metalness: 0 });
  FAR.name = 'stone';
  const GRASS = new THREE.MeshStandardMaterial({ color: 0x1F7A28, roughness: 0.95, metalness: 0 });
  GRASS.name = 'ground';

  const sh = new THREE.Shape();
  sh.moveTo(-35, 0);
  sh.lineTo(-33, 3.2);
  sh.lineTo(-29, 11.5);
  sh.lineTo(-25, 7.0);
  sh.lineTo(-20, 17.4);
  sh.lineTo(-16, 12.2);
  sh.lineTo(-10, 22.0);
  sh.lineTo(-5, 14.5);
  sh.lineTo(0, 19.2);
  sh.lineTo(6, 9.4);
  sh.lineTo(12, 16.6);
  sh.lineTo(18, 8.2);
  sh.lineTo(24, 13.8);
  sh.lineTo(30, 5.4);
  sh.lineTo(35, 0);
  sh.lineTo(-35, 0);

  const ridge = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, {
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 3.2,
    bevelSize: 2.4,
    bevelSegments: 2,
    steps: 1,
  }), NEAR);
  ridge.position.set(0, 0, -5);
  g.add(ridge);

  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(sx, sy, sz);
    g.add(mesh);
  };
  add(new THREE.ConeGeometry(6.5, 14, 6), MID, -10, 16.5, 0.4);
  add(new THREE.ConeGeometry(5.2, 11, 6), FAR, 12, 13.8, -1.2);
  add(new THREE.ConeGeometry(4.6, 9.5, 6), MID, -20, 13.2, 1.1);
  add(new THREE.ConeGeometry(4.2, 8.5, 5), FAR, 24, 10.4, 0.6);
  add(new THREE.BoxGeometry(16, 6, 7), NEAR, 4, 5.2, 3.2, 0.18, 0.35, 0);
  add(new THREE.BoxGeometry(14, 5, 6), MID, -14, 4.4, -3.6, -0.12, -0.4, 0);
  add(new THREE.BoxGeometry(64, 11, 16), MID, 0, 4.6, -10, 0.58, 0, 0);
  add(new THREE.BoxGeometry(60, 10, 15), NEAR, 0, 4.2, 10, -0.58, 0, 0);
  add(new THREE.BoxGeometry(28, 2.4, 10), GRASS, 0, 1.0, 0.4);

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
