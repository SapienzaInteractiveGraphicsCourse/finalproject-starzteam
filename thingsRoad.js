const hightRoad = 0.1;
const widthRoad = 2.5;
const depthRoad = 90;
const distRoad = 1.3;
const highGrass = hightRoad;
const widthGrass = widthRoad;
const depthGrass =  depthRoad/3;
const distGrass = depthGrass;
const highRiver = hightRoad;
const widthRiver = 2*widthRoad;
const depthRiver = depthRoad;
const highWood = 3*hightRoad;
const widthWood = widthRoad-widthRoad/4;
const numWood = 4;
const depthWood = 5.0
var splash = false;

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
        if(i>0){
          road.position.x = widthRoad/2-0.05;
          road.rotateX(rad(90));
          road.position.z = -0.07;
        } else road.position.x = widthRoad;
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
        this.occupiedSpace += widthRoad;

        var car = new Car(animal);
        this.vehicles.push(car);
        this.prec.add(this.vehicles[j].group);
        j++;
      }else{
        road = new THREE.Mesh(new THREE.PlaneGeometry(widthRoad/4, depthRoad),  this.materialLine);
        road.position.x = distRoad;
        road.position.y = 0.07;
        road.rotateX(rad(-90));
        road.receiveShadow = true;
        this.prec.add(road);
        this.prec = road;
      }
    }

    this.trees = [];


    var tree = new Three();
    this.rightGrass.add(tree.group);
    this.trees.push(tree);

    tree = new Three();
    this.leftGrass.add(tree.group);
    this.trees.push(tree)
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

    this.river = new THREE.Mesh(new THREE.BoxBufferGeometry( widthRiver, highRiver, depthRiver),  this.materialRiver);
    this.river.receiveShadow = true;
    this.river.position.x = -0.75*widthRiver;
    this.river.position.y = -0.1;
    this.middleGrass.add(this.river);
    this.occupiedSpace += widthRiver;

    this.sideX = 1.5*this.river.geometry.parameters.depth/2;
    this.sideZ = 1.5*this.river.geometry.parameters.width/2;

    this.vehicles = [];

    var pos = -depthRoad/2;
    var posRand = Math.round(Math.random()*3);
    var dir = 1;
    if(Math.floor(Math.random()*2) == 0) dir = -1;

    for(var i = 0; i < numWood; i++){
      console.log(i, pos);
      var trunk = new Wood(1.2, dir);
      trunk.group.position.z = -pos+posRand;
      this.vehicles.push(trunk);
      trunk = new Wood(-1.2, -dir);
      trunk.group.position.z = pos;
      pos += depthWood+depthWood/2;
      this.vehicles.push(trunk);
    }

    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      this.river.add(this.vehicles[i].group);
    }

    this.trees = [];

    var now = -depthGrass/2+1.5;
    var tree = null;
    while(now <= depthGrass/3){
      if(Math.floor(Math.random()*2) == 0){
        tree = new Three();
        this.rightGrass.add(tree.group);
        this.trees.push(tree);
      }
      now+=4;
    }

    now = -depthGrass/3;
    while(now <= depthGrass/2+1.5){
      if(Math.floor(Math.random()*2) == 0){
        tree = new Three();
        this.leftGrass.add(tree.group);
        this.trees.push(tree);
      }
      now+=4;
    }

  }

  doCheck(){

    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();

    this.river.getWorldPosition(referencePosition);
    animal.boxReference.getWorldPosition(referencePositionAnimal);

    var checkIsWood = false;
    var length = this.vehicles.length;
    var i;
    for(i = 0; i < length; i++){
      checkIsWood = checkIsWood || this.vehicles[i].isWood;
    }

    if( (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) &&
        (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        referencePositionAnimal.y <= animal.restHeight && !checkIsWood){
          crash = true;
          splash = true;
    }

  }
}

class Wood{
  constructor(posX, dir){

    this.group = new THREE.Group();
    this.group.position.set(posX, 0, 0);

    this.materialWoodLight = new THREE.MeshPhongMaterial({
      color: 0x7b5d33,
      flatShading: true
    });

    this.materialWoodDark = new THREE.MeshPhongMaterial({
      color: 0x4f3d21,
      flatShading: true
    });

    this.vAngle = 0;

    this.direction = dir;

    var speedList = [0.01, 0.05, 0.1];

    this.speed = speedList[Math.floor(Math.random()*speedList.length)];

    this.drawParts();
  }

  drawParts() {

    this.trunk = new THREE.Mesh( new THREE.BoxBufferGeometry( widthWood, highWood, depthWood ), this.materialWoodLight );
    this.trunk.castShadow = true;
    this.trunk.receiveShadow = true;
    this.group.add(this.trunk);

    this.sideX = 1.5*this.trunk.geometry.parameters.depth/2;
    this.sideZ = 1.5*this.trunk.geometry.parameters.width/2;

    this.isWood = false;

  }

