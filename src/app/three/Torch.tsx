"use client";

import React from "react";
import { igniteTorch } from "@/utils/audio";
import IScene from "./iScene";

export default function Torch() {
  function handleClick() {
    igniteTorch();
  }

  return (
    <div onClick={handleClick} style={{ width: "100%", height: "40vh" }}>
      <IScene alpha={true} />
    </div>
  );
}
