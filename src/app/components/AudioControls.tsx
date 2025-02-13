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
  globalAudioEnabled,
  setGlobalAudioEnabled,
} from "@/utils/audio";

export default function AudioControls() {
  const [audioEnabled, setAudioEnabled] = useState(globalAudioEnabled); // Default enabled
  const [bgm, setBgm] = useState(bgmVolume); // Store BGM volume in state
  const [sfx, setSfx] = useState(sfxVolume); // Store SFX volume in state

  const handleAudioToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioEnabled(event.target.checked);
    setGlobalAudioEnabled(event.target.checked);
  };

  const handleBgmChange = (_: Event, value: number | number[]) => {
    const newValue = value as number;
    setBgm(newValue);
    setBgmVolume(newValue);
  };

  const handleSfxChange = (_: Event, value: number | number[]) => {
    const newValue = value as number;
    setSfx(newValue);
    setSfxVolume(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, gap: 2 }}>
      <FormControlLabel
        control={
          <Checkbox checked={audioEnabled} onChange={handleAudioToggle} />
        }
        label="Audio"
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>BGM Volume</Typography>
        <Slider
          value={bgm}
          min={0}
          max={1}
          step={0.0009}
          onChange={handleBgmChange}
          sx={{ width: 150 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>SFX Volume</Typography>
        <Slider
          value={sfx}
          min={0}
          max={1}
          step={0.05}
          onChange={handleSfxChange}
          sx={{ width: 150 }}
        />
      </Box>
    </Box>
  );
}
