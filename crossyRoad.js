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
  animal = new Sheep();
  //animal = new Chicken();
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

//#######################
//SHEEP
//#######################

class Sheep {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.y = 0.4;
    this.group.position.z = -6;


    const boxReferenceGeometry = new THREE.BoxGeometry(2.2, 2.4, 2.5);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.boxReference.position.set(0, 0, 0.15);
    this.group.add(this.boxReference);

    this.boxReference.visible = false;

    this.sideX = 1.1; //lato box / 2
    this.sideY = 1.2;
    this.sideZ = 1.25;

    this.woolMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaf8b,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b4553,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;
    this.drawBody();
    this.drawHead();
    this.drawLegs();
  }
  drawBody() {
    const bodyGeometry = new THREE.IcosahedronGeometry(1.45, 1);
    const body = new THREE.Mesh(bodyGeometry, this.woolMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);
  }
  drawHead() {
    const head = new THREE.Group();
    head.position.set(0, 0.65, 1.3);
    head.rotation.x = rad(-30);
    this.group.add(head);

    const foreheadGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7);
    const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
    forehead.castShadow = true;
    forehead.receiveShadow = true;
    forehead.position.y = -0.15;
    head.add(forehead);

    const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1);
    const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
    face.castShadow = true;
    face.receiveShadow = true;
    face.position.y = -0.65;
    face.rotation.y = rad(45);
    head.add(face);

    const woolGeometry = new THREE.BoxGeometry(0.80, 0.3, 0.9);
    const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
    wool.position.set(0, 0.12, 0.07);
    wool.rotation.x = rad(20);
    head.add(wool);

    const rightEyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(0.35, -0.48, 0.35);
    rightEye.rotation.set(rad(130.8), 0, rad(-45));
    head.add(rightEye);

    const leftEye = rightEye.clone();
    leftEye.position.x = -rightEye.position.x;
    leftEye.rotation.z = -rightEye.rotation.z;
    head.add(leftEye);

    const rightEarGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3);
    rightEarGeometry.translate(0, -0.25, 0);
    this.rightEar = new THREE.Mesh(rightEarGeometry, this.skinMaterial);
    this.rightEar.castShadow = true;
    this.rightEar.receiveShadow = true;
    this.rightEar.position.set(0.35, -0.12, -0.07);
    this.rightEar.rotation.set(rad(20), 0, rad(50));
    head.add(this.rightEar);

    this.leftEar = this.rightEar.clone();
    this.leftEar.position.x = -this.rightEar.position.x;
    this.leftEar.rotation.z = -this.rightEar.rotation.z;
    head.add(this.leftEar);
  }
  drawLegs() {
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 6);
    legGeometry.translate(0, -0.40, 0);
    this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
    this.frontRightLeg.castShadow = true;
    this.frontRightLeg.receiveShadow = true;
    this.frontRightLeg.position.set(0.7, -0.8, 0.5);
    this.frontRightLeg.rotation.x = rad(-12);
    this.group.add(this.frontRightLeg);

    this.frontLeftLeg = this.frontRightLeg.clone();
    this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
    this.group.add(this.frontLeftLeg);

    this.backRightLeg = this.frontRightLeg.clone();
    this.backRightLeg.position.z = -this.frontRightLeg.position.z;
    this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
    this.group.add(this.backRightLeg);

    this.backLeftLeg = this.frontLeftLeg.clone();
    this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
    this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
    this.group.add(this.backLeftLeg);
  }
  jump(speed) {
    this.vAngle += speed;
    this.group.position.y = Math.sin(this.vAngle) + 1.38;

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4;

    this.frontRightLeg.rotation.x = -legRotation;
    this.backRightLeg.rotation.x = -legRotation;
    this.frontLeftLeg.rotation.x = -legRotation;
    this.backLeftLeg.rotation.x = -legRotation;

    this.group.position.z = this.group.position.z + 0.025;

    const earRotation = Math.sin(this.vAngle) * Math.PI / 3 + 1.5;
    this.rightEar.rotation.z = earRotation;
    this.leftEar.rotation.z = -earRotation;
  }
  jumponKeyWDown() {
    if (keyWDown) {
      this.jump(0.06);
    } else {
      if (this.group.position.y <= 0.4) return;
      this.jump(0.08);
    }
  }
}

