"use client";

import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Box } from "@mui/material";
import { lightTorch } from "@/utils/audio";

export default function Torch() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const requestRef = useRef<number | null>(null);
  const clock = new THREE.Clock();

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const delta = clock.getDelta();
    if (mixerRef.current) mixerRef.current.update(delta); // Update animations

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new GLTFLoader();
    loader.load("/gltf/torch/scene.gltf", (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -6, -3);
      scene.add(model);

      // Lighting
      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(0, 10, 10);
      scene.add(mainLight);

      const backLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
      backLight.position.set(3, -10, 10);
      scene.add(backLight);

      // Animation
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      }

      // Start animation loop
      requestRef.current = requestAnimationFrame(animate);
    });

    // Resize Handling
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize

    // Cleanup function
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
      if (sceneRef.current) sceneRef.current.clear();
      if (mixerRef.current) mixerRef.current = null;

      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [animate]);

  function handleClick() {
    lightTorch(0.27); // Plays torch lighting sound
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        height: "40vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box ref={mountRef} sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
