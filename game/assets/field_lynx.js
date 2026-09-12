// field_lynx — arm C short tail, tufted ears, thick legs
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xC2B280, 'fabric');
  const HIDE2 = mat(0xE8A87C, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.16, 8, 6), HIDE, 0, 0.359, 0.0744);
  add(new THREE.SphereGeometry(0.1472, 8, 6), HIDE2, 0, 0.34600000000000003, -0.11159999999999999);
  add(new THREE.CylinderGeometry(0.136, 0.14400000000000002, 0.62, 8), HIDE, 0, 0.3512, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.044800000000000006, 0.055999999999999994, 0.117, 7), HIDE, 0, 0.41100000000000003, 0.2356, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.1, 7, 5), HIDE2, 0, 0.463, 0.3224);
  add(new THREE.BoxGeometry(0.11000000000000001, 0.06999999999999999, 0.13999999999999999), HIDE, 0, 0.45, 0.3844);
  add(new THREE.BoxGeometry(0.055, 0.08800000000000001, 0.022000000000000002), DARK, 0.06999999999999999, 0.502, 0.31);
  add(new THREE.BoxGeometry(0.055, 0.08800000000000001, 0.022000000000000002), DARK, -0.06999999999999999, 0.502, 0.31);
  add(new THREE.CylinderGeometry(0.010000000000000002, 0.025, 0.279, 5), DARK, 0, 0.333, -0.2976, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.022400000000000003, 0.0288, 0.272, 6), HIDE2, x, 0.1344, z);
    add(new THREE.CylinderGeometry(0.016, 0.0192, 0.0704, 5), DARK, x, 0.0256, z + 0.01);
  };
  leg(0.07200000000000001, 0.1736);
  leg(-0.07200000000000001, 0.1736);
  leg(0.0768, -0.1736);
  leg(-0.0768, -0.1736);
  
  
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
