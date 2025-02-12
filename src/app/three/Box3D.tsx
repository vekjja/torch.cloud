"use client";

import * as React from "react";
import { Box } from "@mui/material";
import ThreeScene from "./Scene";
import * as THREE from "three";

interface Box3DProps {
  color?: number;
  alpha?: boolean;
}

function renderBox3D(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  requestRef: { current: number | null }
) {
  // Default Cube Render
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestRef.current = requestAnimationFrame(animate);
  };
  animate();
}

export default function Box3D({ color = 0xffff, alpha = false }: Box3DProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "50vh",
      }}
    >
      <ThreeScene color={color} alpha={alpha} renderFunction={renderBox3D} />
    </Box>
  );
}
