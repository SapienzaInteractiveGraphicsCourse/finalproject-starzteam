//#######################
//CHICKEN
//#######################
const speedUp = 0.12;
const speedDown = 0.16;
var last = 'x';
var sign = +1;
var inMotion = false;
var descending = false;
var currentScore = 0;
var highestScore = 0;
var contatore = 0;
var tot = 0;
var legRotation = 0;
class Chicken{
  constructor(){
    this.group = new THREE.Group();
    this.group.position.y = -0.55; //x++ right with respect of the camera, y++ height to the high, z++ front closer to the camera (x, y, z)
    this.group.position.z = -6;

    const boxReferenceGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.9);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.boxReference = new THREE.Mesh(boxReferenceGeometry, material);
    this.boxReference.position.set(0, -0.5, 0.05);
    this.group.add(this.boxReference);

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
    this.restHeight = this.group.position.y;

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
    this.leftWing = new THREE.Mesh(leftWingGeometry, this.skinMaterial);
    this.leftWing.castShadow = true;
    this.leftWing.receiveShadow = true;
    this.leftWing.position.set(0.4, 0, 0);
    body.add(this.leftWing);

    const rightWingGeometry = new THREE.BoxGeometry(0.23, 0.16, 0.33);
    this.rightWing = new THREE.Mesh(rightWingGeometry, this.skinMaterial);
    this.rightWing.castShadow = true;
    this.rightWing.receiveShadow = true;
    this.rightWing.position.set(-0.4, 0, 0);
    body.add(this.rightWing);

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
    this.leftLeg = new THREE.Mesh(leftLegGeometry, this.orangeMaterial);
    //leftLeg.castShadow = true;
    this.leftLeg.receiveShadow = true;
    this.leftLeg.position.set(0.175, -0.425, 0);
    this.group.add(this.leftLeg);

    const leftPawGeometry = new THREE.BoxGeometry(0.27, 0.07, 0.2);
    const leftPaw = new THREE.Mesh(leftPawGeometry, this.orangeMaterial);
    //leftPaw.castShadow = true;
    leftPaw.receiveShadow = true;
    leftPaw.position.set(0, -0.2125, 0);
    this.leftLeg.add(leftPaw);

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
    this.rightLeg = new THREE.Mesh(rightLegGeometry, this.orangeMaterial);
    //rightLeg.castShadow = true;
    this.rightLeg.receiveShadow = true;
    this.rightLeg.position.set(-0.175, -0.425, 0);
    this.group.add(this.rightLeg);

    const rightPawGeometry = new THREE.BoxGeometry(0.27, 0.07, 0.2);
    const rightPaw = new THREE.Mesh(rightPawGeometry, this.orangeMaterial);
    //rightPaw.castShadow = true;
    rightPaw.receiveShadow = true;
    rightPaw.position.set(0, -0.2125, 0);
    this.rightLeg.add(rightPaw);

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

  jump(speed, dist, asse) {
    this.vAngle += speed;

    //check if i'm going up or down
    if(this.group.position.y >= 3 || descending){
      this.group.position.y-= Math.sin(speed)*1.2;
      descending = true;
      legRotation = -30 * Math.PI / 180 /19;
    }
    else{
      console.log("here");
      legRotation  = 30 * Math.PI / 180 /19;
      this.group.position.y+= Math.sin(speed)*1.2;
    }


    this.rightLeg.rotation.x += legRotation;
    console.log(this.rightLeg.rotation.x);
    this.leftLeg.rotation.x += legRotation;

    //had to speed up the movement since i'm using a different incremental function
    if(asse=='z') this.group.position.z = this.group.position.z + 0.9473*dist;
    if(asse=='x') this.group.position.x = this.group.position.x + 0.9473*dist;

    const wingRotation = Math.sin(this.vAngle) * Math.PI / 3 + 1.5;
    this.rightWing.rotation.z = wingRotation;
    this.leftWing.rotation.z = -wingRotation;

    //I'm close to the terriain and i don't want to compenetrate, let's stop stalling the keyboard presses
    //and resetting to original height.
    if(this.group.position.y <= -0.55){
      inMotion = false;
      descending = false;
      this.group.position.y = -0.55;
      this.rightWing.rotation.z = 0;
      this.leftWing.rotation.z = 0;
      this.rightLeg.rotation.x = 0;
      this.leftLeg.rotation.x = 0;
      if(asse=='z') this.group.position.z += 0.000247;
      if(asse=='x') this.group.position.x += 0.000247;
    }
  }
  actionOnPressKey() {
    if(inMotion){
      this.jump(speedDown, sign * dist, last);
    }
    else{
      var referencePosition = new THREE.Vector3();
      scene.updateMatrixWorld();
      this.boxReference.getWorldPosition(referencePosition);
      if (keyWDown){
        //check su checkTrees

        referencePosition.z += 3.42;
        if( !checkTrees(referencePosition) ){
          currentScore++;
          document.getElementById("cScore").innerHTML = currentScore;
          if(currentScore > highestScore){
            highestScore = currentScore;
            document.getElementById("hScore").innerHTML = highestScore;
          }
          //Resetting stuff and preparing s.t. when going to inMotion i can keep on doing what i was doing till i'm done (shish)
          inMotion = true;
          last = 'z';
          sign = 1;
          this.vAngle = 0;
          this.group.rotation.y = rad(0);
          this.jump(speedUp, dist, 'z');
        }
      }
      else if (keySDown){
        //check su checkTrees

        referencePosition.z -= 3.72;
        if( !checkTrees(referencePosition) ){
          currentScore--;
          document.getElementById("cScore").innerHTML = currentScore;
          inMotion = true;
          last = 'z';
          sign = -1;
          this.vAngle = 0;
          this.group.rotation.y = rad(180);
          this.jump(speedUp, -dist, 'z');
        }
      }
      else if (keyADown) {
        //check su checkTrees
        referencePosition.x += 3.57;
        if( !checkTrees(referencePosition) ){
          inMotion = true;
          last = 'x';
          sign = 1;
          this.vAngle = 0;
          this.group.rotation.y = rad(90);
          this.jump(speedUp, dist, 'x');
        }
      }
      else if (keyDDown) {
        //check su checkTrees

        referencePosition.x -= 3.57;
        if( !checkTrees(referencePosition) ){
          inMotion = true;
          last = 'x';
          sign = -1;
          this.vAngle = 0;
          this.group.rotation.y = rad(270);
          this.jump(speedUp, -dist, 'x');
        }
      }
    }
}
}
