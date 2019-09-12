//#######################
//FOX
//#######################

const size = 1.5;
class Fox{
  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = 0.3;
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

    this.skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      roughness: 1,
      shading: THREE.FlatShading
    });
    this.blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1,
      shading: THREE.FlatShading
    });

    this.vAngle = 0;
    this.drawBody();
    this.drawHead();
    this.drawLegs();
  }
  drawBody() {
    const bodyGeometry = new THREE.BoxGeometry(0.5*size, 0.5*size, 1.2  *size);
    this.body = new THREE.Mesh(bodyGeometry, this.skinMaterial);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.group.add(this.body);
    addLines(bodyGeometry, this.body);

    const tailGeometry = new THREE.BoxGeometry(0.23*size, 0.23*size, 0.7*size);
    this.tail = new THREE.Mesh(tailGeometry, this.skinMaterial);
    this.tail.receiveShadow = true;
    this.tail.position.set(0*size, 0.035*size, -0.9*size);
    this.tail.rotation.set(rad(-15), 0, 0);
    this.group.add(this.tail);
    addLines(tailGeometry, this.tail);

    const tailEndGeometry = new THREE.BoxGeometry(0.23*size, 0.23*size, 0.2*size);
    const tailEnd = new THREE.Mesh(tailEndGeometry, this.whiteMaterial);
    tailEnd.receiveShadow = true;
    tailEnd.position.set(0, 0, -0.45*size);
    this.tail.add(tailEnd);
    addLines(tailEndGeometry, tailEnd);

  }
  drawHead() {
    const headGeometry = new THREE.BoxGeometry(0.6*size, 0.4*size, 0.4*size);
    const head = new THREE.Mesh(headGeometry, this.skinMaterial);
    head.receiveShadow = true;
    head.position.set(0*size, 0.1*size,0.8*size);
    this.group.add(head);
    addLines(headGeometry,head);

    const noseGeometry = new THREE.BoxGeometry(0.35*size, 0.15*size, 0.2*size);
    const nose = new THREE.Mesh(noseGeometry, this.skinMaterial);
    nose.receiveShadow = true;
    nose.position.set(0*size, -0.1*size, 0.25*size);
    head.add(nose);
    addLines(noseGeometry, nose);

    const noseEndGeometry = new THREE.BoxGeometry(0.2*size, 0.05*size, 0.01*size);
    const noseEnd = new THREE.Mesh(noseEndGeometry, this.blackMaterial);
    noseEnd.receiveShadow = true;
    noseEnd.position.set(0, 0.05*size, 0.1*size);
    nose.add(noseEnd);

    //Ears
    const leftEarGeometry = new THREE.BoxGeometry(0.2*size, 0.2*size, 0.05*size);
    const leftEar = new THREE.Mesh(leftEarGeometry, this.whiteMaterial);
    //leftEye.castShadow = true;
    leftEar.receiveShadow = true;
    leftEar.position.set(0.15*size, 0.3*size, 0.1*size);
    leftEar.rotation.set(0, rad(15), 0);
    head.add(leftEar);
    addLines(leftEarGeometry, leftEar);

    const additionalLeftEarGeometry = new THREE.BoxGeometry(0.06*size, 0.24*size, 0.06*size);
    const additionalLeftEar = new THREE.Mesh(additionalLeftEarGeometry, this.skinMaterial);
    additionalLeftEar.receiveShadow = true;
    additionalLeftEar.position.set(-0.08*size, 0*size, 0);
    leftEar.add(additionalLeftEar);

    const additionalLeftEar2Geometry = new THREE.BoxGeometry(0.05*size, 0.2*size, 0.05*size);
    const additionalLeftEar2 = new THREE.Mesh(additionalLeftEar2Geometry, this.skinMaterial);
    additionalLeftEar2.receiveShadow = true;
    additionalLeftEar2.position.set(0.09*size, 0.12*size, 0);
    additionalLeftEar2.rotation.set(0, 0, rad(90));
    additionalLeftEar.add(additionalLeftEar2);

    const rightEarGeometry = new THREE.BoxGeometry(0.2*size, 0.2*size, 0.05*size);
    const rightEar = new THREE.Mesh(rightEarGeometry, this.whiteMaterial);
    rightEar.receiveShadow = true;
    rightEar.position.set(-0.15*size, 0.3*size, 0.1*size);
    rightEar.rotation.set(0, rad(-15), 0);
    head.add(rightEar);
    addLines(rightEarGeometry, rightEar);

    const additionalRightEarGeometry = new THREE.BoxGeometry(0.06*size, 0.24*size, 0.06*size);
    const additionalRightEar = new THREE.Mesh(additionalRightEarGeometry, this.skinMaterial);
    additionalRightEar.receiveShadow = true;
    additionalRightEar.position.set(+0.08*size, 0.0*size, 0);
    rightEar.add(additionalRightEar);

    const additionalRightEar2Geometry = new THREE.BoxGeometry(0.06*size, 0.2*size, 0.06*size);
    const additionalRightEar2 = new THREE.Mesh(additionalRightEar2Geometry, this.skinMaterial);
    additionalRightEar2.receiveShadow = true;
    additionalRightEar2.position.set(-0.09*size, 0.12*size, 0);
    additionalRightEar2.rotation.set(0, 0, rad(90));
    additionalRightEar.add(additionalRightEar2);

    //Eyes
    const leftEyeGeometry =new THREE.BoxGeometry(0.05*size, 0.05*size, 0.05*size);
    const leftEye = new THREE.Mesh(leftEyeGeometry, this.blackMaterial);
    leftEye.receiveShadow = true;
    leftEye.position.set(0.15*size, 0.1*size, 0.2*size);
    head.add(leftEye);

    const rightEyeGeometry = new THREE.BoxGeometry(0.05*size, 0.05*size, 0.05*size)
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.blackMaterial);
    rightEye.receiveShadow = true;
    rightEye.position.set(-0.15*size, 0.1*size, 0.2*size);
    head.add(rightEye);
  }
  drawLegs() {

    //Right Front Leg
    const rightBackLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightBackLeg = new THREE.Mesh(rightBackLegGeometry, this.skinMaterial);
    this.rightBackLeg.receiveShadow = true;
    this.rightBackLeg.position.set(-0.35*size, -0.3*size, -0.45*size);
    this.group.add(this.rightBackLeg);
    addLines(rightBackLegGeometry, this.rightBackLeg);

    const rightBackDownLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightBackDownLeg = new THREE.Mesh(rightBackDownLegGeometry, this.blackMaterial);
    this.rightBackDownLeg.receiveShadow = true;
    this.rightBackDownLeg.position.set(0, -0.4*size, 0);
    this.rightBackLeg.add(this.rightBackDownLeg);

    const rightBackPawGeometry = new THREE.BoxGeometry(0.2*size, 0.1*size, 0.2*size);
    const rightBackPaw = new THREE.Mesh(rightBackPawGeometry, this.whiteMaterial);
    rightBackPaw.receiveShadow = true;
    rightBackPaw.position.set(0, -0.25*size, 0);
    this.rightBackDownLeg.add(rightBackPaw);
    addLines(rightBackPawGeometry, rightBackPaw);

    //rightFrontLeg
    const rightFrontLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightFrontLeg = new THREE.Mesh(rightFrontLegGeometry, this.skinMaterial);
    this.rightFrontLeg.receiveShadow = true;
    this.rightFrontLeg.position.set(-0.35*size, -0.3*size, +0.45*size);
    this.group.add(this.rightFrontLeg);
    addLines(rightFrontLegGeometry, this.rightFrontLeg);

    const rightFrontDownLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.rightFrontDownLeg = new THREE.Mesh(rightFrontDownLegGeometry, this.blackMaterial);
    this.rightFrontDownLeg.receiveShadow = true;
    this.rightFrontDownLeg.position.set(0.0*size, -0.4*size, 0.0*size);
    this.rightFrontLeg.add(this.rightFrontDownLeg);

    const rightFrontPawGeometry = new THREE.BoxGeometry(0.2*size, 0.1*size, 0.2*size);
    const rightFrontPaw = new THREE.Mesh(rightFrontPawGeometry, this.whiteMaterial);
    rightFrontPaw.receiveShadow = true;
    rightFrontPaw.position.set(0, -0.25*size, 0);
    this.rightFrontDownLeg.add(rightFrontPaw);
    addLines(rightFrontPawGeometry, rightFrontPaw);

    //Left Back Leg
    const leftBackLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftBackLeg = new THREE.Mesh(leftBackLegGeometry, this.skinMaterial);
    this.leftBackLeg.receiveShadow = true;
    this.leftBackLeg.position.set(0.35*size, -0.3*size, -0.45*size);
    this.group.add(this.leftBackLeg);
    addLines(leftBackLegGeometry, this.leftBackLeg);

    const leftBackDownLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftBackDownLeg = new THREE.Mesh(leftBackDownLegGeometry, this.blackMaterial);
    this.leftBackDownLeg.receiveShadow = true;
    this.leftBackDownLeg.position.set(0*size, -0.4*size, -0.0*size);
    this.leftBackLeg.add(this.leftBackDownLeg);

    const leftBackPawGeometry = new THREE.BoxGeometry(0.2*size, 0.1*size, 0.2*size);
    const leftBackPaw = new THREE.Mesh(leftBackPawGeometry, this.whiteMaterial);
    leftBackPaw.receiveShadow = true;
    leftBackPaw.position.set(0, -0.25*size, 0);
    this.leftBackDownLeg.add(leftBackPaw);
    addLines(leftBackPawGeometry, leftBackPaw);

    //Left Front Leg
    const leftFrontLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftFrontLeg = new THREE.Mesh(leftFrontLegGeometry, this.skinMaterial);
    this.leftFrontLeg.receiveShadow = true;
    this.leftFrontLeg.position.set(0.35*size, -0.3*size, +0.45*size);
    this.group.add(this.leftFrontLeg);
    addLines(leftFrontLegGeometry, this.leftFrontLeg);

    const leftFrontDownLegGeometry = new THREE.BoxGeometry(0.2*size, 0.4*size, 0.2*size);
    this.leftFrontDownLeg = new THREE.Mesh(leftFrontDownLegGeometry, this.blackMaterial);
    this.leftFrontDownLeg.receiveShadow = true;
    this.leftFrontDownLeg.position.set(0.0*size, -0.4*size, 0.0*size);
    this.leftFrontLeg.add(this.leftFrontDownLeg);

    const leftFrontPawGeometry = new THREE.BoxGeometry(0.2*size, 0.1*size, 0.2*size);
    const leftFrontPaw = new THREE.Mesh(leftFrontPawGeometry, this.whiteMaterial);
    leftFrontPaw.receiveShadow = true;
    leftFrontPaw.position.set(0, -0.25*size, 0);
    this.leftFrontDownLeg.add(leftFrontPaw);
    addLines(leftFrontPawGeometry, leftFrontPaw);
}

jump(speed) {
    this.vAngle += speed;
    this.group.position.y = Math.sin(this.vAngle) + 1.38;

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4;

    this.leftFrontLeg.rotation.x = -legRotation;
    this.leftFrontDownLeg.rotation.x = -legRotation;

    this.rightFrontLeg.rotation.x = -legRotation;
    this.rightFrontDownLeg.rotation.x = -legRotation;

    this.rightBackLeg.rotation.x = -legRotation;
    this.rightBackDownLeg.rotation.x = -legRotation;

    this.leftBackLeg.rotation.x = -legRotation;
    this.leftBackDownLeg.rotation.x = -legRotation;

    this.group.position.z = this.group.position.z + 0.025;

  }
  //// TODO:
/*
jump(speed){
  jumpStart();
  //ruota verso alto corpo, tensione gambe dietro,allunga gambe davanti ///
  flying();//allunga gambe dietro,ruota corpo posizione discesa \\\\
  jumpEnd();//tocca terra,accorcia gambe avanti,ruota corpo ----,
}
*/
actionOnPressKey() {
    if (keyWDown) {
      this.jump(0.06);
    } else {

      if (this.group.position.y <= 0.4) return;
      this.jump(0.08);
    }
  }
}
