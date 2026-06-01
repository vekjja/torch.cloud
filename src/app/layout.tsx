// src/app/layout.tsx (server component)
import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  title: "Torch Cloud",
  description: "the adventure Begins",
  icons: {
    icon: "/favicon.png", // Standard favicon
    shortcut: "/favicon.png",
    apple: "/favicon.png", // Apple touch icon
  },
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
         
        </ClientProviders>
      </body>
    </html>
  );
}
