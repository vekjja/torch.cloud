// src/app/dashboard/page.tsx
"use client";
import TopBar from "./TopBar";
import { Box } from "@mui/material";
import { Session } from "next-auth";
import OpenAIChat from "./OpenAIChat";

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  return (
    <Box onClick={() => {}}>
      <TopBar session={session} />
      <Box sx={{ padding: 2 }}>
        <OpenAIChat />
      </Box>
    </Box>
  );
}
