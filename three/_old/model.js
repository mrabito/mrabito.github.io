var scene,      // レンダリングするオブジェクトを入れる
    objmodel,   // モデルデータを入れる
    obj,        // モデルデータの角度などを変更するために重ねる
    camera,     // カメラのオブジェクト
    light,      // 太陽光のような光源のオブジェクト
    ambient,    // 自然光のような光源のオブジェクト
    axis,       // 補助線のオブジェクト
    renderer;   // 画面表示するためのオブジェクト

init();
animate();

function　init (){

    var width  = 1000,  // 表示サイズ 横
        height = 600;   // 表示サイズ 縦

    Radius = 500;       // カメラの半径;

    scene = new THREE.Scene();      // 表示させるための大元、すべてのデータをこれに入れ込んでいく。

    // obj mtl を読み込んでいる時の処理
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
    };

    // obj mtl が読み込めなかったときのエラー処理
    var onError = function ( xhr ) {    };

    // obj mtlの読み込み
    var ObjLoader = new THREE.OBJLoader();
    ObjLoader.load("data/model/usame.obj",  function (object){
        objmodel = object.clone();
        objmodel.scale.set(10, 10, 10);            // 縮尺の初期化
        objmodel.rotation.set(0, 0, 0);         // 角度の初期化
        objmodel.position.set(0, 0, 0);         // 位置の初期化

    // objをObject3Dで包む
        obj = new THREE.Object3D();
        obj.add(objmodel);

        scene.add(obj);                     // sceneに追加
    }, onProgress, onError);        // obj mtl データは(.obj, .mtl. 初期処理, 読み込み時の処理, エラー処理)
                                    // と指定する。

    //light
    light = new THREE.DirectionalLight("white", 1);
    light.position.set(30, 200, 30);
    light.castShadow = true;
    scene.add(light);

    ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    //camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
    camera.position.set(0, 0, 500);
    //camera.position.x = 0;
    //camera.position = new THREE.Vectror3(0,0,0); のような書き方もある


    // hepler
    axis = new THREE.AxisHelper(2000);  // 補助線を2000px分表示
    axis.position.set(0,-1,0);          // 零戦の真ん中に合わせるため、少しずらす
    scene.add(axis);

    // 画面表示
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);        // 画面の大きさを設定
    renderer.setClearColor(0xeeeeee, 1);
    renderer.shadowMapEnabled = true;
    // html の container というid に追加
    document.getElementById('container').appendChild(renderer.domElement);

}

// 値を変更させる処理
function animate() {
    requestAnimationFrame(animate);     // フレームと再描画を制御してくれる関数。
                                        // そのブラウザのタブが非表示のとき、描画頻度が自動で低下するので、
                                        // メモリの消費を抑えることができる。
    cameramove();   // カメラ移動
    render();       // 再描画処理
}

function render() {
    renderer.render(scene, camera); // 再描画
}
