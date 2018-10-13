var mixer = null;
var clock = new THREE.Clock();
const scale = 100.0

// Get width height
const width  = window.innerWidth;
const height = window.innerHeight;

// Render
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 1.0);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;   
//renderer.gammaOutput = true;

// Create scene
const scene  = new THREE.Scene();
//scene.fog = new THREE.Fog(0xffffff, 0, 100);

const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000 );

// Lighting
var ambientLight = new THREE.AmbientLight( 0x111155 );
scene.add( ambientLight );
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0.5, 1 );
/*light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;*/
scene.add( light );

// Water
var waterGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );

var water = new THREE.Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    alpha: 1.0,
    sunDirection: light.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale:  3.7,
    fog: scene.fog !== undefined
  }
);
water.rotation.x = - Math.PI / 2;
scene.add( water );

// Skybox
var sky = new THREE.Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );
var uniforms = sky.material.uniforms;
uniforms.turbidity.value = 10;
uniforms.rayleigh.value = 2;
uniforms.luminance.value = 1;
uniforms.mieCoefficient.value = 0.005;
uniforms.mieDirectionalG.value = 0.8;
var parameters = {
  distance: 400,
  inclination: 0.49,
  azimuth: 0.205
};
var cubeCamera = new THREE.CubeCamera( 1, 20000, 256 );
cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
function updateSun() {
  var theta = Math.PI * ( parameters.inclination - 0.5 );
  var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
  light.position.x = parameters.distance * Math.cos( phi );
  light.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
  light.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );
  sky.material.uniforms.sunPosition.value = light.position.copy( light.position );
  water.material.uniforms.sunDirection.value.copy( light.position ).normalize();
  cubeCamera.update( renderer, scene );
}
updateSun();

/*
// Floor
const meshFloor = new THREE.Mesh(new THREE.BoxGeometry(200, 0.01, 200));
meshFloor.material = new THREE.MeshStandardMaterial({color: 0x7A8446, roughness: 0.0});
meshFloor.receiveShadow = true;
scene.add(meshFloor);
*/

//
var geometry = new THREE.IcosahedronBufferGeometry( 20, 1 );
var count = geometry.attributes.position.count;
var colors = [];
var color = new THREE.Color();
for ( var i = 0; i < count; i += 3 ) {
  color.setHex( Math.random() * 0xffffff );
  colors.push( color.r, color.g, color.b );
  colors.push( color.r, color.g, color.b );
  colors.push( color.r, color.g, color.b );
}
geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
var material = new THREE.MeshStandardMaterial( {
  vertexColors: THREE.VertexColors,
  roughness: 0.0,
  flatShading: true,
  envMap: cubeCamera.renderTarget.texture,
  side: THREE.DoubleSide
} );
sphere = new THREE.Mesh( geometry, material );
//scene.add( sphere );

// Charactor
const loader = new THREE.GLTFLoader();
const url = 'model/LabBear.glb';
loader.load(url, (data) => {
  const gltf = data;
  gltf.scene.traverse( function( node ) {
    if ( node instanceof THREE.Mesh ) { node.castShadow = true; node.receiveShadow = true;}
  });
  const object = gltf.scene;
  object.scale.set(scale, scale, scale);
  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(object);
  const anime = mixer.clipAction(animations[1]);

  anime.play();
  scene.add(object);
});

// OrbitControls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target.set(0,1,0)
controls.enablePan = false;
controls.maxDistance = 100.0;
controls.minDistance = 3.0;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
camera.position.set(0, 2, 90);

var renderScene = new THREE.RenderPass( scene, camera );
var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.renderToScreen = true;
bloomPass.threshold = 0.0;
bloomPass.strength = 0.8;
bloomPass.radius = 0.0;

composer = new THREE.EffectComposer( renderer );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( renderScene );
composer.addPass( bloomPass );

// Rendering
const animation = () => {
  //renderer.render(scene, camera);
  composer.render();
  //controls.update();
  water.material.uniforms.time.value += 1.0 / 100.0;
  requestAnimationFrame(animation);
  if (mixer) mixer.update(clock.getDelta());
};

animation();