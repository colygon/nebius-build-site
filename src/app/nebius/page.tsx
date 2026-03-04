export const metadata = {
  title: "Nebius.Build / SF",
  description:
    "Nebius.Build / SF is a hands-on engineering event at SHACK15 with robotics, inference optimization, and production AI workshops.",
};

const PROGRAM = [
  { time: "9:00 AM", label: "Doors + check-in", detail: "Team setup and networking at SHACK15." },
  { time: "10:00 AM", label: "Welcome + Luminary talk", detail: "20-minute kickoff with event goals, prizes, and logistics." },
  { time: "10:30 AM", label: "Token Factory workshop", detail: "Hands-on practical token/compute workflow using Nebius Cloud." },
  { time: "11:30 AM", label: "Robotics workshop", detail: "Physical AI lab walkthrough and live robot setup." },
  { time: "12:30 PM", label: "Robotics workshop (continued)", detail: "Pair up with mentors to get coding on the bots." },
  { time: "1:30 PM", label: "Hackathon starts", detail: "Start building across all tracks with mentor support." },
  { time: "6:30 PM", label: "Demos", detail: "Teams present builds and receive feedback from judges." },
  { time: "7:30 PM", label: "Awards + close", detail: "Winners announced and final event recap." },
];

const TRACKS = [
  {
    title: "Robotics",
    summary:
      "Run physical AI workflows end-to-end: model integration, command execution, and robot behavior loops under one day of mentorship support.",
  },
  {
    title: "NVIDIA Cosmos track",
    summary:
      "Explore Cosmos-aligned multimodal and vision workflows that position teams ahead of the GTC cycle.",
  },
];

const ROBOTICS = [
  {
    label: "SoloTech",
    info: "~45 SO-101 arms currently; ~60 by event time. Best for one-day coding and practical build-up.",
  },
  {
    label: "UFB",
    info:
      "13 Unitree robots; rich hardware capability but higher day-of complexity. Negotiation target: ~$3K–$5K for support.",
  },
  {
    label: "OpenDroids",
    info:
      "Two half-human robot units already tested in prior hackathons; solid alternative for hands-on demos.",
  },
];

const PARTNERS = [
  "NVIDIA",
  "OpenClaw",
  "Physical Intelligence",
  "Skild AI",
  "Hugging Face",
  "Skypilot",
  "LangChain",
  "Inferact/VLLM",
];

const REWARDS = [
  { tier: "Grand Prize", value: "~$5K value", detail: "Cash + credits + mentor sessions + production support + demo video." },
  { tier: "Second Place", value: "~$3K value", detail: "Cash + credit package for continued iteration." },
  { tier: "Third Place", value: "~$5K value", detail: "Cash + in-kind support and community distribution push." },
  { tier: "Bonus", value: "GTC tickets", detail: "Awarded for standout proof and community impact." },
];

const ROLLOUT = [
  "Pilot in SF with Cerebral Valley",
  "Roll to London / Berlin / Paris / TLV",
  "Scale to NYC, Austin, Seattle, Boston, LA",
  "Each event as repeatable city module with post-event content engine",
];

const SWAG = [
  "Stickers (Token Factory, AI Cloud, Nebius.Build)",
  "Robot-arm-branded decals and optional hoodie/lanyard set",
  "Directional signs + workshop and demo wayfinding",
  "Roll-up table banners in venue high-traffic zones",
];

export default function NebiusSFPage() {
  return (
    <main className="min-h-screen bg-[#090b14] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">SF — March 15, 2026</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
            Nebius.Build / SF
          </h1>
          <p className="mt-4 max-w-3xl text-white/70 text-lg">
            A builder-first event for ML/AI engineers: architecture walkthroughs, inference optimization,
            and practical robotics workshops for teams shipping in one day.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm text-white/70">
            <p className="inline-flex items-center gap-2">📍 SHACK15, San Francisco</p>
            <p className="inline-flex items-center gap-2">🕙 10:00 AM – 8:00 PM</p>
            <p className="inline-flex items-center gap-2">👥 150 attendees</p>
            <p className="inline-flex items-center gap-2">🤝 Cerebral Valley + Nebius</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#program"
              className="inline-flex items-center px-5 py-3 bg-[#39ff14] hover:bg-[#2ee50b] text-black transition-colors font-semibold rounded"
            >
              View program
            </a>
            <a
              href="#tracks"
              className="inline-flex items-center px-5 py-3 border border-white/25 hover:border-white/45 transition-colors rounded"
            >
              Explore tracks
            </a>
          </div>
        </div>
      </section>

      <section id="program" className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold">Program (SF edition)</h2>
        <p className="mt-2 text-white/65">One-day workshop+build format with hands-on checkpoints.</p>
        <div className="mt-6 overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="grid divide-y divide-white/10">
            {PROGRAM.map((item) => (
              <div key={item.time + item.label} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-5">
                <p className="sm:w-36 text-sm font-semibold text-[#39ff14] shrink-0">{item.time}</p>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-white/70">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tracks" className="max-w-6xl mx-auto px-6 pb-14 grid gap-4 md:grid-cols-2">
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-3xl font-bold">Tracks</h2>
          <div className="mt-4 space-y-4">
            {TRACKS.map((t) => (
              <div key={t.title} className="rounded border border-white/10 p-4 bg-black/20">
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-sm text-white/70 mt-2">{t.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-3xl font-bold">Physical AI assets</h2>
          <p className="mt-2 text-white/65">Hardware and staffing options for day-of implementation.</p>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            {ROBOTICS.map((r) => (
              <li key={r.label}>
                <span className="font-semibold text-white">{r.label}:</span> {r.info}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/50">Recommend 2+ mentors for guided robot access.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-3xl font-bold">Potential partners</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PARTNERS.map((p) => (
            <div key={p} className="border border-white/10 p-4 bg-white/[0.02]">
              <p className="font-semibold">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-3xl font-bold">Incentives</h2>
        <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {REWARDS.map((reward) => (
            <div key={reward.tier} className="border border-white/10 p-4 bg-white/[0.02]">
              <p className="text-sm uppercase tracking-wider text-[#39ff14]">{reward.tier}</p>
              <p className="text-2xl font-semibold mt-2">{reward.value}</p>
              <p className="text-sm text-white/70 mt-2">{reward.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14 grid gap-4 md:grid-cols-2">
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-3xl font-bold">Why Nebius.Build</h2>
          <p className="mt-2 text-white/70">
            Nebius is not yet the first infra choice for many builders. This event is built for trust through
            proof, hands-on deployment, and explicit peer feedback loops.
          </p>
          <p className="mt-3 text-white/70">
            Every attendee receives clear guidance, practical outputs, and a way to keep building after the event.
          </p>
        </div>

        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-3xl font-bold">Rollout</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {ROLLOUT.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-3xl font-bold">Swag + venue</h2>
          <ul className="mt-3 space-y-2 text-white/75">
            {SWAG.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
