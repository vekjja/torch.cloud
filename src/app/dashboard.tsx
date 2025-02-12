// src/app/dashboard/page.tsx

// import { redirect } from "next/navigation";
import TopBar from "./components/TopBar";
import { Box } from "@mui/material";
import { Session } from "next-auth";
import OpenAIChat from "./components/OpenAIChat";

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  return (
    <Box>
      <TopBar session={session} />
      <Box sx={{ padding: 2 }}>
        <OpenAIChat />
      </Box>
    </Box>
  );
}
