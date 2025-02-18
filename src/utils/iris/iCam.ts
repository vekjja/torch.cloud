"use strict";

import Iris from "./Iris";
import * as THREE from "three";
import iObject from "./iObject";

export default class iCam extends iObject {
  near: number;
  far: number;
  speed: number;

  moveLeft: boolean;
  moveRight: boolean;
  moveForward: boolean;
  moveBackward: boolean;
  moveUp: boolean;
  moveDown: boolean;

  keyControlsEnabled: boolean;

  clock: THREE.Clock;
  velocity: THREE.Vector3;

  lens: THREE.PerspectiveCamera;
  pointerLockElement: HTMLElement | null;
  controls: THREE.Object3D | null;
  hasPointerLock: boolean;

  constructor(i: Iris, x = 0, y = 0, z = 0, near = 0.5, far = 1000000) {
    super(i, x, y, z);

    this.near = near;
    this.far = far;
    this.speed = 50; // Movement acceleration factor

    // Movement flags
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveForward = false;
    this.moveBackward = false;

    this.keyControlsEnabled = false;

    this.clock = new THREE.Clock();
    this.velocity = new THREE.Vector3();

    // Create camera
    this.lens = new THREE.PerspectiveCamera(
      45,
      this.i.renderer.domElement.width / this.i.renderer.domElement.height,
      this.near,
      this.far
    );
    this.lens.position.set(x, y, z);
    this.lens.rotation.set(0, 0, 0);

    this.pointerLockElement = null;
    this.hasPointerLock = false;
    this.controls = null;
  }

  setPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.lens.position.set(x, y, z);
  }

  update(delta: number) {
    if (!this.controls || !this.hasPointerLock) return;

    // Add some friction to smooth the movement
    const friction = 8.0;
    this.velocity.x -= this.velocity.x * friction * delta;
    this.velocity.y -= this.velocity.y * friction * delta;
    this.velocity.z -= this.velocity.z * friction * delta;

    // Apply acceleration if movement flags are active
    const accel = this.speed;

    if (this.moveForward) {
      this.velocity.z -= accel * delta;
    }
    if (this.moveBackward) {
      this.velocity.z += accel * delta;
    }
    if (this.moveLeft) {
      this.velocity.x -= accel * delta;
    }
    if (this.moveRight) {
      this.velocity.x += accel * delta;
    }
    if (this.moveUp) {
      this.velocity.y += accel * delta;
    }
    if (this.moveDown) {
      this.velocity.y -= accel * delta;
    }

    // Translate the controls in local coordinate space
    this.controls.translateX(this.velocity.x * delta);
    this.controls.translateY(this.velocity.y * delta);
    this.controls.translateZ(this.velocity.z * delta);
  }

  addEventListeners() {
    window.addEventListener("keyup", this.keyUp.bind(this), false);
    window.addEventListener("keydown", this.keyDown.bind(this), false);

    // React to pointer lock changes
    document.addEventListener(
      "pointerlockchange",
      this.pointerlockchange.bind(this),
      false
    );
  }

  // --- KEYBOARD EVENTS --- //
  keyDown(event: KeyboardEvent) {
    // Use event.code for standard WASD
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.moveForward = true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.moveBackward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.moveLeft = true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.moveRight = true;
        break;
      case "KeyQ":
        this.moveDown = true;
        break;
      case "KeyE":
        this.moveUp = true;
        break;
      // If you want space for jump/up:
      // case "Space":
      //   this.moveUp = true;
      //   break;
    }
  }

  keyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.moveForward = false;
        break;
      case "ArrowDown":
      case "KeyS":
        this.moveBackward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.moveLeft = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.moveRight = false;
        break;
      case "KeyQ":
        this.moveDown = false;
        break;
      case "KeyE":
        this.moveUp = false;
        break;
      // If you want space for jump/up:
      // case "Space":
      //   this.moveUp = false;
      //   break;
    }
  }

  enableControls() {
    this.controls = this.pointerLockControls();
    this.pointerLockElement = this.i.renderer.domElement;
    this.addEventListeners();
    this.i.renderer.domElement.addEventListener("click", () => {
      if (
        this.pointerLockElement &&
        document.pointerLockElement !== this.pointerLockElement
      ) {
        this.initPointerLock();
      }
    });
  }

  initPointerLock() {
    if (!this.pointerLockElement) return;
    if ("pointerLockElement" in document) {
      this.pointerLockElement.requestPointerLock();
    } else {
      alert("Your Browser Does not Support Pointer Locking!");
    }
  }

  pointerlockchange() {
    if (!this.controls) return;
    if (document.pointerLockElement === this.pointerLockElement) {
      console.log("Pointer Locked");
      this.hasPointerLock = true;
    } else {
      console.log("Pointer Released");
      this.hasPointerLock = false;
    }
  }

  pointerLockControls() {
    // Reset camera local rotation
    this.lens.rotation.set(0, 0, 0);
    this.lens.position.set(0, 0, 0);

    // pitchObject controls the vertical rotation (up/down)
    const pitchObject = new THREE.Object3D();
    pitchObject.add(this.lens);

    // yawObject controls the horizontal rotation (left/right)
    const yawObject = new THREE.Object3D();
    yawObject.position.set(this.x, this.y, this.z);
    yawObject.add(pitchObject);

    // Lock vertical look between -90 deg and +90 deg
    const PI_2 = Math.PI / 2;

    // Listen for mouse movement to rotate yaw/pitch
    const onMouseMove = (event: MouseEvent) => {
      // Only rotate if pointer is locked
      if (document.pointerLockElement !== this.pointerLockElement) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      yawObject.rotation.y -= movementX * 0.002; // adjust sensitivity
      pitchObject.rotation.x -= movementY * 0.002;

      // Clamp vertical rotation to avoid flipping
      pitchObject.rotation.x = Math.max(
        -PI_2,
        Math.min(PI_2, pitchObject.rotation.x)
      );
    };

    document.addEventListener("mousemove", onMouseMove, false);

    // Add our yawObject to the scene; updates each frame
    this.i.scene.add(yawObject);

    return yawObject;
  }
}
