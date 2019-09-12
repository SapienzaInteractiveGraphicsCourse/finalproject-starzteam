'use strict';

var scene,
    camera,
    renderer,
    controls,
    keyWDown,
    world,
    night = false;

var animal,
    sky;

var tracks = [];

var width,
    height;

var crash = false;

function init() {
  console.log("init");
  width = window.innerWidth,
  height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set(-10, 15, -15);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  addLights();
  drawAnimal();
  drawTerrain();
  drawSky();

  world = document.querySelector('.world');
  world.appendChild(renderer.domElement);

  document.addEventListener('keydown', onKeyWDown);
  document.addEventListener('keyup', onKeyWUp);

  document.getElementById("ChangeToChicken").onclick = function(){
    pickedAnimal = "Chicken";
};
  document.getElementById("ChangeToFox").onclick = function(){
    pickedAnimal = "Fox";
  };
  document.getElementById("ChangeToSheep").onclick = function(){
    pickedAnimal = "Sheep";
};
  window.addEventListener('resize', onResize);
}

function addLights() {
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
  scene.add(light);

  const directLight1 = new THREE.DirectionalLight(0xffd798, 0.8);
  directLight1.castShadow = true;
  directLight1.position.set(9.5, 8.2, 8.3);
  scene.add(directLight1);

  const directLight2 = new THREE.DirectionalLight(0xc9ceff, 0.5);
  directLight2.castShadow = true;
  directLight2.position.set(-15.8, 5.2, 8);
  scene.add(directLight2);
}

var pickedAnimal = "Sheep";
function drawAnimal() {
  if(pickedAnimal == "Sheep"){
    animal = new Sheep();
  }
  else if (pickedAnimal == "Fox"){
    animal = new Fox();
  }
  else{
    animal = new Chicken();
  }
  scene.add(animal.group);
}

function drawTerrain() {
  var numLevels = 3;
  var i;
  var track;
  for(i = 0; i < numLevels; i++){
    if(Math.floor(Math.random()*2) == 0)
      track = new Road(i);
    else
      track = new River(i);
    scene.add(track.group);
    tracks.push(track);
  }
}

function drawSky() {
  sky = new Sky();
  sky.showNightSky(night);
  scene.add(sky.group);
}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onKeyWDown(event) {
  var keyCode = event.which;
  if (keyCode == 87) keyWDown = true;
}

function onKeyWUp(event) {
  var keyCode = event.which;
  if (keyCode == 87) keyWDown = false;
}

function rad(degrees) {
  return degrees * (Math.PI / 180);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  if(!crash){
    animal.jumponKeyWDown();
    var length = tracks.length;
    var lengthVehicles;
    var i, j;
    var vehicles;
    for(i = 0; i < length; i++){
      vehicles = tracks[i].vehicles;
      lengthVehicles = vehicles.length;
      for(j = 0; j < lengthVehicles; j++){
        vehicles[j].goForward(0.01);
      }
    }
  }
  renderer.render(scene, camera);
}

//#########################################################################################################
//ANIMAL CLASSES
//#########################################################################################################



//This simple function adds border lines to a given element "elem" which is made by a geometry element "geo"
function addLines(geo, elem){
  var edge = new THREE.EdgesGeometry( geo );
  var lines = new THREE.LineSegments( edge, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
  elem.add(lines);
}


//########################################################################################################
//END
//########################################################################################################

class Sky {
  constructor() {
    this.group = new THREE.Group();

    this.daySky = new THREE.Group();
    this.nightSky = new THREE.Group();

    this.group.add(this.daySky);
    this.group.add(this.nightSky);

    this.colors = {
      day: [0xFFFFFF, 0xEFD2DA, 0xC1EDED, 0xCCC9DE],
      night: [0x5DC7B5, 0xF8007E, 0xFFC363, 0xCDAAFD, 0xDDD7FE],
    };
    this.drawNightLights();
  }
  drawNightLights() {
    const geometry = new THREE.SphereGeometry(0.1, 5, 5);
    const material = new THREE.MeshStandardMaterial({
      color: 0xFF51B6,
      roughness: 1,
      shading: THREE.FlatShading
    });

    for (let i = 0; i < 3; i ++) {
      const light = new THREE.PointLight(0xF55889, 2, 30);
      const mesh = new THREE.Mesh(geometry, material);
      light.add(mesh);

      light.position.set((Math.random() - 2) * 6,
                         -(Math.random() - 2) * 10,
                         (Math.random() - 2) * 10);
      light.updateMatrix();
      light.matrixAutoUpdate = false;

      this.nightSky.add(light);
    }
  }
  showNightSky(condition) {
    if (condition) {
      this.daySky.position.set(100, 100, 100);
      this.nightSky.position.set(0, 0, 0);
    } else {
      this.daySky.position.set(0, 0, 0);
      this.nightSky.position.set(100, 100, 100);
    }
  }
}

const toggleBtn = document.querySelector('.toggle');
toggleBtn.addEventListener('click', toggleNight);

function toggleNight() {
  night = !night;
  toggleBtn.classList.toggle('toggle-night');
  world.classList.toggle('world-night');
  sky.showNightSky(night);
}
init();
animate();
