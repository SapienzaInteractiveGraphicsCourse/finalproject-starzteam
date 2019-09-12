//#######################
//CAR
//#######################

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