  goForward(){
    this.group.position.z += this.direction*this.speed;

    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();
    scene.updateMatrixWorld();

    this.trunk.getWorldPosition(referencePosition); //OCCHIO, il sistema di riferimento world e quello locale sono diversi!!! quindi dopo una rotazione cambiano x e z
    //cambiano anche tra position.x e getWorldPosition.x
    animal.boxReference.getWorldPosition(referencePositionAnimal);

    if( (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ) &&
        (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX) ){
          this.isWood = true;
          if(referencePositionAnimal.y <= animal.restHeight)
            animal.group.position.x += 1.5*this.direction*this.speed;
    }
    else {
      this.isWood = false;
    }

  }
}

const threeHeights = [1.0,1.5,2.0,2.5,3.0];
//const threePositions = [1.0,1.2,1.4,1.6,1.8,-1.0,-1.2,-1.4,-1.6,-1.8,2.0,2.2,2.4,2.6,2.8,3.0,-2.0,-2.2,-2.4,-2.6,-2.8,-3.0];
const threePositions = [1.0,1.4,1.8,-1.0,-1.4,-1.8,2.0,2.4,2.8,3.0,-2.0,-2.4,-2.8,-3.0];

class Three {
  constructor(positionZ = -1) {
    this.group = new THREE.Group();
    this.group.position.y = 2.3;
    if(positionZ == -1) this.group.position.z = threePositions[Math.floor(Math.random()*threePositions.length)];
    else this.group.position.z = positionZ
    this.group.scale.set(1.5, 1.5, 1.5);
    this.group.rotation.x = rad(-90);

    //load texture for the tree
    this.materialThree = [
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark2.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark2.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark2.jpg')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('texture/treebark2.jpg')
        })
     ];

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

    this.sideX = 0.5*1.5; //lato box / 2
    this.sideZ = 0.5*1.5;

    this.height = threeHeights[Math.floor(Math.random()*threeHeights.length)];

    this.crown = new THREE.Mesh( new THREE.BoxBufferGeometry( 1.5, 1.5, this.height), this.materialCrown);
    this.crown.position.z = (this.height/2-0.5);
    this.crown.castShadow = true;
    this.crown.receiveShadow = false;
    this.group.add(this.crown);
  }
}

class GrassStart {
  constructor(positionZ) {
    this.occupiedSpace = 0;
    this.group = new THREE.Group();
    this.group.rotation.y = rad(-90);
    this.group.position.y = -1.35;
    this.group.position.z = positionZ;
    this.group.scale.set(1.5, 1.5, 1.5);

    this.materialMiddle = new THREE.MeshPhongMaterial({
      color: 0xbaf455,
      flatShading: true
    });

    this.materialLeft = new THREE.MeshPhongMaterial({
      color: 0x99C846,
      flatShading: true
    });

    this.vAngle = 0;

    this.drawParts();

    this.group.traverse((part) => {
      part.castShadow = true;
      part.receiveShadow = true;
    });

    // load a texture, set wrap mode to repeat
    /*
    var texture = new THREE.TextureLoader().load( "grass.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );*/

    this.vehicles = [];
  }

  drawParts() {
    this.middleGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialMiddle);
    this.middleGrass.receiveShadow = true;
    this.group.add(this.middleGrass);

    this.leftGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialLeft);
    this.leftGrass.position.z = - distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.leftGrass);

    this.rightGrass = new THREE.Mesh(new THREE.BoxBufferGeometry( 2*widthGrass, highGrass, depthGrass), this.materialLeft);
    this.rightGrass.position.z = distGrass;
    this.middleGrass.receiveShadow = true;
    this.middleGrass.add(this.rightGrass);

    this.occupiedSpace += widthGrass;

    this.trees = [];

    var now = -depthGrass*2-(depthGrass-1.8)/2;
    var tree = null;
    while(now < (depthGrass-1.5)/2){
      tree = new Three(now);
      tree.group.position.x = -1.25;
      this.rightGrass.add(tree.group);
      this.trees.push(tree);
      now+=2.5;
    }
  }

  doCheck(){

  }
}
class splashParticles{
  constructor(positionZ,positionX, signX, signZ) {
    this.group = new THREE.Group();

    this.group.position.y = Math.log(0.36);
    //console.log("z");
    //console.log(positionZ);
    //console.log("x");
    //console.log(positionX);
    this.group.position.z = positionZ;
    this.group.position.x = positionX;
    this.mySpeed =Math.random() * 0.7 + 0.3;
    this.signX = signX ;
    this.signZ = signZ ;

    this.group.scale.set(1.5, 1.5, 1.5);
    this.materialRiver = new THREE.MeshPhongMaterial({
      color: 0x33CCFF,
      flatShading: true
    });

    this.drawParts();
  }

  drawParts() {
      const particleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      this.particle = new THREE.Mesh( particleGeometry, this.materialRiver );
      this.particle.position.z = this.signZ * Math.random()*3;
      this.particle.position.x = this.signX * Math.random()*3;
      this.particle.castShadow = true;
      this.particle.receiveShadow = true;
      this.group.add(this.particle);
    }


  animateParticles(){
      if(this.group.position.y > 5){
        this.mySpeed = -this.mySpeed;
      }
      this.group.position.y += this.mySpeed;
      this.group.position.x += 0.1*this.signX/3;
      this.group.position.z += 0.1*this.signZ/3;
    }
  }
