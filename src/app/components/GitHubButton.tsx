// src/app/components/SignOutButton.tsx
"use client";

import { Button, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function GitHubButton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
      <Button
        variant="contained"
        color="secondary"
        href="https://github.com/seemywingz/torch.cloud"
        target="_blank"
      >
        <GitHubIcon />
      </Button>
    </Box>
  );
}
