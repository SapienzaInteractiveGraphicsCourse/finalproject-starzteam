'use strict';

var scene,
    camera,
    renderer,
    controls,
    keyWDown,
    world,
    night = false;

var animal,
    terrain,
    sky,
    car;

var width,
    height;

var crash = false;

function init() {
  width = window.innerWidth,
  height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set(0, 0.7, 25);

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
  drawCar();

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

function drawCar(){
  car = new Car(animal);
  scene.add(car.group);
}

function drawTerrain() {
  terrain = new Terrain();
  scene.add(terrain.group);
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
    car.goForward(0.01);
    //car.goForward(0);
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

    /*
    const boxReferenceGeometry = new THREE.BoxGeometry(3, 3, 3.3);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    boxReference.position.set(0, 0.3, 0.25);
    scene.add(boxReference);
    */

    this.referenceX = 0;
    this.referenceY = 0.3;
    this.referenceZ = 0.25;

    this.sideX = 1.5;
    this.sideY = 1.5;
    this.sideZ = 1.65;

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
    this.referenceY = Math.sin(this.vAngle) + 1.3;

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4;

    this.frontRightLeg.rotation.x = -legRotation;
    this.backRightLeg.rotation.x = -legRotation;
    this.frontLeftLeg.rotation.x = -legRotation;
    this.backLeftLeg.rotation.x = -legRotation;

    this.group.position.z = this.group.position.z + 0.025;
    this.referenceZ += 0.025;

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
    const boxReferenceGeometry = new THREE.BoxGeometry(0, 0, 0);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    boxReference.position.set(0, 0, 0);
    scene.add(boxReference);
    */

    this.referenceX = 0;
    this.referenceY = 0;
    this.referenceZ = 0;

    this.sideX = 0;
    this.sideY = 0;
    this.sideZ = 0;

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
  jumponKeyWDown() {
    //fai come il cavallo che cammina
    //alterni le due gambe se una va indietro l'altra va in avanti (puoi usare sin e cos)
    //nota che appena clicchi l'animazione deve partire e finire in posizione di riposo (zampe sullo stesso livello)

    //puoi fare dei ponti levaoti al posto delle navi che si muovono

  }
}

//########################################################################################################
//END
//########################################################################################################

class Car {
  constructor(animal) {
    this.animalReference = animal; //needed to check if car runs over the animal

    /*
    const boxReferenceGeometry = new THREE.BoxGeometry(3.9, 2.2, 2.1);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    boxReference.position.set(-8.25, -0.2, 9.35);
    scene.add(boxReference);
    */

    this.referenceX = -8.25;
    this.referenceY = -0.2;
    this.referenceZ = 9.35;

    this.sideX = 1.95;
    this.sideY = 1.1;
    this.sideZ = 1.05;

    this.group = new THREE.Group();
    this.group.position.set(-10, -0.4, 10); //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.rotation.set(0, rad(90), 0);

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
    this.group.position.x += speed;
    this.referenceX += speed;
    //to find these values:
    //dobbiamo trovare un BoxGeometry che racchiude tutto l'oggetto ed estrarne il centro. Da quello si può valutare che due oggetti si toccano
    //se abs(c1 - c2) <= l1/2  + l2/2 sia per x che z (and)
    if( (Math.abs(this.referenceX - animal.referenceX) <= this.sideX + animal.sideX) &&
        (Math.abs(this.referenceY - animal.referenceY) <= this.sideY + animal.sideY) &&
        (Math.abs(this.referenceZ - animal.referenceZ) <= this.sideZ + animal.sideZ) ){
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
