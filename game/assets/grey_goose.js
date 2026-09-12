// grey_goose — arm A long neck, heavy body
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xD4D4D4, 'fabric');
  const HIDE2 = mat(0x87CEEB, 'foliage');
  const BEAK = mat(0xE8A87C, 'stone', { roughness: 0.55 });
  const DARK = mat(0x4A3728, 'fabric');
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh);
  };
  add(new THREE.SphereGeometry(0.14, 8, 6), HIDE, 0, 0.22, 0);
  add(new THREE.SphereGeometry(0.098, 7, 5), HIDE2, 0, 0.24, -0.049);
  add(new THREE.CylinderGeometry(0.035, 0.035, 0.098, 6), HIDE, 0, 0.28300000000000003, 0.06300000000000001, 0.8, 0, 0);
  add(new THREE.SphereGeometry(0.05, 7, 5), HIDE, 0, 0.318, 0.098);
  add(new THREE.ConeGeometry(0.017499999999999998, 0.055, 5), BEAK, 0, 0.311, 0.1255, Math.PI / 2, 0, 0);
  add(new THREE.BoxGeometry(0.2, 0.04, 0.15400000000000003), HIDE2, 0.098, 0.24, -0.02, 0, 0, 0.25);
  add(new THREE.BoxGeometry(0.2, 0.04, 0.15400000000000003), HIDE2, -0.098, 0.24, -0.02, 0, 0, -0.25);
  add(new THREE.BoxGeometry(0.08, 0.03, 0.11200000000000002), HIDE2, 0, 0.22, -0.12600000000000003);
  
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.099, 5), DARK, 0.04, 0.175, 0.04);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.099, 5), DARK, -0.04, 0.175, 0.04);
  add(new THREE.BoxGeometry(0.05, 0.015, 0.07), DARK, 0.04, 0.01, 0.06);
  add(new THREE.BoxGeometry(0.05, 0.015, 0.07), DARK, -0.04, 0.01, 0.06);
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
