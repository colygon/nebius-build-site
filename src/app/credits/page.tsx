"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

const RAW_TEXT = `Nebius.Build at ETHDenver — Sponsor Perks + Submit Your Demo

Hackers — whether you're building at the BUIDLathon or hacking on your own project, our sponsors have perks for you.

Available to all ETHDenver hackers:

- OpenRouter credits — the largest AI gateway for developers, offering better prices, higher uptime, and zero vendor lock-in. Use code ETHDENVER-022026 at openrouter.ai. Get started: https://openrouter.ai/docs/quickstart
- Nebius Startup Program — up to $5,000 in free AI Cloud credits through the AI Explorer tier, with priority access to the latest NVIDIA GPUs, 90% GPU utilization, and dedicated human support. Apply at https://nebius.com/startup-program
- Cline credits for hackathon participants. Sign up at https://app.cline.bot/signup then claim credits at https://forms.gle/4se4P4stkkMEZjix8

Demo on stage at Nebius.Build and unlock even more:

- $1,000 in Cline credits included as part of the prize winnings via Cline.bot
- Live demo on the main stage in front of judges, sponsors, and the ETHDenver community
- Livestreamed on YouTube to a global audience

How to submit your demo:
1. Go to nebius.build
2. Fill out the demo submission form
3. Our AI judge reviews and selects the top 25 projects
4. Selected teams get their demo time and additional sponsor credits

Nebius.Build Demo Day is tomorrow (Saturday, March 14) at SHACK15 in San Francisco, CA. Completely free — no ticket, no fee.

Submit now at nebius.build`;

const sponsors = [
  { name: "OpenRouter", url: "https://openrouter.ai", logo: "/logos/openrouter.png" },
  { name: "Cline", url: "https://cline.bot", logo: "/logos/cline.png" },
  { name: "Ultimate Fighting Bots", url: "https://ufb.gg/", logo: "/logos/ufb.png" },
];

const partners = [
  { name: "ETHDenver", url: "https://ethdenver.com", logo: "/logos/ethdenver.svg" },
  { name: "Agent Community", url: "https://agentcommunity.org/", logo: "/logos/agentcommunity.jpg" },
  { name: "Nebius", url: "https://nebius.com/", logo: "/logos/nebius.jpg" },
];

export default function CreditsPage() {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logos/nebius-build-logo.png" alt="Nebius.Build" width={120} height={40} className="h-8 w-auto" />
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Sponsor Perks + Credits
            </h1>
            <p className="text-lg text-white/60 mb-6">
              Whether you&apos;re building at the BUIDLathon or hacking on your own project, our sponsors have perks for you.
            </p>
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-white/20 hover:border-white/40 transition-colors text-white/70 hover:text-white"
            >
              <FileText className="w-4 h-4" />
              {showRaw ? "Hide" : "View"} Raw Text
            </button>
          </div>

          {showRaw && (
            <div className="mb-12 border border-white/10 bg-white/5 p-6 relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(RAW_TEXT);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-4 right-4 text-xs px-3 py-1 border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{RAW_TEXT}</pre>
            </div>
          )}

          {/* All Hackers */}
          <section className="mb-16">
            <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider mb-6">Available to All ETHDenver Hackers</h2>
            <div className="space-y-6">
              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logos/openrouter.png" alt="OpenRouter" width={240} height={80} className="h-12 w-auto invert" />
                </div>
                <p className="text-white/70 mb-4">
                  The largest and most popular AI gateway for developers — better prices, higher uptime, and enterprise-grade reliability with zero vendor lock-in.
                </p>
                <div className="bg-white/5 border border-white/10 px-4 py-3 mb-4 inline-block">
                  <span className="text-white/50 text-sm">Use code </span>
                  <span className="font-mono font-bold text-white text-lg">ETHDENVER-022026</span>
                </div>
                <div className="flex gap-4">
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1">
                    openrouter.ai <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://openrouter.ai/docs/quickstart" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1">
                    Quickstart Guide <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logos/nebius.jpg" alt="Nebius" width={240} height={80} className="h-12 w-auto" />
                </div>
                <p className="text-white/70 mb-4">
                  Up to $5,000 in free AI Cloud credits through the AI Explorer tier, with priority access to the latest NVIDIA GPUs, 90% GPU utilization, and dedicated human support.
                </p>
                <a href="https://nebius.com/startup-program" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1">
                  Apply to the Startup Program <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logos/cline-dark.png" alt="Cline" width={480} height={160} className="h-24 w-auto" />
                </div>
                <p className="text-white/70 mb-4">
                  Cline credits for hackathon participants. Create a Cline account at <a href="https://app.cline.bot/signup" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors">app.cline.bot/signup</a>, then fill out the form to claim your credits.
                </p>
                <a href="https://forms.gle/4se4P4stkkMEZjix8" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1">
                  Claim Cline Credits <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </section>

          {/* Demo Day */}
          <section className="mb-16">
            <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider mb-6">Demo on Stage at Nebius.Build — Unlock Even More</h2>
            <div className="space-y-6">
              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logos/cline.png" alt="Cline" width={640} height={200} className="h-32 w-auto" />
                </div>
                <p className="text-white/70 mb-4">
                  $1,000 in Cline credits included as part of the prize winnings.
                </p>
                <a href="https://cline.bot" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1">
                  cline.bot <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-white/10 p-6">
                <p className="text-white/70">
                  Plus a <span className="text-white font-semibold">live demo on the main stage</span> in front of judges, sponsors, and the ETHDenver community — <span className="text-white font-semibold">livestreamed on YouTube</span> to a global audience.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Submit Your Demo</h2>
            <p className="text-white/50 mb-6">
              Nebius.Build Demo Day is Saturday, March 14 at SHACK15 in San Francisco, CA. Completely free — no ticket, no fee.
            </p>
            <Link
              href="/#submit"
              className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-white/90 transition-colors"
            >
              Submit on nebius.build
            </Link>
          </section>
        </div>
      </div>

      {/* Sponsors & Partners */}
      <section className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-6">Sponsors</h2>
          <div className="flex items-center justify-center gap-6 mb-16 flex-wrap">
            {sponsors.map((sponsor, i) => (
              <a
                key={i}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-8 flex flex-col items-center justify-center w-56 md:w-64 aspect-[3/2] hover:border-white/30 transition-colors group"
              >
                <div className="w-full aspect-[3/2] relative overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className={`object-contain${sponsor.name === "OpenRouter" ? " invert" : ""}`}
                  />
                </div>
                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                  {sponsor.name}
                </span>
              </a>
            ))}
          </div>

          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-6">Partners</h2>
          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            {partners.map((partner, i) => (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-6 flex flex-col items-center justify-center w-40 aspect-[3/2] hover:border-white/30 transition-colors group"
              >
                <div className="w-full aspect-[3/2] relative overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-sm text-white/30">
          <p>Nebius.Build — The 2026 OpenClaw + Robotics Hackathon</p>
          <p className="mt-2">March 14, 2026 / San Francisco, CA</p>
        </div>
      </footer>
    </main>
  );
}
