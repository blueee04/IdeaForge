import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Sage AI | Research Backed Startup Ideas",
  description:
    "AI powered platform that combines deep research automation, novelty based idea curation, and expert matchmaking to help founders build what matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
