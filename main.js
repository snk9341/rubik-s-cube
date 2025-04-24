import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function viewportSize() {
  var d = document.documentElement;
  return {
    height: d.clientHeight,
    width: d.clientWidth,
  };
}

function render() {
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  let vs = viewportSize();
  renderer.setSize(vs.width, vs.height);
  camera.aspect = vs.width / vs.height;
  camera.updateProjectionMatrix();
});

function make_renderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  let vs = viewportSize();
  renderer.setSize(vs.width, vs.height);
  return renderer;
}

function make_camera() {
  const fov = 75;
  let vs = viewportSize();
  const aspect = vs.width / vs.height; // the canvas default
  const near = 0.01;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(1, 1, 1);
  return camera;
}

function make_controls(camera, dom_element, target) {
  const controls = new OrbitControls(camera, dom_element);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 3.13;
  controls.autoRotate = false;
  controls.target = target;
  controls.update();
  return controls;
}

function make_scene() {
  const scene = new THREE.Scene();
  return scene;
}

function make_lines(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // black color for the border
  const lines = new THREE.LineSegments(edges, lineMaterial);
  return lines;
}

let renderer = make_renderer();
console.log(renderer);
let scene = make_scene();
console.log(scene);

let camera = make_camera();
console.log(camera);
renderer.render(scene, camera);
console.log(renderer);

let canvas = renderer.domElement;
console.log(canvas);

let controls = make_controls(camera, canvas, new THREE.Vector3(1, 1, 1));

let down = false;
let previous_x;
let previous_y;
canvas.addEventListener("mousedown", function (e) {
  down = true;
  previous_x = e.clientX;
  previous_y = e.clientY;
  console.log("down");
});

canvas.addEventListener("mouseup", function (e) {
  down = false;
  console.log("up");
});

function make_cube(length, color) {
  let geometry = new THREE.BoxGeometry(length, length, length);
  let material = new THREE.MeshBasicMaterial({ color });
  let mesh = new THREE.Mesh(geometry, material);
  let lines = make_lines(geometry);
  mesh.add(lines);
  return mesh;
}

let colors = [
  0x44aa88, 0x8844aa, 0xaa8844, 0xaa7444, 0xaa3488, 0xaa6854, 0xaa3254,
  0xaa9624,0x44aa88, 0x8844aa, 0xaa8844, 0xaa7444, 0xaa3488, 0xaa6854, 0xaa3254,
  0xaa9624,
];

let cubes = [];
for (let i = 0; i < 3; i++) {
  cubes[i] = [];
  for (let j = 0; j < 3; j++) {
    cubes[i][j] = [];
    for (let k = 0; k < 3; k++) {
      cubes[i][j][k] = make_cube(1, colors[i + 2 * j + 3 * k]);
      cubes[i][j][k].position.x = i;
      cubes[i][j][k].position.y = j;
      cubes[i][j][k].position.z = k;
      cubes[i][j][k].name = [i, j, k];
      scene.add(cubes[i][j][k]);

    }
  }
}

renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

const refresh = setInterval(make_refresh, 1000 / 60);

function make_refresh() {
  controls.update();
  requestAnimationFrame(render);
}


const raycaster = new THREE.Raycaster();

document.addEventListener('click', onMouseClick);

function onMouseClick(event) {
  let coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
  );


  raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(targets, false);
  if (intersections.length > 0) {
    console.log(intersections);

    let vecteur = new THREE.Vector3(1, 1, 0);
    let angle = Math.PI / 2;
    console.log(intersections[0].object.name);

    let translate = [];
    /*let translate = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        translate.push(cubes[i][j][0]);
        console.log(cubes[i][j][0].name)
      }
    }
    translate.forEach(function(cube) {
      cube.translateOnAxis (vecteur, angle);
    })*/
  } else {
    console.log("no");
  }
}

let targets = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      targets.push(cubes[i][j][k]);
    }
  }
}

  let geometry = new THREE.BufferGeometry();
  let sommets = new Float32Array([
    3, 3, 0,
    4, 4, 0,
    2, 4, 0,
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(sommets, 3));
  let material = new THREE.MeshBasicMaterial(0xaa3254);
  const mesh = new THREE.Mesh( geometry, material );
  let lines = make_lines(geometry);
  mesh.add(lines);


scene.add(mesh);
