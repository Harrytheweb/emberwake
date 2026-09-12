// red_stag — arm A + antler bone branches
export default function (THREE) {
  const g = new THREE.Group();
  const mat = (c, n, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0.02, ...o }); m.name = n; return m; };
  const HIDE = mat(0xC2B280, 'fabric');
  const HIDE2 = mat(0x4A3728, 'fabric');
  const DARK = mat(0x4A3728, 'fabric');
  const BONE = mat(0xD4D4D4, 'stone', { roughness: 0.7 });
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); g.add(mesh); return mesh;
  };
  add(new THREE.SphereGeometry(0.24, 8, 6), HIDE, 0, 0.7829999999999999, 0.13799999999999998);
  add(new THREE.SphereGeometry(0.2208, 8, 6), HIDE2, 0, 0.762, -0.207);
  add(new THREE.CylinderGeometry(0.204, 0.216, 1.15, 8), HIDE, 0, 0.7704, 0, Math.PI / 2, 0, 0);
  
  add(new THREE.CylinderGeometry(0.06720000000000001, 0.08399999999999999, 0.189, 7), HIDE, 0, 0.867, 0.43699999999999994, 0.7, 0, 0);
  add(new THREE.SphereGeometry(0.11, 7, 5), HIDE2, 0, 0.951, 0.598);
  add(new THREE.BoxGeometry(0.12100000000000001, 0.077, 0.154), HIDE, 0, 0.9299999999999999, 0.713);
  add(new THREE.BoxGeometry(0.055, 0.08800000000000001, 0.022000000000000002), DARK, 0.077, 1.014, 0.575);
  add(new THREE.BoxGeometry(0.055, 0.08800000000000001, 0.022000000000000002), DARK, -0.077, 1.014, 0.575);
  add(new THREE.CylinderGeometry(0.014000000000000002, 0.035, 0.5175, 5), DARK, 0, 0.741, -0.5519999999999999, 0.5, 0, 0);
  const leg = (x, z) => {
    add(new THREE.CylinderGeometry(0.033600000000000005, 0.043199999999999995, 0.612, 6), HIDE2, x, 0.3024, z);
    add(new THREE.CylinderGeometry(0.024, 0.0288, 0.15839999999999999, 5), DARK, x, 0.0576, z + 0.01);
  };
  leg(0.108, 0.322);
  leg(-0.108, 0.322);
  leg(0.1152, -0.322);
  leg(-0.1152, -0.322);
  
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.42, 5), BONE, 0.08, 1.077, 0.5519999999999999);
  add(new THREE.CylinderGeometry(0.018, 0.03, 0.42, 5), BONE, -0.08, 1.077, 0.5519999999999999);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.189, 5), BONE, 0.18, 1.119, 0.575, 0, 0, 1.1);
  add(new THREE.CylinderGeometry(0.012, 0.018, 0.189, 5), BONE, -0.18, 1.119, 0.575, 0, 0, -1.1);
  
  
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
