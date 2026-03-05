import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Partner | Nebius.Build — OpenClaw + Robotics Hackathon",
  description:
    "Partner with Nebius.Build. Join the top AI + robotics builders in San Francisco, March 15, 2026.",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