//#######################
//CHICKEN
//#######################

class Chicken{
  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = -0.55; //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)

    /*
    const boxReferenceGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.9);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    boxReference.position.set(0, -0.5, 0.05);
    scene.add(boxReference);
    */

    this.referenceX = 0;
    this.referenceY = -0.5;
    this.referenceZ = 0.05;

    this.sideX = 0.4;
    this.sideY = 0.6;
    this.sideZ = 0.45;

    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.redMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b4553,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;
    this.drawBody();
    this.drawHead();
    this.drawLegs();
  }
  drawBody() {
    const bodyGeometry = new THREE.BoxGeometry(0.7, 0.5, 1);
    const body = new THREE.Mesh(bodyGeometry, this.skinMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    const leftWingGeometry = new THREE.BoxGeometry(0.23, 0.16, 0.33);
    const leftWing = new THREE.Mesh(leftWingGeometry, this.skinMaterial);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    leftWing.position.set(0.4, 0, 0);
    body.add(leftWing);

    const rightWingGeometry = new THREE.BoxGeometry(0.23, 0.16, 0.33);
    const rightWing = new THREE.Mesh(rightWingGeometry, this.skinMaterial);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    rightWing.position.set(-0.4, 0, 0);
    body.add(rightWing);

  }
  drawHead() {
    const headGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, this.skinMaterial);
    //head.castShadow = true;
    head.receiveShadow = true;
    head.position.set(0, 0.5, 0.25);
    this.group.add(head);

    const noseGeometry = new THREE.BoxGeometry(0.17, 0.17, 0.24);
    const nose = new THREE.Mesh(noseGeometry, this.orangeMaterial);
    //head.castShadow = true;
    nose.receiveShadow = true;
    nose.position.set(0, 0, 0.37);
    head.add(nose);

    const wattlesGeometry = new THREE.BoxGeometry(0.17, 0.17, 0.17);
    const wattles = new THREE.Mesh(wattlesGeometry, this.redMaterial);
    //wattles.castShadow = true;
    wattles.receiveShadow = true;
    wattles.position.set(0, -0.17, 0.335);
    head.add(wattles);

    const leftEyeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const leftEye = new THREE.Mesh(leftEyeGeometry, this.eyeMaterial);
    //leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    leftEye.position.set(0.37, 0.1, 0.1);
    head.add(leftEye);

    const rightEyeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.eyeMaterial);
    //rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(-0.37, 0.1, 0.1);
    head.add(rightEye);

    const crestGeometry = new THREE.BoxGeometry(0.14, 0.14, 0.3);
    const crest = new THREE.Mesh(crestGeometry, this.redMaterial);
    //crest.castShadow = true;
    crest.receiveShadow = true;
    crest.position.set(0, 0.32, 0); //sarebbe 0.5/2 + 0.14/2 = 0.32
    head.add(crest);
  }
  drawLegs() {
    const leftLegGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
    const leftLeg = new THREE.Mesh(leftLegGeometry, this.orangeMaterial);
    //leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    leftLeg.position.set(0.175, -0.425, 0);
    this.group.add(leftLeg);

    const leftPawGeometry = new THREE.BoxGeometry(0.27, 0.07, 0.2);
    const leftPaw = new THREE.Mesh(leftPawGeometry, this.orangeMaterial);
    //leftPaw.castShadow = true;
    leftPaw.receiveShadow = true;
    leftPaw.position.set(0, -0.2125, 0);
    leftLeg.add(leftPaw);

    const leftNail1Geometry = new THREE.BoxGeometry(0.0675, 0.07, 0.1);
    const leftNail1 = new THREE.Mesh(leftNail1Geometry, this.orangeMaterial);
    //leftNail1.castShadow = true;
    leftNail1.receiveShadow = true;
    leftNail1.position.set(0.10125, 0, 0.15);
    leftPaw.add(leftNail1);

    const leftNail2Geometry = new THREE.BoxGeometry(0.0675, 0.07, 0.1);
    const leftNail2 = new THREE.Mesh(leftNail2Geometry, this.orangeMaterial);
    //leftNail2.castShadow = true;
    leftNail2.receiveShadow = true;
    leftNail2.position.set(-0.10125, 0, 0.15);
    leftPaw.add(leftNail2);

    const rightLegGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16);
    const rightLeg = new THREE.Mesh(rightLegGeometry, this.orangeMaterial);
    //rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    rightLeg.position.set(-0.175, -0.425, 0);
    this.group.add(rightLeg);

    const rightPawGeometry = new THREE.BoxGeometry(0.27, 0.07, 0.2);
    const rightPaw = new THREE.Mesh(rightPawGeometry, this.orangeMaterial);
    //rightPaw.castShadow = true;
    rightPaw.receiveShadow = true;
    rightPaw.position.set(0, -0.2125, 0);
    rightLeg.add(rightPaw);

    const rightNail1Geometry = new THREE.BoxGeometry(0.0675, 0.07, 0.1);
    const rightNail1 = new THREE.Mesh(rightNail1Geometry, this.orangeMaterial);
    //rightNail1.castShadow = true;
    rightNail1.receiveShadow = true;
    rightNail1.position.set(0.10125, 0, 0.15);
    rightPaw.add(rightNail1);

    const rightNail2Geometry = new THREE.BoxGeometry(0.0675, 0.07, 0.1);
    const rightNail2 = new THREE.Mesh(rightNail2Geometry, this.orangeMaterial);
    //rightNail2.castShadow = true;
    rightNail2.receiveShadow = true;
    rightNail2.position.set(-0.10125, 0, 0.15);
    rightPaw.add(rightNail2);

  }

  jump(speed) {
    this.vAngle += speed;
    this.group.position.y = Math.sin(this.vAngle) + 1.38;
    this.referenceY = Math.sin(this.vAngle) + 1.3;

    this.group.position.z = this.group.position.z + 0.025;
    this.referenceZ += 0.025;

  }
  jumponKeyWDown() {
    //fai come il cavallo che cammina
    //alterni le due gambe se una va indietro l'altra va in avanti (puoi usare sin e cos)
    //nota che appena clicchi l'animazione deve partire e finire in posizione di riposo (zampe sullo stesso livello)

    //puoi fare dei ponti levaoti al posto delle navi che si muovono

    if (keyWDown) {
      this.jump(0.06);
    } else {
      if (this.group.position.y <= 0.4) return;
      this.jump(0.08);
    }
  }
}

