"use-strict";

import * as THREE from "three";
import Iris from "./Iris";

export default class iObject {
  x: number;
  y: number;
  z: number;
  i: Iris;
  obj3D: THREE.Object3D | null;

  constructor(i: Iris, x = 0, y = 0, z = 0, obj3D = null) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.obj3D = obj3D;
    this.addToScene();
  }

  addToScene() {
    this.i.iObjs.push(this);
    if (this.obj3D) this.i.scene.add(this.obj3D);
  }

  config() {
    if (this.obj3D === null) return;
    this.obj3D.position.set(this.x, this.y, this.z);
    this.obj3D.receiveShadow = true;
    this.obj3D.castShadow = true;
  }

  onUpdate() {}

  update(delta: number) {
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
    if (delta > 0) this.onUpdate();
  }

  setPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    if (this.obj3D !== null)
      this.obj3D.position.set((this.x = x), (this.y = y), (this.z = z));
  }

  addPositionalAudio(fileName = "", dist = 1) {
    if (!this.obj3D) return;
    const audio = this.i.getPositionalAudio(fileName, dist);
    this.obj3D.add(audio);
  }

  dispose() {
    if (this.obj3D) this.i.scene.remove(this.obj3D);
    // this.i.world.removeBody(this.body)
  }
}
