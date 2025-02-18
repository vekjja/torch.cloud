"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

import * as THREE from "three";
import iScene from "@/utils/Iris";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { igniteTorch } from "@/utils/audio";

interface TorchProps {
  sceneWidth?: string | number;
  sceneHeight?: string | number;
}

export default function Torch({
  sceneWidth: width,
  sceneHeight: height,
}: TorchProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const iRef = useRef<iScene | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!iRef.current) {
      iRef.current = new iScene({
        mount,
        alpha: true,
        antialias: true,
      });
    }

    const loader = new GLTFLoader();
    loader.load("/gltf/torch/scene.gltf", (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -7.2, -12);
      iRef.current!.scene.add(model);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(0, 10, 10);
      iRef.current!.scene.add(mainLight);

      const backLight = new THREE.DirectionalLight(0xfb8f4c, 0.8);
      backLight.position.set(3, -10, 10);
      iRef.current!.scene.add(backLight);

      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip);
          action.play();
        });
        iRef.current!.addMixer(mixer);
      }
    });
    iRef.current.cam.enableControls();

    const animate = () => {
      if (!iRef.current) return;
      iRef.current.render(); // iScene handles model loading, mixers, etc.
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!iRef.current) return;
      iRef.current.resize();
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Do an initial resize

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      onClick={igniteTorch}
      sx={{
        width: width || "100%",
        height: height || "100%",
        marginBottom: 2,
      }}
    />
  );
}
