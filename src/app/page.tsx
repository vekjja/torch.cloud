import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import SignInButton from "./components/SignInButton";
import GitHubButton from "./components/GitHubButton";
import Cloud from "./three/Cloud";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Box>
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
        <Box
          sx={{
            width: "100%",
            height: "40vh",
            top: "1%",
            zIndex: -1,
            position: "relative",
          }}
        >
          <Cloud alpha={true} />
        </Box>
      </Box>
    </Box>
  );
}
