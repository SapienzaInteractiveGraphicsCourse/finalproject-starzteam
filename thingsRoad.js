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
}R
