"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

import * as THREE from "three";
import { Iris } from "@/utils/iris";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { igniteTorch } from "@/utils/audio";

interface TorchProps {
  sceneWidth?: string | number;
  sceneHeight?: string | number;
  enableControls?: boolean;
}

export default function Torch({
  sceneWidth: width,
  sceneHeight: height,
  enableControls = false,
}: TorchProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const iRef = useRef<Iris | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!iRef.current) {
      iRef.current = new Iris({
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

    if (enableControls) iRef.current.enableControls();

    return () => {
      if (process.env.NODE_ENV === "production") iRef.current?.dispose();
    };
  }, [enableControls]);

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
