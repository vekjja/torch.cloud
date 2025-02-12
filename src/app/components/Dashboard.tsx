// src/app/dashboard/page.tsx
"use client";
// import { redirect } from "next/navigation";
import TopBar from "./TopBar";
import { Box } from "@mui/material";
import { Session } from "next-auth";
import { useAudio } from "@/context/AudioProvider";
import OpenAIChat from "./OpenAIChat";

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  const { playRandomBGM } = useAudio();
  return (
    <Box
      onClick={() => {
        playRandomBGM();
      }}
    >
      <TopBar session={session} />
      <Box sx={{ padding: 2 }}>
        <OpenAIChat />
      </Box>
    </Box>
  );
}
