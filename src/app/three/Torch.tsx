"use client";

import React from "react";
import { igniteTorch } from "@/utils/audio";
import IScene from "./iScene";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Torch() {
  function handleClick() {
    igniteTorch();
  }

  function loadScene(
    scene: THREE.Scene,
    addMixer: (m: THREE.AnimationMixer) => void
  ) {
    const loader = new GLTFLoader();
    loader.load("/gltf/torch/scene.gltf", (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -7.2, -3);
      scene.add(model);

      // 4. Lights
      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(0, 10, 10);
      scene.add(mainLight);

      const backLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
      backLight.position.set(3, -10, 10);
      scene.add(backLight);

      // 5. Optional: Animations
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip);
          action.play();
        });
        addMixer(mixer);
      }
    });
  }

  return (
    <div onClick={handleClick} style={{ width: "100%", height: "40vh" }}>
      <IScene alpha={true} loadScene={loadScene} />
    </div>
  );
}