//########################################################################################################
//END
//########################################################################################################

class Car {
  constructor(animal) {
    this.animalReference = animal; //needed to check if car runs over the animal

    this.group = new THREE.Group();

    var angle = 0;
    var positionX = -1.9;
    var positionZ = -7;
    this.direction = 1;

    if(Math.floor(Math.random()*2) == 0){
      positionX = 1.9;
      positionZ = 7;
      angle = 180;
      this.direction = -1;
    }

    this.group.position.set(positionX, 1, positionZ); //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.rotation.set(0, rad(angle), 0);


    var boxReferenceGeometry = new THREE.BoxGeometry(1.8, 2, 3.47);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.boxReference.position.set(0.65, 0.2, 1.75);
    this.group.add(this.boxReference);

    this.sideZ = 1.5*0.9; //lato box / 2 e occhio allo scaling
    this.sideY = 1.5*1;
    this.sideX = 1.5*1.735;

    this.boxReference.visible = false;


    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.redMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x4b4553,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;
    this.drawBody();
    this.drawWindscreen();
  }
  drawBody(){ //ruote e specchietti
    var length = 1.3, width = 0.35; //lenght++ right, width++ up

    var shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    var extrudeSettings = {
    	steps: 2,
    	depth: 3.5, //depth++ closer
    	bevelEnabled: true,
    	bevelThickness: 0.2,
    	bevelSize: 0.2,
    	bevelOffset: 0.1,
    	bevelSegments: 5
    };

    var bodyGeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var body = new THREE.Mesh( bodyGeometry, this.redMaterial ) ;
    body.castShadow = true;
    body.receiveShadow = true;
    //body.position.set(0.175, -0.425, 0);
    this.group.add(body);

    const backRightTireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const backRightTire = new THREE.Mesh(backRightTireGeometry, this.blackMaterial);
    backRightTire.castShadow = true;
    backRightTire.receiveShadow = true;
    backRightTire.position.set(-0.3, -0.425, 0.5);
    backRightTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    this.group.add(backRightTire);

    const backLeftTireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const backLeftTire = new THREE.Mesh(backLeftTireGeometry, this.blackMaterial);
    backLeftTire.castShadow = true;
    backLeftTire.receiveShadow = true;
    backLeftTire.position.set(1.6, -0.425, 0.5);
    backLeftTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    this.group.add(backLeftTire);

    const frontRightTireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const frontRightTire = new THREE.Mesh(frontRightTireGeometry, this.blackMaterial);
    frontRightTire.castShadow = true;
    frontRightTire.receiveShadow = true;
    frontRightTire.position.set(-0.3, -0.425, 3);
    frontRightTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    this.group.add(frontRightTire);

    const frontLeftTireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const frontLeftTire = new THREE.Mesh(frontLeftTireGeometry, this.blackMaterial);
    frontLeftTire.castShadow = true;
    frontLeftTire.receiveShadow = true;
    frontLeftTire.position.set(1.6, -0.425, 3);
    frontLeftTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    this.group.add(frontLeftTire);

  }
  drawWindscreen(){

    var length = 1.2, width = 0.4; //lenght++ right, width++ up

    var shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    var extrudeSettings = {
    	steps: 2,
    	depth: 2, //depth++ closer
    	bevelEnabled: true,
    	bevelThickness: 0.2,
    	bevelSize: 0.1,
    	bevelOffset: 0.05,
    	bevelSegments: 5
    };

    var windscreenGeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var windscreen = new THREE.Mesh( windscreenGeometry, this.redMaterial ) ;
    windscreen.castShadow = true;
    windscreen.receiveShadow = true;
    windscreen.position.set(0.07, 0.75, 0.3);
    this.group.add(windscreen);

    /*
    const windscreenGeometry = new THREE.BoxGeometry(1.2, 0.8, 2);
    const windscreen = new THREE.Mesh(windscreenGeometry, this.redMaterial);
    //windscreen.castShadow = true;
    windscreen.receiveShadow = true;
    windscreen.position.set(0.65, 0.9, 1.3);
    this.group.add(windscreen);*/
  }
  goForward(speed){ //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.position.z += this.direction*speed;

    //to find these values:
    //dobbiamo trovare un BoxGeometry che racchiude tutto l'oggetto ed estrarne il centro. Da quello si può valutare se due oggetti si toccano
    //se abs(c1 - c2) <= l1/2  + l2/2 sia per x che z (and)
    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();

    this.boxReference.getWorldPosition(referencePosition);
    this.animalReference.boxReference.getWorldPosition(referencePositionAnimal);
    if( (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX + this.animalReference.sideX) &&
        (Math.abs(referencePosition.y - referencePositionAnimal.y) <= this.sideY + this.animalReference.sideY) &&
        (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ + this.animalReference.sideZ) ){
          crash = true;
          window.alert("CRASH");
        }
  }
}

