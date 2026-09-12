// brown_bear — arm A heavy barrel and dish face
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0x4A3728, 'fabric');
  const HIDE2 = mat(0xC2B280, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.34, 8, 6), HIDE, 0, 0.625, 0.144);
  add(new THREE.SphereGeometry(0.3128, 8, 6), HIDE2, 0, 0.6000000000000001, -0.216);
  add(new THREE.CylinderGeometry(0.28900000000000003, 0.30600000000000005, 1.2, 8), HIDE, 0, 0.6100000000000001, 0, Math.PI / 2, 0, 0);
  add(new THREE.SphereGeometry(0.18700000000000003, 7, 5), HIDE2, 0, 0.775, -0.06);
  add(new THREE.CylinderGeometry(0.09520000000000002, 0.119, 0.225, 7), HIDE, 0, 0.7250000000000001, 0.45599999999999996, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.16, 7, 5), HIDE2, 0, 0.8250000000000001, 0.624);
  add(new THREE.BoxGeometry(0.17600000000000002, 0.11199999999999999, 0.22399999999999998), HIDE, 0, 0.8, 0.744);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, 0.11199999999999999, 0.9, 0.6, 0, 0, 0.6);
  add(new THREE.BoxGeometry(0.05, 0.08000000000000002, 0.020000000000000004), DARK, -0.11199999999999999, 0.9, 0.6, 0, 0, -0.6);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.54, 5), DARK, 0, 0.5750000000000001, -0.576, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.04760000000000001, 0.061200000000000004, 0.4675, 6), HIDE2, x, 0.231, z);
    add(new THREE.CylinderGeometry(0.034, 0.0408, 0.12100000000000001, 5), DARK, x, 0.044000000000000004, z + 0.01);
  };
  leg(0.15300000000000002, 0.336);
  leg(-0.15300000000000002, 0.336);
  leg(0.1632, -0.336);
  leg(-0.1632, -0.336);
  
  
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
