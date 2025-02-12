// src/app/components/DashboardContent.tsx
"use client";

import * as React from "react";
import { Box, Button } from "@mui/material";

export default function DonateButton() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          window.open("https://buy.stripe.com/4gw15lb6L7Nq1kk3cc", "_blank")
        }
      >
        Donate
      </Button>
    </Box>
  );
}
