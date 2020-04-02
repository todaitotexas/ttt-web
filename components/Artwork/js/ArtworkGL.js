import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

//　three.jsの処理を書いていく
export default class ArtworkGL {
  constructor(props) {
    this.props = props;
    this.init();

    let timedelta = 0;
    let timetotal = 0;

    this.mouse = new THREE.Vector2(0, 0);
    this.pause = false;
  }

  init() {
    this.setSize();

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.props.$canvas,
      alpha: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);

    // this.renderer.setClearColor(0x111111, 1);
    this.renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.setSize(this.size.windowW, this.size.windowH);
    // レンダラー：シャドウを有効にする
    // this.renderer.shadowMap.enabled = true;

    // Camera
    const fov = 45;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = (this.size.windowH / 2) / Math.tan(fovRad);

    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.size.windowW / this.size.windowH,
      1, 
      dist * 2
    );
    this.camera.position.set(0, 1, 10);
    // this.camera.position.z = dist; // カメラを遠ざける

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const wrap = new THREE.Group();
    const images = ['roboxer.jpg', 'wearbo.jpg', 'genkan.jpg', 'grubin.jpg', 'syrinx.jpg', 'harvestx.jpg'];
    const images_fl = ['roboxer_fl.jpg', 'wearbo_fl.png', 'genkan_fl.jpg', 'grubin_fl.jpg', 'syrinx_fl.png', 'harvestx_fl.png'];
    for(let i = 0; i<images.length;i++){
      this.makeWall(wrap, images[i], (i-2)*3-1.5, 0);
      this.makeFloor(wrap, images_fl[i], (i-2)*3-1.5, 0);
    }
    this.scene.add(wrap);
    this.camera.lookAt(wrap.position);
    this.wrap = wrap;

    const geo = new THREE.PlaneGeometry(1000, 1000, 1);

    const mat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.5
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.position.y = -1.8;
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.receiveShadow = true;
    this.scene.add(plane);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    directionalLight.position.set(0, 10, 3);
    directionalLight.intensity = 0.8;
    // directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
    this.scene.add(ambient);

    // スポットライト光源を作成
    // const spot = new THREE.SpotLight(0xFFFFFF, 1, 30, Math.PI / 6, 1, 0.5);
    // spot.position.set(0, 8, 6);
    // this.scene.add(spot);

    // const spot2 = new THREE.SpotLight(0xFFFF00, 1, 30, Math.PI / 6, 1, 0.5);
    // spot2.position.set(10, 8, 6);
    // this.scene.add(spot2);

    // const spot3 = new THREE.SpotLight(0x0000FF, 1, 30, Math.PI / 6, 1, 0.5);
    // spot3.position.set(-10, 8, 6);
    // this.scene.add(spot3);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.position.set(800, 800, 800);
    ambientLight.intensity = 0.1
    this.scene.add(ambientLight);

    this.clock = new THREE.Clock();
    this.clock.start();

    this.loop();

    this.add = 0.1;
    this.rot = 0;
  }

  loop() {
    if(this.pause == true){
      return;
    }

    this.timedelta = this.clock.getDelta();
    this.timetotal += this.delta;

    if(this.rot == 360){
      this.rot = 0;
    }else{
      this.rot += 0.2; // 毎フレーム角度を0.5度ずつ足していく
    }
    // ラジアンに変換する
    const radian = (this.rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    this.camera.position.x = 15 * Math.sin(radian);
    this.camera.position.z = 15 * Math.cos(radian);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
  }

  setSize() {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
  }

  makeWall(wrap, src, x, y) {
    // Load Image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(src);

    const geometry = new THREE.BoxGeometry(3, 3, .05);
    const material = new THREE.MeshStandardMaterial({
      map: texture
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.x = x;
    plane.position.z = -1;
    plane.castShadow = true;
    // plane.position.set(0, 0);
    wrap.add(plane);
  }

  makeFloor(wrap, src, x, y) {
    // Load Image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(src);

    const geometry = new THREE.BoxGeometry(3, 3, .05);
    const material = new THREE.MeshStandardMaterial({
      map: texture
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.x = x;
    plane.position.y = -1.5;
    plane.position.z = 0.5;
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.castShadow = true;
    wrap.add(plane);
  }

  mouseMoved(x, y) {
    this.mouse.x = x - (this.size.windowW / 2); // 原点を中心に持ってくる
    this.mouse.y = -y + (this.size.windowH / 2); // 軸を反転して原点を中心に持ってくる
  }

  pause(){
    this.pause = true;
  }

  resume(){
    this.pause = false;
  }

  changeSize(w, h, ratio){
    // レンダラーのサイズを調整する
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h);

    // カメラのアスペクト比を正す
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}