"use client";

import * as React from "react";
import ThreeScene from "./Scene";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface CloudProps {
  color?: number;
  alpha?: boolean;
  width?: number;
  height?: number;
}

function renderCloud(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  requestRef: { current: number | null }
) {
  const loader = new GLTFLoader();
  loader.load(
    `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/gltf/cloud/scene.gltf`, // Ensure the correct path
    (gltf) => {
      const model = gltf.scene;
      // Compute model bounding box
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Normalize size
      const maxSize = Math.max(size.x * 0.8, size.y * 0.08, size.z);
      const scaleFactor = 2 / maxSize; // Adjust scale to fit viewport
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Recenter model to the origin
      model.position.sub(center.multiplyScalar(scaleFactor));

      // Ensure model receives and casts shadows
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      model.position.set(0, 0, 0);
      scene.add(model);

      // Adjust Camera Positioning
      camera.position.set(0, 0, 3); // Move camera back to fit model
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Add Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 10, 10);
      scene.add(light);

      const bLight = new THREE.DirectionalLight(0xff640a, 0.8);
      bLight.position.set(3, -10, 10);
      scene.add(bLight);

      // Animation loop
      const animate = () => {
        model.rotation.y += 0.005; // Smooth rotation
        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };
      animate();
    },
    undefined,
    (error) => {
      console.error("An error happened", error);
    }
  );
}

export default function Cloud({
  color = 0xffff,
  alpha = false,
  width,
  height,
}: CloudProps) {
  return (
    <ThreeScene
      color={color}
      alpha={alpha}
      width={width}
      height={height}
      renderFunction={renderCloud}
    />
  );
}
