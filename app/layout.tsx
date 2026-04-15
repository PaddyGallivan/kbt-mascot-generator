import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KBT Mascot Generator",
  description: "Turn any photo into a cartoon mascot using AI — by Kow Brainer Trivia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#f5f5f5" }}>{children}</body>
    </html>
  );
}
