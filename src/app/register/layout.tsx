import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Interest | Nebius.Build — OpenClaw + Robotics Hackathon",
  description:
    "Register your interest in Nebius.Build as a partner, volunteer, judge, mentor, or press. San Francisco, March 15, 2026.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
