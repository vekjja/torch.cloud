"use client";

import { useState } from "react";
import {
  Box,
  Slider,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  bgmVolume,
  sfxVolume,
  setBgmVolume,
  setSfxVolume,
} from "@/utils/audio";

export default function AudioControls() {
  const [narrationEnabled, setNarrationEnabled] = useState(true); // Default enabled
  const handleNarrationToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNarrationEnabled(event.target.checked);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, gap: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={narrationEnabled}
            onChange={handleNarrationToggle}
          />
        }
        label="Narration"
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>BGM Volume</Typography>
        <Slider
          value={bgmVolume}
          min={0}
          max={1}
          step={0.0009}
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
