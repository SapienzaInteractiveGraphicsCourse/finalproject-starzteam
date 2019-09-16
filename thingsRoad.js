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
  constructor(positionZ, numLanes) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;

    this.group.position.z = positionZ;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(-90);

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

    this.drawParts(numLanes);

    this.group.traverse((part) => {
      part.castShadow = true;
      part.receiveShadow = true;
    });
  }

  drawParts(num) {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.group.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialRight);
    this.rightGrass.position.z = distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.rightGrass);

    this.occupiedSpace += widthGrass;

    this.prec = this.middleGrass;
    this.vehicles = [];
    var road = null;
    var j = 0;

    for(var i = 0; i < (num*2)-1; i++){
      if(i%2 == 0){
        var road = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad, hightRoad, depthRoad),  this.materialAsphalt);
        if(i>0) road.position.x = widthRoad-0.8;
        else road.position.x = widthRoad;
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
        this.occupiedSpace += widthRoad;
        
        var car = new Car(animal);
        this.vehicles.push(car);
        this.prec.add(this.vehicles[j].group);
        j++;
      }else{
        road = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRoad/4, hightRoad, depthRoad),  this.materialLine);
        road.position.x = distRoad;
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
        this.occupiedSpace += widthRoad/4;
      }
    }

    this.three = new Three();
    this.rightGrass.add(this.three.group);

    this.three = new Three();
    this.leftGrass.add(this.three.group);
  }

  doCheck(){

  }
}

class River{
  constructor(positionZ) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.position.y = -1.35;
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.y = rad(90);
    this.group.position.z = positionZ;

    this.materialRiver = new THREE.MeshPhongMaterial({
      color: 0x33CCFF,
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

    this.group.traverse((part) => {
      part.castShadow = true;
      part.receiveShadow = true;
    });
  }

  drawParts() {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.group.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( widthGrass, highGrass, depthGrass), this.materialRight);
    this.rightGrass.position.z = distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.rightGrass);

    this.occupiedSpace += widthGrass;

    this.river = new THREE.Mesh(new THREE.BoxBufferGeometry( 2.25*widthRoad + widthGrass, hightRoad, depthRoad),  this.materialRiver);
    this.river.receiveShadow = true;
    this.river.position.x = -2.12*widthRoad;
    this.river.position.y = -0.1;
    this.middleGrass.add(this.river);
    this.occupiedSpace += 2.25*widthRoad + widthGrass;

    this.sideX = 1.5*depthRoad/2;
    this.sideZ = 1.5*(2.25*widthRoad + widthGrass)/2;

    this.isWood = false;

    this.vehicles = [];
    var trunk = new Wood(this);
    this.vehicles.push(trunk);

    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      this.river.add(this.vehicles[i].group);
    }

  }

  doCheck(){

    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();

    this.river.getWorldPosition(referencePosition);
    animal.boxReference.getWorldPosition(referencePositionAnimal);

    if( (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) &&
        (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        referencePositionAnimal.y <= animal.restHeight && !this.isWood){
          crash = true;
          window.alert("SPLASH");
    }

  }
}

class Wood{
  constructor(river){

    this.riverReference = river;

    this.group = new THREE.Group();
    this.group.position.set(2, 0, 0);

    this.materialWoodLight = new THREE.MeshPhongMaterial({
      color: 0x7b5d33,
      flatShading: true
    });

    this.materialWoodDark = new THREE.MeshPhongMaterial({
      color: 0x4f3d21,
      flatShading: true
    });

    this.vAngle = 0;

    this.direction = 1;

    if(Math.floor(Math.random()*2) == 0){
      //positionX = 1.9;
      //positionZ = 7;
      this.direction = -1;
    }

    this.drawParts();
  }

  drawParts() {

    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( widthRoad, 3*hightRoad, 5.0 ), this.materialWoodLight );
    this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.sideX = 1.5*2.5;
    this.sideZ = 1.5*widthRoad/2;

  }

  goForward(speed){
    this.group.position.z += this.direction*speed;

    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();

    this.trunk.getWorldPosition(referencePosition); //OCCHIO, il sistema di riferimento world e quello locale sono diversi!!! quindi dopo una rotazione cambiano x e z
    //cambiano anche tra position.x e getWorldPosition.x
    animal.boxReference.getWorldPosition(referencePositionAnimal);

    if( (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) ){
          this.riverReference.isWood = true;
    }
    else {
      this.riverReference.isWood = false;
    }

  }
}

const threeHeights = [1.0,1.5,2.0,2.5,3.0];
const threePositions = [1.0,-1.0,2.0,-2.0,];

class Three {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.y = 2.3;
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

    this.group.traverse((part) => {
      part.castShadow = true;
      part.receiveShadow = true;
    });
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