class Terrain {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.y = -1.35;
    this.group.scale.set(1.5, 1.5, 1.5);

    this.material = new THREE.MeshStandardMaterial({
      color: 0x725428,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;

    this.drawParts();

    this.group.traverse((part) => {
      part.castShadow = true;
      part.receiveShadow = true;
    });
  }
  drawParts() {
    const partGeometry = new THREE.BoxGeometry(50, 0.05, 50);
    this.upperPart = new THREE.Mesh(partGeometry, this.material);
    this.group.add(this.upperPart);
  }
}

const hightRoad = 0.1;
const widthRoad = 2.1;
const depthRoad = 15;
const distRoad = 1.30;
const highGrass = hightRoad;
const widthGrass = widthRoad;
const depthGrass =  depthRoad/3;
const distGrass = depthGrass;

class Road {
  constructor(positionZ) {
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.group.position.z = positionZ*10.2;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(90);

    this.materialAsphalt = new THREE.MeshPhongMaterial({
      color: 0x393D49,
      flatShading: true
    });

    this.materialLine = new THREE.MeshPhongMaterial({
      color: 0x454A59,
      flatShading: true
    });

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.materialRight = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.middle = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad/4, hightRoad, depthRoad),  this.materialLine);
    this.middle.receiveShadow = true;
    this.group.add(this.middle);

