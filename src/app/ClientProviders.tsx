"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import theme from "@/app/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

// Create Emotion cache for SSR
const createEmotionCache = () => createCache({ key: "css", prepend: true });

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientSideCache] = useState(createEmotionCache);

  return (
    <CacheProvider value={clientSideCache}>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
