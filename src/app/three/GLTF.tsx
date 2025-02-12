"use client";

import * as React from "react";
import ThreeScene from "./Scene";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface GLTFProps {
  color?: number;
  alpha?: boolean;
  width?: number;
  height?: number;
  model: string;
  position?: Position;
}

export default function GLTFModel({
  color = 0xffff,
  alpha = false,
  width,
  height,
  model,
}: GLTFProps) {
  // Render Scene
  const renderScene = (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    requestRef: { current: number | null }
  ) => {
    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(`/gltf/${model}/scene.gltf`, (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -6, -3);
      scene.add(model);
      // Add Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 10, 10);
      scene.add(light);

      const bLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
      bLight.position.set(3, -10, 10);
      scene.add(bLight);

      // Animation mixer
      const mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      // Animation loop
      const clock = new THREE.Clock();
      const animate = () => {
        const delta = clock.getDelta();
        mixer.update(delta); // Update the mixer on each frame
        model.rotation.y += 0.005; // Smooth rotation
        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };
      animate();
    });
  };

  return (
    <ThreeScene
      color={color}
      alpha={alpha}
      width={width}
      height={height}
      renderScene={renderScene}
    />
  );
}