    this.left = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad, hightRoad, depthRoad),  this.materialAsphalt);
    this.left.position.x = - distRoad;
    this.middle.add(this.left);

    this.right = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad, hightRoad, depthRoad),  this.materialAsphalt);
    this.right.position.x = distRoad;
    this.middle.add(this.right);
    //this.right.add(new Grass(hightRoad, widthRoad, depthRoad));

    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.middleGrass.position.x = widthRoad;
    this.right.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialRight);
    this.rightGrass.position.z = distGrass;
    this.middleGrass.add(this.rightGrass);

    var car = new Car(animal);

    this.vehicles = [];
    this.vehicles.push(car);

    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      this.group.add(this.vehicles[i].group);
    }

    this.three = new Three();
    this.group.add(this.three.group);
  }
}

class River{
  constructor(positionZ) {
    this.group = new THREE.Group();
    this.group.position.y = -1.35;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(90);
    //this.group.position.z = widthRoad*7.45;
    this.group.position.z = positionZ*10.2 - 1.56;

    this.materialRiver = new THREE.MeshPhongMaterial({
      color: 0x33CCFF,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.river = new THREE.Mesh(new THREE.BoxBufferGeometry( 2.25*widthRoad + widthGrass, hightRoad, depthRoad),  this.materialRiver);
    this.river.receiveShadow = true;
    this.group.add(this.river);

    this.vehicles = [];

    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      this.group.add(this.vehicles[i].group);
    }
  }
}

const threeHeights = [1.0,1.5,2.0,2.5,3.0];
const threePositions = [-5.0,-3.0,3.0,5.0];

class Three {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.y = 2.3;
    this.group.position.x = 3.4;
    this.group.position.z = threePositions[Math.floor(Math.random()*threePositions.length)];
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.x = rad(-90);

    this.materialThree = new THREE.MeshPhongMaterial({
      color: 0x4d2926,
      flatShading: true
    });

    this.materialCrown = new THREE.MeshLambertMaterial({
      color: 0x7aa21d,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.0, 1.0, 1.0 ), this.materialThree );
    this.trunk.position.z = -1.0;
    this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.height = threeHeights[Math.floor(Math.random()*threeHeights.length)];

    this.crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.5, 1.5, this.height), this.materialCrown);
    this.crown.position.z = (this.height/2-0.5);
    this.crown.castShadow = true;
    this.crown.receiveShadow = false;
    this.group.add(this.crown);
  }
}

// To define if this object is useful or not
class Grass {
  constructor(hightRoad, widthRoad, depthRoad) {
    this.highGrass = hightRoad;
    this.widthGrass = widthRoad;
    this.depthGrass = depthRoad;
    this.distGrass = this.depthGrass;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.materialRight = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();
  }

  drawParts() {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( this.widthGrass, this.highGrass, this.depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.middleGrass.position.x = this.widthGrass;

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( this.widthGrass, this.highGrass, this.depthGrass), this.materialLeft);
    this.leftGrass.position.z = - this.distGrass;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( this.widthGrass, this.highGrass, this.depthGrass), this.materialRight);
    this.rightGrass.position.z = this.distGrass;
    this.middleGrass.add(this.rightGrass);
  }
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
