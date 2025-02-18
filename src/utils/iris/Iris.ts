"use strict";

import * as THREE from "three";
import iCam from "./iCam";
import iObject from "./iObject";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface IrisProps {
  mount: HTMLElement;
  alpha?: boolean;
  width?: number;
  height?: number;
  antialias?: boolean;
}

export default class Iris {
  cam: iCam;
  scene: THREE.Scene;
  mount: HTMLElement;
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  mixers: THREE.AnimationMixer[] = [];
  iObjs: iObject[] = [];
  audioLoader: THREE.AudioLoader = new THREE.AudioLoader();
  gltfLoader: GLTFLoader = new GLTFLoader();
  animate: () => void;

  constructor(props: IrisProps) {
    this.mount = props.mount;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      alpha: props.alpha,
      antialias: props.antialias,
    });
    this.renderer.setSize(
      props.width || props.mount.clientWidth,
      props.height || props.mount.clientHeight
    );
    props.mount.appendChild(this.renderer.domElement);
    this.cam = new iCam(this);

    this.clock = new THREE.Clock();
    console.log("iScene Initialized");

    this.animate = () => {
      this.render();
      requestAnimationFrame(this.animate);
    };
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  loadScene(sceneFunc: (i: Iris) => void) {
    sceneFunc(this);
  }

  /**
   * Update any mixers, then render the scene.
   */
  render() {
    const delta = this.clock.getDelta();
    this.mixers.forEach((mixer) => mixer.update(delta));
    this.cam.update(delta);
    this.renderer.render(this.scene, this.cam.lens);
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
    this.cam.lens.aspect = nWidth / nHeight;
    this.cam.lens.updateProjectionMatrix();
    this.renderer.setSize(nWidth, nHeight);
  }

  enableControls() {
    this.cam.enableControls();
  }

  getPositionalAudio(fileName = "", dist = 1) {
    const listener = new THREE.AudioListener();
    this.cam.lens.add(listener);
    const audio = new THREE.PositionalAudio(listener);
    this.audioLoader.load(fileName, function (buffer) {
      audio.setBuffer(buffer);
      audio.setRefDistance(dist);
      audio.play();
    });
    return audio;
  }

  dispose() {
    this.renderer.dispose();
    this.mount.removeChild(this.renderer.domElement);
    window.removeEventListener("resize", () => this.resize());
    for (const obj of this.iObjs) {
      obj.dispose();
    }
  }
}
