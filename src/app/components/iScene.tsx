"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Iris from "@/utils/Iris";

interface iSceneProps {
  alpha?: boolean;
  width?: number;
  height?: number;
  antialias?: boolean;
  loadScene?: (i: Iris) => void;
}

const IScene = ({
  width,
  height,
  alpha = false,
  antialias = true,
  loadScene = () => {},
}: iSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const iRef = useRef<Iris | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!iRef.current) {
      iRef.current = new Iris({
        mount,
        alpha,
        width,
        height,
        antialias,
      });
    }

    iRef.current.loadScene(loadScene);

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
  }, [alpha, antialias, height, width, loadScene]);

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

export default IScene;
