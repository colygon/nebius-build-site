import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIM2REAL Workshop | Nebius.Build — OpenClaw + Robotics Hackathon",
  description:
    "SIM2REAL workflow for the UFB Ghost Trials. Use Video2Robot and MJLab to generate robot motion from video and deploy on a Unitree G1.",
};

export default function Sim2RealLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
