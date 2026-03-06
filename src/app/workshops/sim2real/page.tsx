"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Monitor, Cpu, AlertTriangle } from "lucide-react";

export default function Sim2RealPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logos/nebiusbuild.png" alt="Nebius.Build" width={120} height={40} className="h-10 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#c8ff00] mb-4">Workshop</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              SIM2REAL Workflow
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Pipeline for participating in the UFB Ghost Trials. Generate robot motion from human video and deploy on a real Unitree G1 robot.
            </p>
          </div>

          {/* Overview */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p className="text-white/60 mb-4">
              This workshop covers the full pipeline from human video input to real robot deployment. The two main frameworks used are:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-white/10 p-4">
                <p className="font-semibold text-[#c8ff00] mb-1">Video2Robot</p>
                <p className="text-sm text-white/50">Video → robot skeleton motion file</p>
              </div>
              <div className="border border-white/10 p-4">
                <p className="font-semibold text-[#c8ff00] mb-1">MJLab</p>
                <p className="text-sm text-white/50">Simulate, train, and deploy on Unitree G1</p>
              </div>
            </div>
            <p className="text-white/50 text-sm mt-4">
              Output is submitted to UFB for evaluation and testing on a real Unitree G1 robot.
            </p>
          </div>

          {/* Video2Robot */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-5 h-5 text-[#c8ff00]" />
              <h2 className="text-xl font-bold">Video2Robot</h2>
            </div>
            <p className="text-white/60 mb-4">
              This framework takes a video clip as input and uses <span className="text-white font-medium">PromptHMR</span> and <span className="text-white font-medium">GMR</span> to generate a text file of robot skeleton motion for the Unitree G1 robot.
            </p>

            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3">Input Requirements</h3>
            <ul className="text-white/60 text-sm space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#c8ff00] mt-0.5 shrink-0" />
                A clear video of the full body of an adult human
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#c8ff00] mt-0.5 shrink-0" />
                All limbs must be visible throughout the clip
              </li>
            </ul>

            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3">Output</h3>
            <p className="text-white/60 text-sm mb-6">
              A text file of robot skeleton motion. Submit this file to{" "}
              <a href="https://sim.ufb.gg" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:underline inline-flex items-center gap-1">
                sim.ufb.gg <ExternalLink className="w-3 h-3" />
              </a>{" "}
              as part of the hackathon challenge. Test first to confirm it works inside the Video2Robot UI.
            </p>

            <div className="flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5 p-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-500">CUDA GPU Required</p>
                <p className="text-sm text-white/50 mt-1">
                  Video2Robot requires a computer with a CUDA GPU. Even 8GB of VRAM is probably sufficient.
                </p>
              </div>
            </div>
          </div>

          {/* MJLab */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-5 h-5 text-[#c8ff00]" />
              <h2 className="text-xl font-bold">MJLab</h2>
            </div>
            <p className="text-white/60 mb-4">
              MJLab is used to view simulated robot motion and train a model that can be deployed on the Unitree G1 Robot.
            </p>

            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3">Key Steps</h3>
            <ol className="text-white/60 text-sm space-y-3 mb-6 list-none">
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] font-bold shrink-0">1.</span>
                Convert the <code className="text-white/80 bg-white/10 px-1.5 py-0.5 text-xs">.pkl</code> file from Video2Robot into <span className="text-white font-medium">LAFAN CSV format</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] font-bold shrink-0">2.</span>
                Use the &ldquo;Motion Imitation&rdquo; commands to run the simulation
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c8ff00] font-bold shrink-0">3.</span>
                Train the policy for deployment on the real robot
              </li>
            </ol>

            <a
              href="https://github.com/mujocolab/mjlab?tab=readme-ov-file#2-motion-imitation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#c8ff00] hover:underline text-sm font-semibold mb-6"
            >
              MJLab Motion Imitation Docs <ExternalLink className="w-4 h-4" />
            </a>

            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3">GPU Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 border border-white/10 p-4">
                <span className="text-lg">💻</span>
                <div>
                  <p className="text-sm font-semibold">Viewing Simulation — No CUDA needed</p>
                  <p className="text-sm text-white/50 mt-1">
                    You can install and run MJLab on a MacBook to view simulations (e.g., the converted output of Video2Robot).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border border-yellow-500/20 bg-yellow-500/5 p-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-500">Training — CUDA GPU Required</p>
                  <p className="text-sm text-white/50 mt-1">
                    Training the model requires a CUDA GPU with at least 8GB of VRAM. Use{" "}
                    <a href="https://console.nebius.com" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:underline">
                      Nebius GPU Cloud credits
                    </a>{" "}
                    provided in this competition if you don&apos;t have a PC with a CUDA GPU.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Outline */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold mb-2">Workshop Outline</h2>
            <p className="text-white/50 text-sm mb-6">
              Goal: Run a simple sim task, train a policy briefly, then run inference.
            </p>
            <ol className="space-y-4 list-none">
              {[
                { step: "1", title: "Setup", desc: "Set up SIM environment and Nebius Cloud accounts." },
                { step: "2", title: "Run RL Frameworks", desc: "Run Video2Robot and MJLab pipelines as described above." },
                { step: "3", title: "Deploy on Nebius", desc: "Deploy trained models using Nebius Cloud infrastructure." },
                { step: "4", title: "Hackathon Submission", desc: "Submit your motion file to sim.ufb.gg for evaluation and testing on a real Unitree G1." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 border border-[#c8ff00]/30 flex items-center justify-center text-[#c8ff00] font-bold text-sm shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/50 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Quick Links */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Submit to UFB", url: "https://sim.ufb.gg" },
                { label: "MJLab GitHub", url: "https://github.com/mujocolab/mjlab" },
                { label: "Nebius Cloud Console", url: "https://console.nebius.com" },
                { label: "Nebius Token Factory", url: "https://tokenfactory.nebius.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 p-3 flex items-center justify-between hover:border-[#c8ff00]/40 transition-colors group"
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#c8ff00] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-sm text-white/30">
          <p>Nebius.Build — OpenClaw + Robotics Hackathon</p>
          <p className="mt-2">March 15, 2026 / San Francisco, CA</p>
        </div>
      </footer>
    </main>
  );
}
