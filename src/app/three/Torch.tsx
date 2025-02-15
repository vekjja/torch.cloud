"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { igniteTorch } from "@/utils/audio";
import ThreeScene from "./ThreeScene";

export default function Torch() {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  function renderScene(
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    requestRef: { current: number | null }
  ) {
    const loader = new GLTFLoader();

    loader.load("/gltf/torch/scene.gltf", (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -7.2, -3);

      if (!scene.children.includes(model)) {
        scene.add(model);
      }

      // Lighting
      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(0, 10, 10);
      scene.add(mainLight);

      const backLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
      backLight.position.set(3, -10, 10);
      scene.add(backLight);

      // 🎥 **Handle Animations**
      if (gltf.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixerRef.current!.clipAction(clip);
          action.play();
        });
      }

      // Animation Loop
      const clock = new THREE.Clock();
      const animate = () => {
        if (!scene || !camera || !renderer) return;

        // Update animation mixer
        if (mixerRef.current) {
          mixerRef.current.update(clock.getDelta());
        }

        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };

      animate();
    });
  }

  function handleClick() {
    igniteTorch(); // Plays torch lighting sound
  }

  return (
    <div onClick={handleClick} style={{ width: "100%", height: "40vh" }}>
      <ThreeScene alpha={true} renderScene={renderScene} />
    </div>
  );
}
