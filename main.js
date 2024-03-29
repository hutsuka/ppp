import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";  //カメラ制御

console.log(THREE);

const canvas = document.getElementById("canvas");
//scene
const scene = new THREE.Scene();

//sizes
const sizes ={
  width:innerWidth,
  height:innerHeight,
};

//camera
const camera = new THREE .PerspectiveCamera(
75,sizes.width / sizes.height,
0.1,
3000
);
camera.position.set(0.500,1000);
camera.lookAt(0,0,0);
scene.add(camera);

//リサイズ
function onWindowResize(){
  renderer.setSize(window.innerWidth,window.innerHeight);

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

}


//renderer
const renderer = new THREE.WebGLRenderer({
  canvas:canvas,
  antialias:true //滑らかに
});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


//envimage  ３６０度の環境マッピング
// const urls =[
//   "public/gl_r.png",
//   "public/gl_l.png",
//   "public/gl_u.png",
//   "public/gl_d.png",
//   "public/gl_f.png",
//   "public/gl_b.png",
// ];
import gl_r from '/public/gl_r.png';//一度試しに
import gl_l from './public/gl_l.png';
import gl_u from './public/gl_u.png';
import gl_d from './public/gl_d.png';
import gl_f from './public/gl_f.png';
import gl_b from './public/gl_b.png';

const urls = [gl_r, gl_l, gl_u, gl_d, gl_f, gl_b];


// キューブマップテクスチャの作成
const cubeTexture = new THREE.CubeTextureLoader().load(urls);

// シーンの背景にセット
scene.background = cubeTexture;

//controls
const controls = new OrbitControls(camera,canvas);
controls.enableDamping =true; //慣性をつける


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(500); //解像度
const cubeCamera = new THREE.CubeCamera(1,1000,cubeRenderTarget);
scene.add(cubeCamera);




//object
const material = new THREE.MeshBasicMaterial({
  envMap:cubeRenderTarget.texture,
  reflectivity:1,
});
const geometry = new THREE.SphereGeometry(350,50,50);
const sphere = new THREE.Mesh(geometry,material);
sphere.position.set(0,100,0);
scene.add(sphere);




function animate(){
  controls.update(); //カメラ制御
  cubeCamera.update(renderer, scene);
  renderer.render(scene,camera);
  window.requestAnimationFrame(animate);

}
let rot = 0; // 角度
let mouseX = 0; // マウス座標

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener("mousemove", (event) => {
  mouseX = event.pageX;
});

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
  // マウスの位置に応じて角度を設定
  // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
  const targetRot = (mouseX / window.innerWidth) * 360;
  // イージングの公式を用いて滑らかにする
  // 値 += (目標値 - 現在の値) * 減速値
  rot += (targetRot - rot) * 0.02;

  // ラジアンに変換する
  const radian = rot * Math.PI / 180;
  // 角度に応じてカメラの位置を設定
  camera.position.x = 1000 * Math.sin(radian);
  camera.position.z = 1000 * Math.cos(radian);
  // 原点方向を見つめる
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  window.addEventListener("resize",onWindowResize);
  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

animate();

// loading
window.onload = function(){

  setTimeout(() => {
    const loader  = document.querySelector('.loader');
  loader.classList.add('loaded');
  const content =document.querySelector(".container");
  content.style.visibility ="visible";
  },1600);
};
