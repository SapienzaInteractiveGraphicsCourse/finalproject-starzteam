//#######################
//CHICKEN
//#######################

class Chicken{
  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = -0.55; //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)

    const boxReferenceGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.9);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.boxReference.position.set(0, -0.5, 0.05);
    scene.add(this.boxReference);//this.boxReference

    this.boxReference.visible = false;

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
