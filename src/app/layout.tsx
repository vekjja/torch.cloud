// src/app/layout.tsx (server component)
import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "./ClientProviders";
import { Box, Link, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Torch Cloud",
  description: "The Cloud Behind The Couch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
          {/* Footer / Privacy link */}
          <Box width="100%" textAlign="center" padding="1rem" marginTop="100vh">
            <Link href="/privacy" color="inherit" underline="none">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Privacy Policy
              </Typography>
            </Link>
          </Box>
        </ClientProviders>
      </body>
    </html>
  );
}
