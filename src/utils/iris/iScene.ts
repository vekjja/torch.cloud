"use strict";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface iSceneProps {
  mount: HTMLElement;
  alpha?: boolean;
  width?: number;
  height?: number;
  antialias?: boolean;
}

export default class iScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  mixer: THREE.AnimationMixer | null = null;
  model?: THREE.Group;
  mount: HTMLElement;

  constructor(props: iSceneProps) {
    // 1. Basic Scene Setup
    this.mount = props.mount;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      (props.width || props.mount.clientWidth) /
        (props.height || props.mount.clientHeight),
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      alpha: props.alpha,
      antialias: props.antialias,
    });
    this.renderer.setSize(
      props.width || props.mount.clientWidth,
      props.height || props.mount.clientHeight
    );
    props.mount.appendChild(this.renderer.domElement);

    console.log("iScene Initialized");

    // 2. Create Clock for Animation
    this.clock = new THREE.Clock();

    // 3. Load Torch Model
    this.loadGLTF("/gltf/torch/scene.gltf");
  }

  private loadGLTF(modelPath: string) {
    if (!modelPath) {
      console.error("No model path provided");
      return;
    }
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        this.model = gltf.scene;
        this.model.position.set(0, -7.2, -3);
        this.scene.add(this.model);

        // 4. Lights
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(0, 10, 10);
        this.scene.add(mainLight);

        const backLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
        backLight.position.set(3, -10, 10);
        this.scene.add(backLight);

        // 5. Optional: Animations
        if (gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);
          gltf.animations.forEach((clip) => {
            const action = this.mixer!.clipAction(clip);
            action.play();
          });
        }
      },
      undefined,
      (err) => {
        console.error("Error loading torch model:", err);
      }
    );
  }

  /**
   * Called every animation frame from the `<IScene />` component.
   * Update any mixers, then render the scene.
   */
  render() {
    const delta = this.clock.getDelta();
    // If there's an active mixer, update it
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize the renderer to the new width and height.
   * If no width or height is provided, it will default to the mount's clientWidth and clientHeight.
   */
  resize(width?: number, height?: number) {
    const nWidth = width ? width : this.mount.clientWidth;
    const nHeight = height ? height : this.mount.clientHeight;
    this.camera.aspect = nWidth / nHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(nWidth, nHeight);
  }
}
