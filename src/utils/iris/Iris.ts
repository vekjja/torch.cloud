"use strict";

import * as THREE from "three";

interface IrisProps {
  mount: HTMLElement;
  alpha?: boolean;
  width?: number;
  height?: number;
  antialias?: boolean;
}

export default class Iris {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  mixers: THREE.AnimationMixer[] = [];
  model?: THREE.Group;
  mount: HTMLElement;

  constructor(props: IrisProps) {
    this.mount = props.mount;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      (props.width || props.mount.clientWidth) /
        (props.height || props.mount.clientHeight),
      0.1,
      1000
    );
    this.camera.position.z = 3;
    this.renderer = new THREE.WebGLRenderer({
      alpha: props.alpha,
      antialias: props.antialias,
    });
    this.renderer.setSize(
      props.width || props.mount.clientWidth,
      props.height || props.mount.clientHeight
    );
    props.mount.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    console.log("iScene Initialized");
  }

  loadScene(scenFunc: (i: Iris) => void) {
    scenFunc(this);
  }

  /**
   * Update any mixers, then render the scene.
   */
  render() {
    const delta = this.clock.getDelta();
    this.mixers.forEach((mixer) => mixer.update(delta));
    this.renderer.render(this.scene, this.camera);
  }

  addMixer(mixer: THREE.AnimationMixer) {
    this.mixers.push(mixer);
  }

  /**
   * Resize the renderer to the new width and height.
   * If no width or height is provided,
   * it will default to the mount's clientWidth and clientHeight.
   */
  resize(width?: number, height?: number) {
    const nWidth = width ? width : this.mount.clientWidth;
    const nHeight = height ? height : this.mount.clientHeight;
    this.camera.aspect = nWidth / nHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(nWidth, nHeight);
  }
}
