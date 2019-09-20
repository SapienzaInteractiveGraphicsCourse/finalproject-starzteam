//#######################
//CAR
//#######################

class Car {
  constructor(animal, speedCar, initialPosition, directionCar) {
    this.animalReference = animal; //needed to check if car runs over the animal

    this.group = new THREE.Group();

    var angle = 0;


    //var initialPositions = [-45];

    var positionZ = initialPosition;
    this.direction = directionCar;

    if(this.direction == -1){
      positionZ = -positionZ;
      angle = 180;
    }

    this.speed = speedCar;

    this.group.position.set(0, 1, positionZ); //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.rotation.set(0, rad(angle), 0);

    var boxReferenceGeometry = new THREE.BoxGeometry(1.6, 2, 3.5);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    //this.boxReference.position.set(0.65, 0.2, 1.75);
    this.group.add(this.boxReference);

    this.sideZ = 1.5*this.boxReference.geometry.parameters.width/2; //lato box / 2 e occhio allo scaling
    this.sideY = 1.5*this.boxReference.geometry.parameters.height/2;
    this.sideX = 1.5*this.boxReference.geometry.parameters.depth/2;

    this.boxReference.visible = false;

    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });

    var colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x008080];
    var index = Math.floor(Math.random()*colors.length);

    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: colors[index],
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
  }
  drawBody(){ //ruote e specchietti

    const bodyGeometry = new THREE.BoxGeometry(1.6, 1, 3.5);
    const body = new THREE.Mesh(bodyGeometry, this.bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    var rightSpotLightGeometry = new THREE.SphereGeometry( 0.2, 6, 6 );
    var rightSpotLight = new THREE.Mesh( rightSpotLightGeometry, this.whiteMaterial );
    rightSpotLight.position.set(-0.5, 0, 1.75)
    body.add( rightSpotLight );

    var leftSpotLightGeometry = new THREE.SphereGeometry( 0.2, 6, 6 );
    var leftSpotLight = new THREE.Mesh( leftSpotLightGeometry, this.whiteMaterial );
    leftSpotLight.position.set(0.5, 0, 1.75)
    body.add( leftSpotLight );

    const frontBarGeometry = new THREE.BoxGeometry(1, 0.1, 0.2);
    const frontBar = new THREE.Mesh(frontBarGeometry, this.blackMaterial);
    frontBar.castShadow = true;
    frontBar.receiveShadow = true;
    frontBar.position.set(0, -0.3, 1.75);
    body.add(frontBar);

    const rightFrontHandleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const rightFrontHandle = new THREE.Mesh(rightFrontHandleGeometry, this.blackMaterial);
    rightFrontHandle.castShadow = true;
    rightFrontHandle.receiveShadow = true;
    rightFrontHandle.position.set(-0.8, 0.2, 0.1);
    body.add(rightFrontHandle);

    const rightBackHandleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const rightBackHandle = new THREE.Mesh(rightBackHandleGeometry, this.blackMaterial);
    rightBackHandle.castShadow = true;
    rightBackHandle.receiveShadow = true;
    rightBackHandle.position.set(-0.8, 0.2, -0.7);
    body.add(rightBackHandle);

    const leftFrontHandleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const leftFrontHandle = new THREE.Mesh(leftFrontHandleGeometry, this.blackMaterial);
    leftFrontHandle.castShadow = true;
    leftFrontHandle.receiveShadow = true;
    leftFrontHandle.position.set(0.8, 0.2, 0.1);
    body.add(leftFrontHandle);

    const leftBackHandleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const leftBackHandle = new THREE.Mesh(leftBackHandleGeometry, this.blackMaterial);
    leftBackHandle.castShadow = true;
    leftBackHandle.receiveShadow = true;
    leftBackHandle.position.set(0.8, 0.2, -0.7);
    body.add(leftBackHandle);

    /*
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 3 );

    //spotLight.decay = 2;

    //spotLight.castShadow = true;

    spotLight.angle = Math.PI / 100;

    spotLight.shadow.mapSize.width = 1;
    spotLight.shadow.mapSize.height = 1;

    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 1;
    spotLight.shadow.camera.fov = 1;

    body.add( spotLight );

    */

    const frontFenderGeometry = new THREE.BoxGeometry(body.geometry.parameters.width + 0.1, 0.2, 0.2);
    const frontFender = new THREE.Mesh(frontFenderGeometry, this.blackMaterial);
    frontFender.castShadow = true;
    frontFender.receiveShadow = true;
    frontFender.position.set(0, -0.5, 1.7);
    body.add(frontFender);

    const backFenderGeometry = new THREE.BoxGeometry(body.geometry.parameters.width + 0.1, 0.2, 0.2);
    const backFender = new THREE.Mesh(backFenderGeometry, this.blackMaterial);
    backFender.castShadow = true;
    backFender.receiveShadow = true;
    backFender.position.set(0, -0.5, -1.7);
    body.add(backFender);

    const windscreenGeometry = new THREE.BoxGeometry(body.geometry.parameters.width, 0.7, 1.8);
    const windscreen = new THREE.Mesh(windscreenGeometry, this.bodyMaterial);
    windscreen.castShadow = true;
    windscreen.receiveShadow = true;
    windscreen.position.set(0, body.geometry.parameters.height/2 + windscreen.geometry.parameters.height/2, -0.1);
    body.add(windscreen);

    const glassDepth = 0.01;
    const glassProportion = 9/10;

    const frontGlassGeometry = new THREE.BoxGeometry(glassProportion*windscreen.geometry.parameters.width, glassProportion*windscreen.geometry.parameters.height, glassDepth);
    const frontGlass = new THREE.Mesh(frontGlassGeometry, this.blackMaterial);
    frontGlass.castShadow = true;
    frontGlass.receiveShadow = true;
    frontGlass.position.set(0, 0, 0.9);
    windscreen.add(frontGlass);

    const backGlassGeometry = new THREE.BoxGeometry(glassProportion*windscreen.geometry.parameters.width, glassProportion*windscreen.geometry.parameters.height, glassDepth);
    const backGlass = new THREE.Mesh(backGlassGeometry, this.blackMaterial);
    backGlass.castShadow = true;
    backGlass.receiveShadow = true;
    backGlass.position.set(0, 0, -0.9);
    windscreen.add(backGlass);

    const rightGlassGeometry = new THREE.BoxGeometry(glassDepth, glassProportion*windscreen.geometry.parameters.height, glassProportion*windscreen.geometry.parameters.depth);
    const rightGlass = new THREE.Mesh(rightGlassGeometry, this.blackMaterial);
    rightGlass.castShadow = true;
    rightGlass.receiveShadow = true;
    rightGlass.position.set(-0.8, 0, 0);
    windscreen.add(rightGlass);

    const rightLineGeometry = new THREE.BoxGeometry(glassDepth, glassProportion*windscreen.geometry.parameters.height, 0.1);
    const rightLine = new THREE.Mesh(rightLineGeometry, this.bodyMaterial);
    rightLine.castShadow = true;
    rightLine.receiveShadow = true;
    rightLine.position.set(-0.81, 0, 0);
    windscreen.add(rightLine);

    const leftGlassGeometry = new THREE.BoxGeometry(glassDepth, glassProportion*windscreen.geometry.parameters.height, glassProportion*windscreen.geometry.parameters.depth);
    const leftGlass = new THREE.Mesh(leftGlassGeometry, this.blackMaterial);
    leftGlass.castShadow = true;
    leftGlass.receiveShadow = true;
    leftGlass.position.set(0.8, 0, 0);
    windscreen.add(leftGlass);

    const leftLineGeometry = new THREE.BoxGeometry(glassDepth, glassProportion*windscreen.geometry.parameters.height, 0.1);
    const leftLine = new THREE.Mesh(leftLineGeometry, this.bodyMaterial);
    leftLine.castShadow = true;
    leftLine.receiveShadow = true;
    leftLine.position.set(0.81, 0, 0);
    windscreen.add(leftLine);

    const rightX = -body.geometry.parameters.width/2;
    const leftX = body.geometry.parameters.width/2;
    const backZ = -body.geometry.parameters.depth/2 + 0.5;
    const frontZ = body.geometry.parameters.depth/2 - 0.5;
    const heightTire = -0.425;
    const cylinder = 0.4;
    const depthCylinder = 0.2;

    const backRightTireGeometry = new THREE.CylinderGeometry(cylinder, cylinder, 0.2, 16);
    const backRightTire = new THREE.Mesh(backRightTireGeometry, this.blackMaterial);
    backRightTire.castShadow = true;
    backRightTire.receiveShadow = true;
    backRightTire.position.set(rightX, heightTire, backZ);
    backRightTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    body.add(backRightTire);

    const backRightRimGeometry = new THREE.CylinderGeometry(cylinder/2, cylinder/2, depthCylinder/20, 16);
    const backRightRim = new THREE.Mesh(backRightRimGeometry, this.whiteMaterial);
    backRightRim.castShadow = true;
    backRightRim.receiveShadow = true;
    backRightRim.position.set(0, depthCylinder/2 + depthCylinder/40, 0);
    backRightTire.add(backRightRim);


    const backLeftTireGeometry = new THREE.CylinderGeometry(cylinder, cylinder, 0.2, 16);
    const backLeftTire = new THREE.Mesh(backLeftTireGeometry, this.blackMaterial);
    backLeftTire.castShadow = true;
    backLeftTire.receiveShadow = true;
    backLeftTire.position.set(leftX, heightTire, backZ);
    backLeftTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    body.add(backLeftTire);

    const backLeftRimGeometry = new THREE.CylinderGeometry(cylinder/2, cylinder/2, depthCylinder/20, 16);
    const backLeftRim = new THREE.Mesh(backLeftRimGeometry, this.whiteMaterial);
    backLeftRim.castShadow = true;
    backLeftRim.receiveShadow = true;
    backLeftRim.position.set(0, -(depthCylinder/2 + depthCylinder/40), 0);
    backLeftTire.add(backLeftRim);


    const frontRightTireGeometry = new THREE.CylinderGeometry(cylinder, cylinder, 0.2, 16);
    const frontRightTire = new THREE.Mesh(frontRightTireGeometry, this.blackMaterial);
    frontRightTire.castShadow = true;
    frontRightTire.receiveShadow = true;
    frontRightTire.position.set(rightX, heightTire, frontZ);
    frontRightTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    body.add(frontRightTire);

    const frontRightRimGeometry = new THREE.CylinderGeometry(cylinder/2, cylinder/2, depthCylinder/20, 16);
    const frontRightRim = new THREE.Mesh(frontRightRimGeometry, this.whiteMaterial);
    frontRightRim.castShadow = true;
    frontRightRim.receiveShadow = true;
    frontRightRim.position.set(0, depthCylinder/2 + depthCylinder/40, 0);
    frontRightTire.add(frontRightRim);


    const frontLeftTireGeometry = new THREE.CylinderGeometry(cylinder, cylinder, 0.2, 16);
    const frontLeftTire = new THREE.Mesh(frontLeftTireGeometry, this.blackMaterial);
    frontLeftTire.castShadow = true;
    frontLeftTire.receiveShadow = true;
    frontLeftTire.position.set(leftX, heightTire, frontZ);
    frontLeftTire.rotation.set(0, 0, rad(90)); //x,y,z are the axe with respect there is the rotation
    body.add(frontLeftTire);

    const frontLeftRimGeometry = new THREE.CylinderGeometry(cylinder/2, cylinder/2, depthCylinder/20, 16);
    const frontLeftRim = new THREE.Mesh(frontLeftRimGeometry, this.whiteMaterial);
    frontLeftRim.castShadow = true;
    frontLeftRim.receiveShadow = true;
    frontLeftRim.position.set(0, -(depthCylinder/2 + depthCylinder/40), 0);
    frontLeftTire.add(frontLeftRim);

  }
  goForward(){ //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.position.z += this.direction*this.speed;
    if(Math.abs(this.group.position.z) > depthRoad/2) //I can use the abs because the position is relative to the Road (not global in world coords)
      this.group.position.z = -this.group.position.z;

    //to find these values:
    //dobbiamo trovare un BoxGeometry che racchiude tutto l'oggetto ed estrarne il centro. Da quello si può valutare se due oggetti si toccano
    //se abs(c1 - c2) <= l1/2  + l2/2 sia per x che z (and)
    var referencePosition = new THREE.Vector3();
    var referencePositionAnimal = new THREE.Vector3();

    this.boxReference.getWorldPosition(referencePosition);
    this.animalReference.boxReference.getWorldPosition(referencePositionAnimal);
    if( (Math.abs(referencePosition.x - referencePositionAnimal.x) <= this.sideX + this.animalReference.sideX) &&
        (Math.abs(referencePosition.y - referencePositionAnimal.y) <= this.sideY + this.animalReference.sideY) &&
        (Math.abs(referencePosition.z - referencePositionAnimal.z) <= this.sideZ + this.animalReference.sideZ) ){
          crash = true;
        }
  }
}
