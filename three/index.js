var mixer = null;
var clock = new THREE.Clock();
const scale = 10.0

// 幅、高さ取得
const width  = window.innerWidth;
const height = window.innerHeight;

// レンダラの作成、DOMに追加
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 1.0);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
//renderer.gammaOutput = true;

// シーンの作成、カメラの作成と追加、ライトの作成と追加
const scene  = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 1, 7);

const camera = new THREE.PerspectiveCamera(50, width / height, 1, 100 );

//const light  = new THREE.AmbientLight(0xffffff);
//scene.add(light);
var directionalLight = new THREE.DirectionalLight( 0xffffff,4 );
directionalLight.position.set( 0, 0.5, 1 );
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add( directionalLight );

const meshFloor = new THREE.Mesh(new THREE.BoxGeometry(200, 0.01, 200));
meshFloor.material = new THREE.MeshStandardMaterial({color: 0x7A8446, roughness: 0.0});
meshFloor.receiveShadow = true;
scene.add(meshFloor);

const loader = new THREE.GLTFLoader();
const url = 'model/LabBear_v002.glb';
loader.load(url, (data) => {
  const gltf = data;
  gltf.scene.traverse( function( node ) {
    if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true;}
  });
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
controls.target.set(0,1,0)
controls.enablePan = false;
controls.maxDistance = 6.0;
controls.minDistance = 3.0;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
camera.position.set(0, 1, 3.5);

// レンダリング
const animation = () => {
  renderer.render(scene, camera);
  //controls.update();
  requestAnimationFrame(animation);
  if (mixer) mixer.update(clock.getDelta());
};

animation();