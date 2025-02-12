// src/app/components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button, Box } from "@mui/material";

export default function SignOutButton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
      <Button variant="contained" color="secondary" onClick={() => signOut()}>
        Sign Out
      </Button>
    </Box>
  );
}
