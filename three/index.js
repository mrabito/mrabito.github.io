var init = function() {

  //レンダラー作成
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);

  //シーン作成
  document.body.appendChild(renderer.domElement);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 1000);
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({ color: 0x0000ff});
  var box = new THREE.Mesh(geometry, material);
  box.position.z = -2
  scene.add(box);
  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1, 1, 1);

  //描画
  renderer.render(scene, camera);

  //初回実行
  var update = function(){
    requestAnimationFrame(update);

    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    renderer.render(scene, camera);
  }
  update();
}
window.addEventListener('DOMContentLoaded',init);
