import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nebius.Build | AI + Robotics Hackathon",
  description:
    "AI + Robotics hackathon powered by Nebius. Workshops, demos, and awards. Free, open-source, community-curated. San Francisco, CA — March 15, 2026.",
  openGraph: {
    title: "Nebius.Build | AI + Robotics Hackathon",
    description:
      "AI + Robotics hackathon powered by Nebius. Build, demo, and win awards. March 15, San Francisco, CA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
