// wild_sheep — arm A rounded fleece mass
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
  add(new THREE.SphereGeometry(0.22, 8, 6), HIDE, 0, 0.46499999999999997, 0.08399999999999999);
  add(new THREE.SphereGeometry(0.2024, 8, 6), HIDE2, 0, 0.44999999999999996, -0.126);
  add(new THREE.CylinderGeometry(0.187, 0.198, 0.7, 8), HIDE, 0, 0.45599999999999996, 0, Math.PI / 2, 0, 0);
  add(new THREE.SphereGeometry(0.12100000000000001, 7, 5), HIDE2, 0, 0.5549999999999999, -0.034999999999999996);
  add(new THREE.CylinderGeometry(0.06160000000000001, 0.077, 0.135, 7), HIDE, 0, 0.525, 0.26599999999999996, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.09, 7, 5), HIDE2, 0, 0.585, 0.364);
  add(new THREE.BoxGeometry(0.099, 0.063, 0.126), HIDE, 0, 0.57, 0.434);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, 0.063, 0.63, 0.35, 0, 0, 0.6);
  add(new THREE.BoxGeometry(0.04, 0.064, 0.016), DARK, -0.063, 0.63, 0.35, 0, 0, -0.6);
  add(new THREE.CylinderGeometry(0.012, 0.03, 0.315, 5), DARK, 0, 0.435, -0.33599999999999997, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.030800000000000004, 0.039599999999999996, 0.357, 6), HIDE2, x, 0.17639999999999997, z);
    add(new THREE.CylinderGeometry(0.022000000000000002, 0.0264, 0.0924, 5), DARK, x, 0.0336, z + 0.01);
  };
  leg(0.099, 0.196);
  leg(-0.099, 0.196);
  leg(0.1056, -0.196);
  leg(-0.1056, -0.196);
  
  
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
