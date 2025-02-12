"use client";

import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import { useAudio } from "@/context/AudioProvider";

export default function AudioControls() {
  const { bgmVolume, sfxVolume, setBgmVolume, setSfxVolume } = useAudio();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, gap: 2 }}>
      <Typography variant="h6">Audio Controls</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>BGM Volume</Typography>
        <Slider
          value={bgmVolume}
          min={0}
          max={1}
          step={0.05}
          onChange={(_, value) => setBgmVolume(value as number)}
          sx={{ width: 150 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>SFX Volume</Typography>
        <Slider
          value={sfxVolume}
          min={0}
          max={1}
          step={0.05}
          onChange={(_, value) => setSfxVolume(value as number)}
          sx={{ width: 150 }}
        />
      </Box>
    </Box>
  );
}
