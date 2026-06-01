"use client";

import { useSession } from "next-auth/react";
import { Box, Link, Typography } from "@mui/material";
import Dashboard from "./components/Dashboard";
import SignInButton from "./components/SignInButton";
// import GitHubButton from "./components/GitHubButton";
// import Torch from "./components/Torch";

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
            {/* <GitHubButton /> */}
          </Box>
          <Box sx={{ margin: "18%", textAlign: "center" }}>
            <Typography variant="h2" gutterBottom>
              Torch Cloud
            </Typography>
            <Typography variant="body1" gutterBottom>
              Adventure Begins
            </Typography>
            {/* <Torch sceneHeight={"40vh"} /> */}
            <SignInButton />
          </Box>
          {/* Footer / Privacy Page link */}
          <Box sx={{ width: "100%", textAlign: "center", padding: "1rem", marginTop: "100vh" }}>
            <Link href="/privacy" color="inherit" underline="none">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Privacy Policy
              </Typography>
            </Link>
          </Box>
        </>
        
      ) : (
        <Dashboard session={session} />
      )}
    </Box>
  );
}
