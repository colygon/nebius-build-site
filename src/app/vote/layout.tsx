import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Vote | Nebius.Build — OpenClaw + Robotics Hackathon",
  description:
    "Vote for your favorite nominations and speakers at Nebius.Build. Help the community decide who demos on stage, March 15, 2026.",
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
