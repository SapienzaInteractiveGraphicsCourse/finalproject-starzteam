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
    posAtt = -9.75,
    tot = -15,
    foggyDay = false,
    numberOfJumps = 0,
    added = false,
    outrun = false,
    sp = [];


var mappingTracks = [];
var actualTrack = 0;
var actualListTracks = [];
var limitMax = -6;
var limitMin = -6;

var animal,
    sky;

var tracks = [];

var width,
    height;

var crash = false;

function startGame(chosedAnimal, dayNight){
  pickedAnimal = chosedAnimal;
  night = (dayNight == 'true');
  console.log(pickedAnimal, night);
  init();
  animate();
  if(night != false){
    toggleNight();
  }
}

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
  camera.position.set(0, 20, -15);

  tot = -15;

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

function getNewTerrain(posZ = -1){
  var track;
  var pos;
  var numLanes = [1,2,3,4];
  if(posZ == -1){
    if(Math.floor(Math.random()*2) == 0){
      track = new Road(posAtt, numLanes[Math.floor(Math.random()*numLanes.length)]);
      numberOfJumps+=2;
    }
    else {
      track = new River(posAtt);
      numberOfJumps+=3;
    }
  }
  else {
    track = new GrassStart(posAtt);
    numberOfJumps+=1;
  }
  pos = track.occupiedSpace*1.5;
  return {
    track: track,
    pos: pos
  };
}

function drawTerrain() {
  var numLevels = 5;
  var i;
  var track;
  var values;

  values = getNewTerrain(0);
  track = values.track;
  posAtt += values.pos;
  scene.add(track.group);
  tracks.push(track);
  mappingTracks.push(posAtt);
  limitMax = posAtt;
  actualListTracks = tracks.slice(0, 2);

  for(i = 1; i < numLevels; i++){
    values = getNewTerrain();
    track = values.track;
    posAtt += values.pos;
    scene.add(track.group);
    tracks.push(track);
    mappingTracks.push(posAtt);
  }
  actualListTracks = tracks.slice(0, 2);
}

function addTerrain(numLevels){
  var i;
  var track;
  var values;

  for(i = 0; i < numLevels; i++){
    values = getNewTerrain();
    track = values.track;
    posAtt += values.pos;
    scene.add(track.group);
    tracks.push(track);
    mappingTracks.push(posAtt);
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
    scene.updateMatrixWorld();
    if ((tot > animal.boxReference.getWorldPosition(referencePositionAnimal).z + 0.2) ||
      animal.boxReference.getWorldPosition(referencePositionAnimal).x >30 ||
      animal.boxReference.getWorldPosition(referencePositionAnimal).x <-30){
      crash = true;
      outrun = true;
      window.alert("Outrunned!");
    }
    else if(highestScore != 0){
      if((animal.boxReference.getWorldPosition(referencePositionAnimal).z - tot >= 0) && (highestScore < numberOfJumps)){
        tot+=0.04*(1+ (animal.boxReference.getWorldPosition(referencePositionAnimal).z - tot)/4);
      }
      else if (highestScore < numberOfJumps){
        tot+=0.04;
      }

    }
    //camera.position.set(0, 15, tot); //TO UNCOMMENT

    var referencePositionAnimal = new THREE.Vector3();
    animal.boxReference.getWorldPosition(referencePositionAnimal);
    if(referencePositionAnimal.z > limitMax){
      actualTrack++;
      limitMin = limitMax;
      limitMax = mappingTracks[actualTrack];
      actualListTracks = tracks.slice(actualTrack - 1, actualTrack + 2);
      }
    if(referencePositionAnimal.z <= limitMin && actualTrack > 0){
      actualTrack--;
      limitMax = limitMin;
      limitMin = mappingTracks[actualTrack - 1];
      if(actualTrack == 0)
        actualListTracks = tracks.slice(actualTrack, actualTrack + 2);
      else
        actualListTracks = tracks.slice(actualTrack - 1, actualTrack + 2);
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
        vehicles[j].goForward();
      }
    }
  }
  else if(!splash){
    if(!outrun) animal.crashAnimation();
  }
  else{
    animal.sunkAnimation();
    activateSplash(animal.boxReference.getWorldPosition(referencePositionAnimal).z, animal.boxReference.getWorldPosition(referencePositionAnimal).x,150);
  }
  renderer.render(scene, camera);
}

var sign1 = 1;
var sign2 = 1;
function activateSplash(posZ,posX,howMany){
  if(!added){
    for(var i = 0; i < howMany; i++){
      sp.push(new splashParticles(posZ, posX, sign1, sign2));
      sign2 = sign1*sign2;
      sign1 = sign1 * -1;
      console.log(sign1, sign2);
      scene.add(sp[i].group);
    }
    added = true;
  }
  else{
    for(var i = 0; i < howMany; i++){
      sp[i].animateParticles();
    }
  }
}

function checkTrees(position){

  var lengthTrees;
  var i, j;
  var trees;
  var referencePosition = new THREE.Vector3();
  var length = actualListTracks.length;
  for(i = 0; i < length; i++){
    trees = actualListTracks[i].trees;
    lengthTrees = trees.length;
    for(j = 0; j < lengthTrees; j++){
      scene.updateMatrixWorld();
      trees[j].trunk.getWorldPosition(referencePosition);
      if( (Math.abs(referencePosition.x - position.x) <= animal.sideX + trees[j].sideX) &&
          (Math.abs(referencePosition.z - position.z) <= animal.sideZ + trees[j].sideZ) ){
            return true;
          }
    }
  }
  return false;

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
