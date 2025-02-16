"use client";

import { useSession } from "next-auth/react";
import { Box, Typography } from "@mui/material";
import Dashboard from "./components/Dashboard";
import SignInButton from "./components/SignInButton";
import GitHubButton from "./components/GitHubButton";
import Torch from "./three/Torch";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {!session ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ flexGrow: 1 }} />
            <SignInButton />
            <GitHubButton />
          </Box>
          <Box margin={"18%"} textAlign="center">
            <Typography variant="h2" gutterBottom>
              Torch Cloud
            </Typography>
            <Typography variant="body1" gutterBottom>
              Adventure Begins
            </Typography>
            <Torch sceneHeight={"40vh"} />
          </Box>
        </>
      ) : (
        <Dashboard session={session} />
      )}
    </Box>
  );
}
