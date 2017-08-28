function init() {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xaaaaff));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(0, 10, 0));


    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 40, 30);
    spotLight.intensity = 2;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("container").appendChild(webGLRenderer.domElement);

    // call the render function
    var step = 0;


    // setup the control gui
    var controls = new function () {
        // we need the first child, since it's a multimaterial


    };

    var mesh;

    var mtlLoader = new THREE.MTLLoader();
    //mtlLoader.setPath("data/models/");
    //mtlLoader.load('usame.mtl', function(materials) {
        //materials.preload();

        var objLoader = new THREE.OBJLoader();
        //objLoader.setMaterials(materials);
        objLoader.setPath("data/models/");
        objLoader.load('test.obj', function(object) {

          // configure the wings
          var wing2 = object.children[5];
          var wing1 = object.children[4];

          wing1.material.opacity = 0.6;
          wing1.material.transparent = true;
          wing1.material.depthTest = false;
          wing1.material.side = THREE.DoubleSide;

          wing2.material.opacity = 0.6;
          wing2.material.depthTest = false;
          wing2.material.transparent = true;
          wing2.material.side = THREE.DoubleSide;

          object.scale.set(140, 140, 140);
          mesh = object;
          scene.add(mesh);

          object.rotation.x = 0.2;
          object.rotation.y = -1.3;
        //});
    });


    render();


    function render() {

        if (mesh) {
            mesh.rotation.y += 0.006;
        }


        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }
}
window.onload = init;
