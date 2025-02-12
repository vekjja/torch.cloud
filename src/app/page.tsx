import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import SignInButton from "./components/SignInButton";
import GitHubButton from "./components/GitHubButton";
import Torch from "./three/Torch";
import Dashboard from "./components/Dashboard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

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
              the adventure Begins
            </Typography>
            <Torch />
          </Box>
        </>
      ) : (
        <Dashboard session={session} />
      )}
    </Box>
  );
}
