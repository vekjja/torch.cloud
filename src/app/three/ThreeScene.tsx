"use client";

import { scene, camera, renderer, initThreeScene } from "@/utils/three";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import * as THREE from "three";

// Define Prop Types
interface ThreeSceneProps {
  alpha?: boolean;
  width?: number;
  height?: number;
  renderScene?: (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    requestRef: { current: number | null }
  ) => void;
}

const ThreeScene = ({
  alpha = false,
  width,
  height,
  renderScene,
}: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Initialize Three.js scene
    initThreeScene({ mount, alpha });

    if (scene && camera && renderer && renderScene) {
      renderScene(scene, camera, renderer, requestRef);
    }

    // Animation Loop
    const animate = () => {
      if (!scene || !camera || !renderer) return;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate(); // Start animation loop

    // Resize Handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial resize

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (renderer?.domElement) mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [alpha, width, height, renderScene]);

  return (
    <Box
      ref={mountRef}
      sx={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    />
  );
};

export default ThreeScene;
