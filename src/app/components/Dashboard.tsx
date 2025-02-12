// src/app/dashboard/page.tsx
"use client";
// import { redirect } from "next/navigation";
import TopBar from "./TopBar";
import { Box } from "@mui/material";
import { Session } from "next-auth";
import { playEnchantedForest } from "@/utils/audio";
import OpenAIChat from "./OpenAIChat";

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  return (
    <Box
      onClick={() => {
        playEnchantedForest(0.15);
      }}
    >
      <TopBar session={session} />
      <Box sx={{ padding: 2 }}>
        <OpenAIChat />
      </Box>
    </Box>
  );
}
