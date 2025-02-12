// src/app/components/SignOutButton.tsx
"use client";

import React from "react";
import { Box } from "@mui/material";
import { playEnchantedForest } from "@/utils/audio";

export default function AudioPlayer() {
  React.useState(() => {
    playEnchantedForest();
  });

  return <Box></Box>;
}
