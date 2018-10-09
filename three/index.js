var mixer = null;
var clock = new THREE.Clock();
const scale = 10.0

// 幅、高さ取得
const width  = window.innerWidth;
const height = window.innerHeight;

// レンダラの作成、DOMに追加
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xf3f3f3, 1.0);
document.body.appendChild(renderer.domElement);

// シーンの作成、カメラの作成と追加、ライトの作成と追加
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 100 );
camera.position.set(0, 1, 5);
const light  = new THREE.AmbientLight(0xffffff, 100);
scene.add(light);
var directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
directionalLight.position.set( 0, 0, 1 );
scene.add( directionalLight );

const loader = new THREE.GLTFLoader();
const url = 'model/LabBear_v002.glb';

loader.load(url, (data) => {
  const gltf = data;
  const object = gltf.scene;
  object.scale.set(scale, scale, scale);

  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(object);
  const anime = mixer.clipAction(animations[0]);
  anime.play();
  scene.add(object);
});

// OrbitControls の追加
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 5000.0;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// レンダリング
const animation = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animation);
  if (mixer) mixer.update(clock.getDelta());
};

animation();