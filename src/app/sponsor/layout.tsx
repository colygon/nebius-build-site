import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Sponsor | Nebius.Build — OpenClaw + Robotics Hackathon",
  description:
    "Sponsor Nebius.Build. Get your brand in front of the top AI + robotics builders in San Francisco, March 15, 2026.",
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
