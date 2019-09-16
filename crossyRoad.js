'use strict';
var pickedAnimal = "Sheep";

var scene,
    camera,
    renderer,
    controls,
    keyWDown = false,
    keyADown = false,
    keySDown = false,
    keyDDown = false,
    world,
    night = false,
    counter = 0,
    posAtt = -6,
    tot = -15,
    foggyDay = false;


var mappingTracks = [];
var actualTrack = 0;
var actualListTracks = [];
var limit = -6;

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

  if(foggyDay){
  {
    const near = 10;
    const far = 50;
    const color = '#e6e1e2';
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }
  }
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  tot = -15;
  camera.position.set(-10, 15, -15);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableKeys = false;

  addLights();
  drawAnimal();
  drawTerrain();
  drawSky();
  world = document.querySelector('.world');
  world.appendChild(renderer.domElement);

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('keyup', onKeyUp, true);

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
  var numLevels = 4;
  var i;
  var track;
  var numLanes = [1,2,3,4];
  var chosenLanes = 0;
  for(i = 0; i < numLevels; i++){
    if(Math.floor(Math.random()*2) == 0){
      track = new Road(posAtt, numLanes[Math.floor(Math.random()*numLanes.length)]);
      posAtt += track.occupiedSpace*1.5;
      console.log("track", track.occupiedSpace);
    }
    else{
      track = new River(posAtt);
      posAtt += track.occupiedSpace*1.5;
    }
    scene.add(track.group);
    tracks.push(track);
    mappingTracks.push(posAtt);
    actualListTracks.slice(0, 2);
  }
  /*
   * To test only the road or the river
  var track = new Road(0,2);
  scene.add(track.group);
  tracks.push(track);
  */
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

function onKeyDown(event) {
  switch(event.which) {
    case 87:
      keyWDown = true;
      break;
    case 65:
      keyADown = true;
      break;
    case 83:
      keySDown = true;
      break;
    case 68:
      keyDDown = true;
      break;
    default:
      // Code block
  }
}

function onKeyUp(event) {
  switch(event.which) {
    case 87:
      keyWDown = false;
      break;
    case 65:
      keyADown = false;
      break;
    case 83:
      keySDown = false;
      break;
    case 68:
      keyDDown = false;
      break;
    default:
      // Code block
  }
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
    var dif =animal.boxReference.getWorldPosition(referencePositionAnimal).z +30-posAtt
    if(dif >= 0){
      drawTerrain();
    }
    tot+=0.03*(1+ (animal.boxReference.getWorldPosition(referencePositionAnimal).z - tot)/4);
    camera.position.set(-10, 15, tot);
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();
    animal.boxReference.getWorldPosition(referencePositionAnimal);
    if(referencePositionAnimal.z > limit){
      limit = mappingTracks[actualTrack];
      if(actualTrack == 0)
        actualListTracks = tracks.slice(actualTrack, actualTrack + 2);
      else
        actualListTracks = tracks.slice(actualTrack - 1, actualTrack + 2);
      actualTrack++;
    }

    animal.actionOnPressKey();
    var lengthVehicles;
    var i, j;
    var vehicles;
    var length = actualListTracks.length;
    for(i = 0; i < length; i++){
      actualListTracks[i].doCheck();
      vehicles = actualListTracks[i].vehicles;
      lengthVehicles = vehicles.length;
      for(j = 0; j < lengthVehicles; j++){
        vehicles[j].goForward(0.01);
      }
    }
  }
  renderer.render(scene, camera);
}

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
