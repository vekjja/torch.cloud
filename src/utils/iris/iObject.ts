"use-strict";

import * as THREE from "three";
import Iris from "../Iris";

export default class iObject {
  x: number;
  y: number;
  z: number;
  mixer: THREE.AnimationMixer | null;
  iris: Iris;
  obj3D: THREE.Object3D;

  constructor(
    i: Iris,
    x = 0,
    y = 0,
    z = 0,
    threeObject = new THREE.Object3D()
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.iris = i;
    this.mixer = null;
    this.obj3D = threeObject;
  }

  addToScene() {
    this.iris.scene.add(this.obj3D);
    this.iris.sceneObjects.push(this);
  }

  update(tick = 0.5) {
    // if (this.scene.physicsEnabled && this.body !== null) {
    //   this.body.getMotionState().getWorldTransform(this.transform);
    //   var origin = this.transform.getOrigin();
    //   this.obj3D.position.x = origin.x();
    //   this.obj3D.position.y = origin.y();
    //   this.obj3D.position.z = origin.z();
    //   var rotation = this.transform.getRotation();
    //   this.obj3D.quaternion.x = rotation.x();
    //   this.obj3D.quaternion.y = rotation.y();
    //   this.obj3D.quaternion.z = rotation.z();
    //   this.obj3D.quaternion.w = rotation.w();
    // }

    if (this.mixer !== null) this.mixer.update(tick);

    this.onUpdate();
  }

  onUpdate() {}

  setPosition(x: number, y: number, z: number) {
    this.obj3D.position.set((this.x = x), (this.y = y), (this.z = z));
  }
}
