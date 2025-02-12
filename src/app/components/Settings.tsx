"use client";

import { useState } from "react";
import { Box, IconButton, Typography, Popover } from "@mui/material";
import SettingsSuggest from "@mui/icons-material/SettingsSuggest";
import { useAudio } from "@/context/AudioProvider";
import AudioControls from "./AudioControls";

export default function Settings() {
  const { menuSelect } = useAudio();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    menuSelect();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    menuSelect();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <SettingsSuggest />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Settings
          </Typography>
          <AudioControls />
        </Box>
      </Popover>
    </Box>
  );
}
