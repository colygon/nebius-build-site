import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nominees | Nebius.Build — Inference & Robotics Challenges",
  description:
    "Official nominees, scores, rankings, and awards for Nebius.Build Demo Day, March 15, 2026.",
};

export default function NomineesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
