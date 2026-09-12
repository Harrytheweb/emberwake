// mountain_goat — arm C bearded head, high withers
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xD4D4D4, 'fabric');
  const HIDE2 = mat(0xC2B280, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.18, 8, 6), HIDE, 0, 0.545, 0.08639999999999999);
  add(new THREE.SphereGeometry(0.1656, 8, 6), HIDE2, 0, 0.53, -0.1296);
  add(new THREE.CylinderGeometry(0.153, 0.162, 0.72, 8), HIDE, 0, 0.536, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.0504, 0.063, 0.135, 7), HIDE, 0, 0.605, 0.2736, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.08, 7, 5), HIDE2, 0, 0.665, 0.3744);
  add(new THREE.BoxGeometry(0.08800000000000001, 0.055999999999999994, 0.11199999999999999), HIDE, 0, 0.65, 0.44639999999999996);
  add(new THREE.BoxGeometry(0.035, 0.05600000000000001, 0.014000000000000002), DARK, 0.055999999999999994, 0.71, 0.36);
  add(new THREE.BoxGeometry(0.035, 0.05600000000000001, 0.014000000000000002), DARK, -0.055999999999999994, 0.71, 0.36);
  add(new THREE.CylinderGeometry(0.010000000000000002, 0.025, 0.324, 5), DARK, 0, 0.515, -0.34559999999999996, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.0252, 0.0324, 0.425, 6), HIDE2, x, 0.21, z);
    add(new THREE.CylinderGeometry(0.018, 0.021599999999999998, 0.11, 5), DARK, x, 0.04, z + 0.01);
  };
  leg(0.081, 0.2016);
  leg(-0.081, 0.2016);
  leg(0.08639999999999999, -0.2016);
  leg(-0.08639999999999999, -0.2016);
  
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.18, 5), BONE, 0.08, 0.755, 0.34559999999999996);
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.18, 5), BONE, -0.08, 0.755, 0.34559999999999996);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.081, 5), BONE, 0.18, 0.7849999999999999, 0.36, 0, 0, 1.1);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.081, 5), BONE, -0.18, 0.7849999999999999, 0.36, 0, 0, -1.1);
  
  
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
}
