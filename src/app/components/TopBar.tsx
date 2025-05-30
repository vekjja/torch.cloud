"use client";

import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import { Session } from "next-auth";
import DonateButton from "./DonateButton";
import SignOutButton from "./SignOutButton";
import Settings from "./Settings";

interface TopBarProps {
  session: Session;
}

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function TopBar({ session }: TopBarProps) {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 8 }}>
      <HideOnScroll>
        <AppBar position="fixed" enableColorOnDark={true} color="transparent">
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Avatar
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="h6" component="div">
                Welcome, {session.user?.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Settings />
              <DonateButton />
              <SignOutButton />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </Box>
  );
}
