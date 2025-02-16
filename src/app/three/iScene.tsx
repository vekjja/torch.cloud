"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import iScene from "@/utils/iris/iScene";

interface iSceneRefProps {
  alpha?: boolean;
  width?: number;
  height?: number;
  antialias?: boolean;
}

const IScene = ({
  width,
  height,
  alpha = false,
  antialias = true,
}: iSceneRefProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const iSceneRef = useRef<iScene | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Create iScene instance (if it doesn’t exist yet)
    if (!iSceneRef.current) {
      iSceneRef.current = new iScene({
        mount,
        alpha,
        width,
        height,
        antialias,
      });
    }

    // 2. Start the animation loop
    const animate = () => {
      if (!iSceneRef.current) return;
      iSceneRef.current.render(); // iScene handles model loading, mixers, etc.
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 3. Handle resizing
    const handleResize = () => {
      if (!iSceneRef.current) return;
      iSceneRef.current.resize();
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Do an initial resize

    // 4. Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", handleResize);
      // Optional: remove the WebGL canvas from the DOM
      // if (iSceneRef.current?.renderer?.domElement) {
      //   mount.removeChild(iSceneRef.current.renderer.domElement);
      // }
    };
  }, [alpha, antialias, height, width]);

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
