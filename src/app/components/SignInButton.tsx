"use client";

import { signIn } from "next-auth/react";
// import Torch from "../three/Torch";
import { Button, Box, Modal, Paper } from "@mui/material";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { playMenuSFX, playRandomBGM, igniteTorch } from "@/utils/audio";

export default function SignInButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    playMenuSFX();
    igniteTorch();
    playRandomBGM();
    setOpen(true);
  };

  const handleClose = () => {
    playMenuSFX();
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Sign In
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent", // Ensures full transparency
        }}
      >
        <Paper
          sx={{
            backgroundColor: "transparent", // Ensures the modal itself is transparent
            boxShadow: "none", // Removes shadow effect
            textAlign: "center",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ mt: 1, mb: 1, height: "40px", fontSize: "0.875rem" }}
              onClick={() => signIn("google")}
            >
              <GoogleIcon /> Sign In with Google
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1, mb: 1, height: "40px", fontSize: "0.875rem" }}
              onClick={() => signIn("discord")}
            >
              <SportsEsportsIcon /> Sign In with Discord
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1, mb: 1, height: "40px", fontSize: "0.875rem" }}
              onClick={() => signIn("linkedin")}
            >
              <LinkedInIcon /> Sign In with LinkedIn
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
