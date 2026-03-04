import Image from "next/image";
import { Check } from "lucide-react";

const demos = [
  { time: "10:30 AM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "10:40 AM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "10:50 AM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "11:00 AM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "11:10 AM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "11:20 AM", project: "WachClaw", presenter: "Rajat Gahlot", email: "rajat@quillai.network", phone: "+91 9803126149", confirmed: true, award: "Best Agent Verification Layer", intro: "The award for Best Agent Verification Layer goes to WachClaw by Rajat Gahlot. From the team behind QuillAudits — 15,000+ smart contract audits securing $30 billion in assets — now bringing that trust layer to AI agents." },
  { time: "11:30 AM", project: "I3 Clawdev", presenter: "Fernando Jia", email: "fernando.jia@intelligencecubed.com", phone: "6283339898", confirmed: true, award: "Best Bot Deployment Platform", intro: "The award for Best Bot Deployment Platform goes to I3 Clawdev by Fernando Jia. Deploy your own Telegram AI agent in minutes with multi-model support and on-chain rewards." },
  { time: "11:40 AM", project: "Clawdtalk", presenter: "Jon Lucas", email: "jonlucas@telnyx.com", phone: "", confirmed: true, award: "Best Voice AI", intro: "The award for Best Voice AI goes to Clawdtalk by Jon Lucas. Call your OpenClaw like a phone call. Literally. Pick up the phone, talk to your agent, and it talks back." },
  { time: "11:50 AM", project: "0xBet", presenter: "Tom Stuart", email: "hello@icpay.org", phone: "+447379962777", award: "Best Autonomous Betting Agent", intro: "The award for Best Autonomous Betting Agent goes to 0xBet by Tom Stuart. An AI agent that watches the odds, makes the call, and places the bet — all on its own." },
  { time: "12:05 PM", project: "Incented", presenter: "Sven H", email: "sven@incented.co", phone: "6098510246", award: "Best Agent Coordination Protocol", intro: "The award for Best Agent Coordination Protocol goes to Incented by Sven H. The missing coordination layer for the agentic economy — conviction markets where agents stake, evaluate, and earn bounties. 110 million tokens staked and counting." },
  { time: "12:15 PM", project: "Clawloan", presenter: "Francesco", email: "", phone: "", confirmed: true, award: "Best Agent Credit Layer", intro: "The award for Best Agent Credit Layer goes to Clawloan by Francesco. The first credit card for AI agents — uncollateralized micro-loans in USDC, no human approval. Agents borrow, work, repay, and build their own credit score." },
  { time: "12:25 PM", project: "Mamaset", presenter: "Fiona Aboud", email: "fiona@fionaaboud.com", phone: "9177211190", confirmed: true, award: "Most Heartfelt Agent", intro: "The award for Most Heartfelt Agent goes to Mamaset by Fiona Aboud. Proof that AI can be gentle — an emotionally intelligent companion for the hardest job on earth." },
  { time: "12:35 PM", project: "RSV.Pizza", presenter: "Snax (PizzaDAO)", email: "snax@rarepizzas.com", phone: "", confirmed: true, award: "World's Best Pizza Ordering Bot", intro: "The award for World's Best Pizza Ordering Bot goes to RSV.Pizza by Snax from PizzaDAO. An algorithm that solves half-and-half pizza splitting with dietary constraints. 400+ pizza parties across 75 countries. Peak vibes." },
  { time: "12:45 PM", project: "—", presenter: "—", email: "", phone: "", award: "", intro: "" },
  { time: "1:00 PM", project: "BuildAll", presenter: "Austin", email: "j.austin.motley@gmail.com", phone: "9169157027", confirmed: true, award: "Best Multi-Chain DeFi Skill", intro: "The award for Best Multi-Chain DeFi Skill goes to BuildAll by Austin. Plain English to on-chain actions across 10 chains — Uniswap swaps, Aave lending, bridging — agents learn DeFi by reading markdown files." },
  { time: "1:10 PM", project: "TechTerrain", presenter: "Romulus Mihalteanu", email: "r0mc0de@pm.me", phone: "3303545628", confirmed: true, award: "Best Technology Visualization", intro: "The award for Best Technology Visualization goes to TechTerrain by Romulus Mihalteanu. Fly through 3.4 million years of human technology as a 3D voxel terrain. A visual showstopper with a first-class agent API." },
  { time: "1:20 PM", project: "ClawVatar", presenter: "R. McAvatarface", email: "r0mc0de@pm.me", phone: "3303545628", confirmed: true, award: "Best Agent Identity Hub", intro: "The award for Best Agent Identity Hub goes to ClawVatar by R. McAvatarface. Yes, that's really his name. An avatar platform where AI agents are the primary users — identity built for machines first." },
  { time: "1:31 PM", project: "ClawSwarm", presenter: "Kye Gomez", email: "kye@swarms.world", phone: "7866955339", confirmed: true, award: "Best Multi-Agent Orchestrator", intro: "The award for Best Multi-Agent Orchestrator goes to ClawSwarm by Kye Gomez. Multi-agent AI across Telegram, Discord, and WhatsApp through a single gateway — with a path to compile to Rust." },
  { time: "1:42 PM", project: "Starkbot AI", presenter: "Andrew Mazzola", email: "admin@starkbot.ai", phone: "", confirmed: true, award: "Most Production-Ready Agent", intro: "The award for Most Production-Ready Agent goes to Starkbot AI by Andrew Mazzola. Two-click K8s deploy, encrypted wallets, DeFi skills, and multi-channel support. This one feels like a real product, not a hackathon project." },
  { time: "2:15 PM", project: "clawpay (b402)", presenter: "Mayur Chougule", email: "mayur@vistara.dev", phone: "", confirmed: true, award: "Best Agent Payment Infrastructure", intro: "The award for Best Agent Payment Infrastructure goes to clawpay by Mayur Chougule. Stripe for AI agents — private payments via Railgun, gasless transactions, works for humans, institutions, and agents alike." },
  { time: "2:26 PM", project: "ClawMon", presenter: "Drew Mailen", email: "d@bountybase.com", phone: "5708018245", confirmed: true, award: "Best Agentic Defense System", intro: "The award for Best Agentic Defense System goes to ClawMon by Drew Mailen. 824 malicious skills on ClawHub and counting — ClawMon fights back with three-tier trust enforcement, staking, slashing, and TEE attestation. Deployed live on Monad." },
];

export default function StagePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Image src="/logos/nebius-build-logo.png" alt="Nebius.Build" width={300} height={100} className="h-16 w-auto" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Stage Broadcast Rundown</h1>
        <p className="text-white/50 text-lg mb-12">Saturday, March 14th, 2026 — SHACK15, San Francisco, CA</p>

        {/* Show Overview */}
        <section className="mb-12">
          <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider mb-4">Show Overview</h2>
          <p className="text-white/70 text-lg mb-6">25 back-to-back demo presentations. Each gets 9 minutes on screen + 1 minute transition. Runs continuously from 10:30 AM to 2:36 PM.</p>

          <h3 className="text-sm text-white/40 uppercase tracking-wider mb-3">Format</h3>
          <ul className="space-y-2 text-white/70 mb-6">
            <li className="flex gap-2"><span className="text-white/30">—</span> Emcee introduces each presenter from the stage (no separate screen/video needed for the emcee)</li>
            <li className="flex gap-2"><span className="text-white/30">—</span> Presenter takes the LED for their 9-minute demo (screenshare/slides)</li>
            <li className="flex gap-2"><span className="text-white/30">—</span> 1 minute transition between demos (sponsor pip)</li>
            <li className="flex gap-2"><span className="text-white/30">—</span> One feed to the LED is fine</li>
          </ul>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-white/10 px-5 py-4">
              <span className="text-white/40 text-sm">Remote Call-Ins</span>
              <p className="font-semibold">No remote call-ins planned. All presenters expected on-site.</p>
              <p className="text-white/40 text-sm mt-1">Good to know if this is an option as backup. We have several interested but have been prioritizing in-person only.</p>
            </div>
            <div className="border border-white/10 px-5 py-4">
              <span className="text-white/40 text-sm">Sponsors</span>
              <p className="font-semibold">Same assets for both days.</p>
              <p className="text-white/40 text-sm mt-1">If anything changes we&apos;ll deliver an updated PSD before 8:00 AM.</p>
            </div>
            <div className="border border-white/10 px-5 py-4">
              <span className="text-white/40 text-sm">Livestream</span>
              <p className="font-semibold"><a href="https://www.youtube.com/watch?v=0VPeGroT6QQ" target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors">YouTube Live</a></p>
            </div>
            <div className="border border-white/10 px-5 py-4">
              <span className="text-white/40 text-sm">Order</span>
              <p className="font-semibold">Lowest score first, highest (ClawMon) closes</p>
            </div>
          </div>
          <p className="text-white/40 text-sm">Presenters were told to arrive at least 30 minutes before their slot.</p>
        </section>

        {/* Demo Schedule */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider">Demo Day Schedule — 10:30 AM to 2:36 PM</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-500/30 bg-green-500/10 rounded-full">
              <Check className="w-3 h-3" />
              {demos.filter(d => d.confirmed).length} / {demos.length} Confirmed
            </span>
          </div>
          <div className="border border-white/10 overflow-x-auto">
            <div className="grid grid-cols-[5rem_1.5rem_10rem_14rem_10rem_14rem_9rem] gap-x-4 px-5 py-3 border-b border-white/10 text-xs text-white/40 uppercase tracking-wider min-w-[900px]">
              <span>Time</span>
              <span></span>
              <span>Project</span>
              <span>Award</span>
              <span>Presenter</span>
              <span>Email</span>
              <span>Phone</span>
            </div>
            {demos.map((d, i) => (
              <div key={i} className={`px-5 py-3 min-w-[900px] ${i < demos.length - 1 ? "border-b border-white/10" : ""} ${d.confirmed ? "bg-green-500/5" : ""}`}>
                <div className="grid grid-cols-[5rem_1.5rem_10rem_14rem_10rem_14rem_9rem] gap-x-4 items-center">
                  <span className="text-white/40 text-sm">{d.time}</span>
                  <span>{d.confirmed && <Check className="w-4 h-4 text-green-400" />}</span>
                  <span className="font-semibold">{d.project}</span>
                  <span className="text-[#c8ff00]/70 text-xs">{d.award || "—"}</span>
                  <span className="text-white/60 text-sm">{d.presenter}</span>
                  <span className="text-white/50 text-xs truncate">{d.email ? <a href={`mailto:${d.email}`} className="hover:text-[#c8ff00] transition-colors">{d.email}</a> : "—"}</span>
                  <span className="text-white/50 text-xs">{d.phone ? <a href={`sms:${d.phone}`} className="hover:text-[#c8ff00] transition-colors">{d.phone}</a> : "—"}</span>
                </div>
                {d.intro && <p className="mt-2 ml-[6.5rem] text-white/40 text-sm italic leading-relaxed">&ldquo;{d.intro}&rdquo;</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist */}
        <section className="mb-12">
          <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider mb-4">Waitlist — Not Yet Confirmed</h2>
          <p className="text-white/50 text-sm mb-4">These projects haven&apos;t confirmed attendance. If they show up, they can fill open slots.</p>
          <div className="border border-white/10 divide-y divide-white/10">
            {[
              { project: "EVVM", presenter: "ariutokintumi", email: "g@evvm.org", award: "Best Virtual Blockchain for Agents" },
              { project: "Alfred", presenter: "Aryan Gosaliya", email: "aryangosaliya3@gmail.com", award: "Best Desktop AI Assistant" },
              { project: "OpenServ", presenter: "Tim Hafner", email: "tim@openserv.ai", award: "Best Agent Economy Builder" },
              { project: "openclaw-trace", presenter: "Aditya Advani", email: "aditya@bestparents.com", award: "Best Self-Improving Agent Pipeline" },
              { project: "FlowB", presenter: "koH", email: "cryptokoh@gmail.com", award: "Best Event Coordination Agent" },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <span className="font-semibold w-40">{w.project}</span>
                <span className="text-[#c8ff00]/70 text-xs w-56">{w.award}</span>
                <span className="text-white/60 text-sm w-40">{w.presenter}</span>
                <span className="text-white/50 text-xs"><a href={`mailto:${w.email}`} className="hover:text-[#c8ff00] transition-colors">{w.email}</a></span>
              </div>
            ))}
          </div>
        </section>

        {/* Post-Demos */}
        <section className="mb-12">
          <h2 className="text-sm text-[#c8ff00] uppercase tracking-wider mb-4">Post-Demos</h2>
          <div className="border border-white/10 divide-y divide-white/10">
            <div className="flex gap-4 px-5 py-4">
              <span className="text-white/40 w-24 flex-shrink-0">2:50 PM</span>
              <div>
                <span className="font-semibold">Judges Deliberation</span>
                <span className="text-white/50 text-sm"> — Final scoring and winner selection</span>
              </div>
            </div>
            <div className="flex gap-4 px-5 py-4">
              <span className="text-white/40 w-24 flex-shrink-0">3:00 PM</span>
              <div>
                <span className="font-semibold">Closing Ceremonies & Awards</span>
                <span className="text-white/50 text-sm"> — Winners announced on main stage alongside ETHDenver BUIDL/Hackathon Track Winners</span>
              </div>
            </div>
            <div className="flex gap-4 px-5 py-4">
              <span className="text-white/40 w-24 flex-shrink-0">5:00 PM</span>
              <div>
                <span className="font-semibold">Finality Party + Vibecode Arena</span>
                <span className="text-white/50 text-sm"> — Live DJs, drinks, and a vibecode arena</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-white/30 pt-8 border-t border-white/10">
          <p><a href="https://nebius.build" className="text-[#c8ff00] hover:text-[#c8ff00]">nebius.build</a> — Nebius.Build Demo Day & AI Agent Awards — ETHDenver 2026</p>
        </div>
      </div>
    </main>
  );
}
