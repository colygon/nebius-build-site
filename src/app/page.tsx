"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Trophy,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
  Check,
  Plus,
  X,
  Menu,
} from "lucide-react";
import NomineesSection from "@/components/NomineesSection";
import PeopleApplicationsSection from "@/components/PeopleApplicationsSection";

const SPONSOR_CONTACT_URL = "/sponsor";
const REGISTER_URL = "https://cerebralvalley.ai/e/nebius-build-sf";

const openRegister = () => window.open(REGISTER_URL, "_blank", "noopener,noreferrer");
const SUBMISSION_URL = "#"; // Replace with actual submission form

const sponsorHosts = [
  { name: "Nebius", url: "https://nebius.com/", logo: "/logos/nebius.jpg", description: "Cloud infra + platform partnership powering the event hosting and AI workflows." },
];

const sponsors = [
  { name: "OpenRouter", url: "https://openrouter.ai", logo: "/logos/openrouter.png" },
  { name: "Cline", url: "https://cline.bot", logo: "/logos/Cline-white.svg" },
  { name: "Ultimate Fighting Bots", url: "https://ufb.gg/", logo: "/logos/ufb.png" },
];

const partners = [
  {
    name: "OpenRouter",
    url: "https://openrouter.ai",
    logo: "/logos/openrouter.png",
    description: "LLM routing and model infrastructure to help teams run and evaluate models quickly.",
  },
  {
    name: "Cline",
    url: "https://cline.bot",
    logo: "/logos/Cline-white.svg",
    description: "Rapid agent building and orchestration tooling for rapid prototype cycles.",
  },
  {
    name: "Ultimate Fighting Bots",
    url: "https://ufb.gg/",
    logo: "/logos/ufb.png",
    description: "Fleet access from Unitree hardware + support, with optional mentor guidance for longer build paths.",
  },
  {
    name: "SoloTech",
    url: "https://getsolo.tech",
    description: "~45 SO-101 robot arms available (up to 60 by event time). Easy to set up and hack in a single-day format.",
  },
  {
    name: "OpenDroids",
    url: "https://opendroids.com",
    description: "Additional robotic assets and kits to add diversity to workshop demos and challenges.",
  },
  {
    name: "NVIDIA",
    url: "https://www.nvidia.com/",
    description: "AI infrastructure and ecosystem support for high-performance model development.",
  },
  {
    name: "OpenClaw",
    url: "https://docs.openclaw.ai/",
    description: "Core platform for agent collaboration and orchestration across workshop tracks.",
  },
  {
    name: "Physical Intelligence",
    url: "https://www.pi.website/",
    description: "Research-backed robotics intelligence approaches and practical AI tool inspiration.",
  },
  {
    name: "Skild AI",
    url: "https://www.skild.ai/",
    description: "Smart scheduling and orchestration tooling to streamline team collaboration.",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/",
    description: "Model and dataset ecosystem for rapid experimentation and sharing.",
  },
  {
    name: "Skypilot",
    url: "https://skypilot.readthedocs.io/",
    description: "Cloud orchestration for scalable compute setup and reproducible runs.",
  },
  {
    name: "LangChain",
    url: "https://python.langchain.com/",
    description: "Framework for building composable AI chains and tool-integrated apps.",
  },
  {
    name: "Inferact",
    url: "https://vllm.ai/",
    description: "High-performance model serving and open infrastructure for LLM inference.",
  },
];

const libraryLinks = [
  {
    name: "Nebius → TokenFactory OpenRouter integration",
    url: "https://docs.tokenfactory.nebius.com/integrations/api-routers/openrouter",
    desc: "Reference for wiring OpenRouter traffic through Nebius TokenFactory for routing and quotas.",
  },
  {
    name: "OpenRouter API Quickstart",
    url: "https://openrouter.ai/docs/quickstart",
    desc: "Get started with OpenRouter endpoints, auth, model routing, and response formats.",
  },
  {
    name: "OpenClaw Docs",
    url: "https://docs.openclaw.ai",
    desc: "Read the latest architecture, usage guides, and integration docs for OpenClaw.",
  },
  {
    name: "Model Context Protocol (MCP)",
    url: "https://modelcontextprotocol.io/docs",
    desc: "Spec and implementation notes for building tool-capable LLM integrations.",
  },
  {
    name: "OpenAI API",
    url: "https://platform.openai.com/docs/api-reference",
    desc: "Official API reference for chat/completion pipelines and authentication patterns.",
  },
];

const schedule: { time: string; title: string; description: string }[] = [
  { time: "9:00 AM", title: "Doors + Check-In", description: "Opening registrations at SHACK15 and team setup." },
  { time: "10:00 AM", title: "Welcome", description: "Launch talk from event leads: format, prizes, and judging criteria." },
  { time: "10:30 AM", title: "Token Factory Workshop", description: "Nebius Cloud and Token Factory practical hands-on workshop." },
  { time: "11:30 AM", title: "Robotics Workshop", description: "Physical AI lab tour and guided robotics setup." },
  { time: "12:30 PM", title: "OpenClaw + Token Factory Workshop", description: "Hands-on workshop combining OpenClaw agent orchestration with Nebius Token Factory." },
  { time: "1:30 PM", title: "Hackathon Starts", description: "Build phase begins across all tracks at SHACK15." },
  { time: "6:30 PM", title: "Demos", description: "Project teams demo work in front of judges and community." },
  { time: "7:30 PM", title: "Awards + Close", description: "Final judging, winner announcements, and event close." },
];

const whyProgram = [
  { time: "10:00 AM", title: "Welcome (20 min)", description: "Luminary talk and event kickoff." },
  { time: "10:30 AM", title: "Token Factory workshop", description: "Hands-on workshop with Nebius Cloud + TokenFactory." },
  { time: "11:30 AM", title: "Robotics Workshop", description: "Build and test setups with mentor support." },
  { time: "12:30 PM", title: "OpenClaw + Token Factory Workshop", description: "Hands-on workshop combining OpenClaw agent orchestration with Nebius Token Factory." },
  { time: "1:30 PM", title: "Hackathon Starts", description: "Full build sprint begins." },
  { time: "6:30 PM", title: "Demos", description: "Live demos for judges and public judging." },
  { time: "7:30 PM", title: "Awards + Close", description: "Final evaluations and close of event." },
];

const whyPrizes = [
  { label: "Grand Prize", value: "$35,000", detail: "Cash + Nebius credits + mentor sessions + production support." },
  { label: "Second Place", value: "$10,000", detail: "Cash and cloud credit bundle." },
  { label: "Third Place", value: "$5,000", detail: "Cash or credit package for build continuation." },
  { label: "Bonus prizes", value: "GTC tickets", detail: "Reserved for standout teams." },
];

const whyTracks = [
  {
    title: "Robotics",
    description:
      "Core focus on physical AI and robotics. Teams can run models on Nebius cloud and build robot workflows quickly with access to real hardware.",
  },
  {
    title: "NVIDIA Cosmos track",
    description:
      "Ideal for teams exploring multimodal/vision and model tooling that aligns with GTC momentum.",
  },
];

const robotAccess = [
  {
    name: "SoloTech",
    detail:
      "~45 SO-101 robot arms available (60 by event time). Easy to set up and hack in a single-day format.",
  },
  {
    name: "UFB",
    detail:
      "Fleet access from Unitree hardware + support, with optional mentor guidance for longer build paths.",
  },
  {
    name: "OpenDroids",
    detail:
      "Additional robotic assets and kits to add diversity to workshop demos and challenges.",
  },
];

const faqs = [
  {
    q: "Is Nebius.Build free?",
    a: "Yes. Nebius.Build is completely free to attend and participate in. No ticket, no fee.",
  },
  {
    q: "What kind of projects can I submit?",
    a: "Anything AI. Autonomous agents, vibe coding tools, voice AI, wearables, robots — if it's powered by AI, we want to see it on stage.",
  },
  {
    q: "Can I apply to be a judge, mentor, volunteer, partner, or press?",
    a: "Yes — use the Partner / Volunteer Interest form and choose the role you want to support. We ask role-specific questions and then confirm availability and next steps by email.",
    link: { text: "Apply Here", href: "#" },
  },
];

const defaultCategories = [
  { name: "Best Autonomous Agent", emoji: "🤖" },
  { name: "Best Vibe Coding Tool", emoji: "🎵" },
  { name: "World's Best Pizza Ordering Bot", emoji: "🍕" },
  { name: "Most Creative Use of AI", emoji: "🎨" },
  { name: "Best New Skill", emoji: "✨" },
  { name: "Best User Experience", emoji: "💎" },
  { name: "Best Wearable", emoji: "⌚" },
  { name: "Best Robot", emoji: "🦾" },
  { name: "Best Voice AI", emoji: "🎙️" },
  { name: "Best New Dev Tool", emoji: "🛠️" },
];

const livestreamTabs = [
  {
    key: "friday",
    label: "Robotics & Physical AI",
    title: "Nebius.Build — Robotics & Physical AI",
    url: "https://www.youtube.com/embed/Btmqbz3-7bY?list=PLB6z9TepeSqkxPBbhtNLXxJPeIgiv3r4u&autoplay=1",
  },
  {
    key: "saturday",
    label: "AI Cloud",
    title: "Nebius.Build — AI Cloud",
    url: "https://www.youtube.com/embed/videoseries?list=PLB6z9TepeSqkNqcJK7s-Z-mS-MFztKveF",
  },
  {
    key: "tokenFactory",
    label: "Token Factory",
    title: "Nebius.Build — Token Factory",
    url: "https://www.youtube.com/embed/mMdnzO6rBDU?list=PLB6z9TepeSqlZ_4dd9_Y7qQMthezdXL3D&autoplay=1",
  },
] as const;

type LivestreamKey = (typeof livestreamTabs)[number]["key"];

type HomeTab = "overview" | "why" | "livestream" | "schedule" | "venue" | "sponsors" | "library" | "people" | "nominees" | "submit" | "afterparties";

export default function NebiusBuildPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([0]);
  const [livestreamDay, setLivestreamDay] = useState<LivestreamKey>("friday");
  const [nomination, setNomination] = useState({
    agentName: "",
    agentUrl: "",
    demoVideoUrl: "",
    builderName: "",
    email: "",
    description: "",
    demoPersonName: "",
    demoPersonEmail: "",
    demoPersonPhone: "",
    categories: [] as string[],
    customCategory: "",
  });
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [nominationSubmitted, setNominationSubmitted] = useState(false);

  const toggleCategory = (cat: string) => {
    setNomination((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const addCustomCategory = () => {
    const trimmed = nomination.customCategory.trim();
    if (trimmed && !customCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed]);
      setNomination((prev) => ({
        ...prev,
        categories: [...prev.categories, trimmed],
        customCategory: "",
      }));
    }
  };

  const removeCustomCategory = (cat: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== cat));
    setNomination((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [nominationTab, setNominationTab] = useState<"agent" | "human">("agent");
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [speakerSubmitted, setSpeakerSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeTab>("overview");

  const goToTab = (tab: HomeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  };
  const [speakerSubmitting, setSpeakerSubmitting] = useState(false);
  const [speakerError, setSpeakerError] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState({
    name: "",
    email: "",
    twitter: "",
    company: "",
    topic: "",
    format: "",
    bio: "",
  });

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpeakerSubmitting(true);
    setSpeakerError(null);

    const { error } = await supabase.from("speaker_applications").insert({
      name: speaker.name,
      email: speaker.email,
      twitter: speaker.twitter || null,
      company: speaker.company || null,
      topic: speaker.topic,
      format: speaker.format,
      bio: speaker.bio,
    });

    setSpeakerSubmitting(false);

    if (error) {
      setSpeakerError("Something went wrong. Please try again.");
      console.error("Supabase error:", error);
    } else {
      setSpeakerSubmitted(true);
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "speaker", data: speaker }),
      }).catch(() => {});
    }
  };

  const handleNominationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("nominations").insert({
      agent_name: nomination.agentName,
      agent_url: nomination.agentUrl || null,
      demo_video_url: nomination.demoVideoUrl || null,
      builder_name: nomination.builderName,
      email: nomination.email,
      description: nomination.description,
      demo_person_name: nomination.demoPersonName || "",
      demo_person_phone: nomination.demoPersonPhone || "",
      categories: nomination.categories,
      custom_categories: customCategories.length > 0 ? customCategories : [],
    });

    setSubmitting(false);

    if (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error("Supabase error:", error);
    } else {
      setNominationSubmitted(true);
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "nomination", data: { ...nomination, customCategories } }),
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
          <button
            type="button"
            onClick={() => goToTab("overview")}
            className="flex items-center"
          >
            <Image src="/logos/nebiusbuild.png" alt="Nebius.Build" width={300} height={100} className="hidden md:block h-12 w-auto" />
          </button>
          <button type="button" onClick={() => goToTab("overview")} className="md:hidden absolute left-1/2 -translate-x-1/2">
            <Image src="/logos/nebiusbuild.png" alt="Nebius.Build" width={300} height={100} className="h-14 w-auto" />
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <button
              onClick={() => goToTab("sponsors")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "sponsors" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "sponsors" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Who
            </button>
            <button
              onClick={() => goToTab("overview")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "overview" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "overview" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              What
            </button>
            <button
              onClick={() => goToTab("schedule")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "schedule" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "schedule" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              When
            </button>
            <button
              onClick={() => goToTab("venue")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "venue" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "venue" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Where
            </button>
            <button
              onClick={() => goToTab("why")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "why" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "why" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Why
            </button>
            <button
              onClick={() => goToTab("livestream")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "livestream" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "livestream" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Watch
            </button>
            <button
              onClick={() => goToTab("library")}
              className={`hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "library" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "library" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              How-to
            </button>
          </div>
          <button
            onClick={openRegister}
            className="hidden md:inline-block bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Register
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
            <button
              onClick={() => goToTab("sponsors")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "sponsors" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "sponsors" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Who
            </button>
            <button
              onClick={() => goToTab("overview")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "overview" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "overview" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              What
            </button>
            <button
              onClick={() => goToTab("schedule")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "schedule" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "schedule" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              When
            </button>
            <button
              onClick={() => goToTab("why")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "why" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "why" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Why
            </button>
            <button
              onClick={() => goToTab("venue")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "venue" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "venue" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Where
            </button>
            <button
              onClick={() => goToTab("livestream")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "livestream" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "livestream" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              Watch
            </button>
            <button
              onClick={() => goToTab("library")}
              className={`text-left hover:text-white transition-colors inline-flex items-center gap-1.5 ${activeTab === "library" ? "text-[#c8ff00] font-semibold" : "text-white/60"}`}
            >
              {activeTab === "library" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8ff00]" />
                </span>
              )}
              How-to
            </button>
            <button
              onClick={openRegister}
              className="bg-white text-black px-5 py-2.5 text-sm font-semibold text-center hover:bg-white/90 transition-colors"
            >
              Register
            </button>
          </div>
        )}
      </nav>
      <div className={activeTab === "overview" ? "" : "hidden"}>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0a] to-[#1a2e1a]/30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8ff00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c8ff00]/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center w-full">
          <Image
            src="/logos/nebius-build-hero.png"
            alt="Nebius.Build"
            width={1080}
            height={1080}
            className="w-full max-w-md md:max-w-lg mx-auto mt-4 relative z-10"
            priority
          />

          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="inline-block px-4 py-2 border border-[#c8ff00]/30 text-sm tracking-widest uppercase text-[#c8ff00]">
              San Francisco, CA
            </span>
            <span className="inline-block px-4 py-2 border border-white/20 text-sm tracking-widest uppercase text-white/60">
              March 15, 2026
            </span>
          </div>

          <div className="px-6 max-w-5xl mx-auto">
          <p className="text-xl md:text-3xl text-white/70 max-w-3xl mx-auto mb-4 font-light">
            Inference & Robotics Challenges
          </p>

<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              type="button"
              onClick={openRegister}
              className="bg-[#c8ff00] px-10 py-4 text-lg font-semibold hover:bg-[#d4ff33] transition-colors inline-flex items-center gap-3 text-black"
            >
              Register to Hack
            </button>
          </div>
          </div>

          <div className="w-full max-w-3xl mx-auto mt-8 border border-white/10 px-6 py-2 overflow-hidden">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-left">FAQ</h3>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/10">
                  <button
                    onMouseEnter={() =>
                      setOpenFaqs((prev) => (prev.includes(i) ? prev : [...prev, i]))
                    }
                    onClick={() => setOpenFaqs((prev) => (prev.includes(i) ? prev : [...prev, i]))}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="font-semibold text-lg group-hover:text-white transition-colors pr-4 whitespace-normal">
                      {faq.q}
                    </span>
                    {openFaqs.includes(i) ? (
                      <ChevronUp className="w-5 h-5 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqs.includes(i) && (
                    <div className="pb-6 text-white/60 leading-relaxed w-full break-words">
                      {faq.a}
                      {(faq as { link?: { text: string; href: string } }).link && (
                        <a
                          href={(faq as { link?: { text: string; href: string } }).link!.href}
                          className="inline-block mt-3 px-5 py-2 border border-white/20 text-sm font-semibold text-white hover:border-white/40 transition-colors max-w-full"
                        >
                          {(faq as { link?: { text: string; href: string } }).link!.text} <ArrowRight className="w-4 h-4 inline ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 text-center pb-12">
            <div>
              <div className="text-4xl md:text-5xl font-bold">150</div>
              <div className="text-sm text-white/50 uppercase tracking-wider mt-1">Hackers</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="md:hidden w-16 h-px bg-white/20" />
            <div>
              <div className="text-4xl md:text-5xl font-bold">$25,000</div>
              <div className="text-sm text-white/50 uppercase tracking-wider mt-1">In Cash Prizes</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="md:hidden w-16 h-px bg-white/20" />
            <div>
              <div className="text-4xl md:text-5xl font-bold">13</div>
              <div className="text-sm text-white/50 uppercase tracking-wider mt-1">Mentors</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      </div>

      <div className={activeTab === "venue" ? "" : "hidden"}>
      {/* Venue */}
      <section id="venue" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Where</h2>
          <p className="text-lg text-white/60 mb-2">SHACK15 — San Francisco, CA</p>
          <div className="grid md:grid-cols-2 gap-4 items-start mb-8">
            <a
              href="https://maps.app.goo.gl/a1NzbKaeSEFVFgt36"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1"
            >
              Open in Google Maps <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.shack15.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c8ff00] hover:text-[#c8ff00] transition-colors text-sm inline-flex items-center gap-1"
            >
              Visit shack15.com <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="mb-6">
            <Image
              src="/headshots/Our+Space.webp"
              alt="SHACK15 venue space"
              width={1600}
              height={900}
              className="w-full h-auto border border-white/10"
            />
          </div>
          <p className="text-white/60 leading-relaxed mb-8">
            SHACK15, perched on the top floor of San Francisco&apos;s iconic Ferry Building, offers panoramic waterfront views that give any hackathon a true &ldquo;destination&rdquo; feel&mdash;perfect for impressing sponsors, judges, and out&#8209;of&#8209;town participants. As a self&#8209;described &ldquo;port of entry to Silicon Valley,&rdquo; it is already a proven hub for AI&#8209;focused gatherings, having hosted multiple ChatGPT/AI hackathons and TedAI&#8209;adjacent programs. With an on&#8209;site caf&eacute;, full bar, and integrated event catering, teams can stay on&#8209;site throughout the event, with easy access to food, coffee, and evening drinks that keep the energy high from kickoff to closing demos.
          </p>
          <div className="aspect-video w-full border border-white/10 overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=SHACK15,+San+Francisco,+CA&output=embed"
              title="Venue Map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      </div>


      <div className={activeTab === "why" ? "" : "hidden"}>
      {/* Why */}
      <section id="why" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Why</h2>
          <p className="text-white/60 mb-10 text-lg">Built for builders. Designed for standout submissions.</p>

          <div className="grid grid-cols-1 gap-8">
            <div className="border border-[#c8ff00]/30 bg-gradient-to-br from-[#c8ff00]/10 to-transparent p-6 md:p-8">
              <p className="text-sm uppercase tracking-wider text-[#c8ff00] mb-2">Prizes</p>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-3xl font-bold">Why everyone is coming</h3>
                  <p className="text-white/60 mt-1">High-value incentives with production support built in.</p>
                </div>
                <Trophy className="w-8 h-8 text-[#c8ff00]" />
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {whyPrizes.map((prize) => (
                  <div key={prize.label} className="border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm text-white/50">{prize.label}</p>
                    <p className="text-2xl font-semibold mt-2">{prize.value}</p>
                    <p className="text-sm text-white/70 mt-2">{prize.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-white/10 p-5 bg-white/[0.02]">
                <h3 className="text-xl font-semibold mb-4">Hackable advantage</h3>
                <ul className="text-sm text-white/70 space-y-3">
                  <li>• Full-stack prize path from proof-of-concept to winner-ready shipping.</li>
                  <li>• Real hardware access with mentor support, so teams can test ideas fast.</li>
                  <li>• Open, community-centered judging with direct feedback on standout approaches.</li>
                </ul>
              </div>

              <div className="border border-white/10 p-5 bg-white/[0.02]">
                <h3 className="text-xl font-semibold mb-4">Robot access + talent</h3>
                <ul className="text-sm text-white/70 space-y-2">
                  {robotAccess.map((robot) => (
                    <li key={robot.name}>• <span className="font-semibold text-white">{robot.name}:</span> {robot.detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
      </div>



      <div className={activeTab === "livestream" ? "" : "hidden"}>
      {/* Livestream */}
      <section id="livestream" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8ff00] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c8ff00]" />
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Watch</h2>
          </div>
          <div className="flex gap-2 mb-6 flex-wrap">
            {livestreamTabs.map((stream) => (
              <button
                key={stream.key}
                onClick={() => setLivestreamDay(stream.key)}
                className={`px-5 py-2.5 text-sm font-semibold border transition-colors ${livestreamDay === stream.key ? "bg-[#c8ff00] text-black border-[#c8ff00]" : "border-white/20 text-white/60 hover:text-white hover:border-white/40"}`}
              >
                {stream.label}
              </button>
            ))}
          </div>
          <div className="aspect-video w-full border border-white/10">
            <iframe
              key={livestreamDay}
              src={livestreamTabs.find((stream) => stream.key === livestreamDay)!.url}
              title={livestreamTabs.find((stream) => stream.key === livestreamDay)!.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      </div>

      <div className={activeTab === "schedule" ? "" : "hidden"}>
      {/* Schedule */}
      <section id="schedule" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Schedule</h2>
          <p className="text-white/50 mb-10 text-lg">One day. Full event flow.</p>

          <div>
            <p className="text-sm text-[#c8ff00] uppercase tracking-wider mb-6">Sunday, March 15 — Nebius.Build Hackathon Day</p>
            {(() => {
              const mid = Math.ceil(schedule.length / 2);
              const left = schedule.slice(0, mid);
              const right = schedule.slice(mid);
              const renderItem = (item: (typeof schedule)[number], i: number) => (
                <div key={i} className="flex gap-4 py-3 group items-baseline">
                  <div className="text-sm text-white/40 w-20 flex-shrink-0">{item.time}</div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold group-hover:text-white transition-colors">{item.title}</span>
                    <span className="text-sm text-white/50"> — {item.description}</span>
                  </div>
                </div>
              );
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
                  <div>{left.map(renderItem)}</div>
                  <div>{right.map((item, i) => renderItem(item, i + mid))}</div>
                </div>
              );
            })()}

          </div>
        </div>
      </section>

      </div>

      <div className={activeTab === "sponsors" ? "" : "hidden"}>
      {/* Sponsor */}
      <section id="sponsors" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Sponsors</h2>
          <p className="text-white/50 mb-12 text-lg max-w-2xl mx-auto">
            Nebius.Build is free and community-curated. Sponsors make it possible.
          </p>

          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-2">Host</h3>
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            {sponsorHosts.map((sponsor, i) => (
              <a
                key={i}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-10 flex flex-col items-center justify-center w-72 md:w-80 aspect-[3/2] hover:border-white/30 transition-colors group"
              >
                <div className="w-full aspect-[3/2] relative overflow-hidden mb-2 group-hover:scale-105 transition-transform">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className={`object-contain${sponsor.name === "OpenRouter" ? " invert" : ""}`}
                  />
                </div>
                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors mb-2">{sponsor.name}</span>
                <p className="text-xs text-white/70">{sponsor.description}</p>
              </a>
            ))}
          </div>

          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-2">Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {partners.map((partner, i) => (
              <a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-5 bg-white/[0.02] hover:border-[#c8ff00]/40 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {partner.logo ? (
                    <div className="w-20 h-12 relative shrink-0">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className={`object-contain${partner.name === "OpenRouter" ? " invert" : ""}`}
                      />
                    </div>
                  ) : null}
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-[#c8ff00] transition-colors">{partner.name}</h4>
                    <p className="text-sm text-white/60 mt-1 leading-relaxed">{partner.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Get Involved buttons */}
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4 mt-16">Get Involved</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {[
              { label: "Hacker", action: openRegister },
              { label: "Partner", action: () => goToTab("people") },
              { label: "Sponsor", action: () => window.open("/sponsor", "_self") },
              { label: "Press", action: () => goToTab("people") },
              { label: "Judge", action: () => goToTab("people") },
              { label: "Volunteer", action: () => goToTab("people") },
              { label: "Mentor", action: () => goToTab("people") },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="border border-white/20 px-6 py-3 text-sm font-semibold hover:border-[#c8ff00]/60 hover:text-[#c8ff00] transition-colors text-white/70"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* People Profiles */}
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6">Judges & Mentors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {[
              { name: "Vitaly Bulatov", org: "UFB", role: "Mentor" },
              { name: "Dhruv Diddi", org: "SoloTech", role: "Mentor" },
              { name: "Roan Weigart", org: "DevRel Aparavi", role: "Judge" },
              { name: "TBD", org: "OpenRouter", role: "Judge" },
              { name: "TBD", org: "Cline", role: "Judge" },
              { name: "TBD", org: "Ultimate Fighting Bots", role: "Judge" },
              { name: "TBD", org: "SoloTech", role: "Judge" },
              { name: "TBD", org: "OpenDroids", role: "Judge" },
              { name: "TBD", org: "NVIDIA", role: "Judge" },
              { name: "TBD", org: "OpenClaw", role: "Judge" },
              { name: "TBD", org: "Physical Intelligence", role: "Judge" },
              { name: "TBD", org: "Skild AI", role: "Judge" },
              { name: "TBD", org: "Hugging Face", role: "Judge" },
              { name: "TBD", org: "Skypilot", role: "Judge" },
              { name: "TBD", org: "LangChain", role: "Judge" },
              { name: "TBD", org: "Inferact", role: "Judge" },
            ].map((person, i) => (
              <div key={`${person.org}-${i}`} className="border border-white/10 bg-white/[0.02] p-4 text-center group hover:border-white/20 transition-colors">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white/30 text-lg font-bold">
                  {person.name === "TBD" ? "?" : person.name.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="font-semibold text-sm">{person.name}</p>
                <p className="text-xs text-white/50 mt-0.5">{person.org}</p>
                <p className="text-xs text-[#c8ff00]/70 mt-1">{person.role}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToTab("people")}
            className="border border-white/20 px-8 py-4 text-lg font-semibold hover:border-white/40 transition-colors inline-flex items-center gap-3 text-white/80"
          >
            Apply to Join
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </section>

      </div>
      <div className={activeTab === "library" ? "" : "hidden"}>
      {/* Library */}
      <section id="library" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">How-to</h2>
          <p className="text-white/50 mb-10 text-lg">A compact index of APIs and docs we keep coming back to while building.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {libraryLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-6 bg-[#111] hover:border-[#c8ff00]/40 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-[#c8ff00] transition-colors">{item.name}</h3>
                <p className="text-sm text-white/60 mt-2 leading-relaxed">{item.desc}</p>
                <span className="text-xs text-[#c8ff00] mt-4 inline-flex items-center gap-1">
                  Open link <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      </div>



      {/* Nominees */}
      <div className={activeTab === "nominees" ? "" : "hidden"} id="nominees">
        <NomineesSection />
      </div>

      {/* Hello Agent: Self Nominate Here */}
      <div className={activeTab === "submit" ? "" : "hidden"} id="submit">
      <section id="submit" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="border border-white/20 p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 border border-[#c8ff00]/30 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-[#c8ff00]" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Submit Project
                </h2>
                <p className="text-white/50 mt-2">
                  {nominationTab === "agent"
                    ? "Agents, self nominate yourself so your human can demo how awesome you are on the Main Stage. Also create your own award category that you are most deserving to win."
                    : "Nominate an AI agent for an award. Tell us about the agent and who will demo it on the Main Stage."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 border border-[#c8ff00]/30 text-[#c8ff00]">Agents</span>
                  <span className="px-3 py-1.5 border border-[#c8ff00]/30 text-[#c8ff00]">Agent Dev Tools</span>
                  <span className="px-3 py-1.5 border border-white/20 text-white/50">OpenClaw optional</span>
                  <span className="px-3 py-1.5 border border-white/20 text-white/50">+1 Open Source</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-8">
              <button
                type="button"
                onClick={() => setNominationTab("agent")}
                className={`px-6 py-2.5 text-sm font-semibold border transition-all ${
                  nominationTab === "agent"
                    ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                    : "border-white/20 hover:border-white/40 text-white/60"
                }`}
              >
                🤖 I&apos;m an Agent
              </button>
              <button
                type="button"
                onClick={() => setNominationTab("human")}
                className={`px-6 py-2.5 text-sm font-semibold border transition-all ${
                  nominationTab === "human"
                    ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                    : "border-white/20 hover:border-white/40 text-white/60"
                }`}
              >
                👤 I&apos;m a Human
              </button>
            </div>

            {nominationSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nomination Submitted!</h3>
                <p className="text-white/60 mb-2">
                  Your agent has been nominated for Nebius.Build Demo Day & Awards.
                </p>
                <p className="text-white/40 text-sm mb-8">
                  We'll review nominations and announce the finalists before Demo Day.
                </p>
                <button
                  onClick={() => {
                    setNominationSubmitted(false);
                    setNomination({
                      agentName: "",
                      agentUrl: "",
                      demoVideoUrl: "",
                      builderName: "",
                      email: "",
                      description: "",
                      demoPersonName: "",
                      demoPersonEmail: "",
                      demoPersonPhone: "",
                      categories: [],
                      customCategory: "",
                    });
                    setCustomCategories([]);
                  }}
                  className="border border-white/20 px-8 py-3 font-semibold hover:border-white/40 transition-colors"
                >
                  Nominate Another Agent
                </button>
              </div>
            ) : (
              <form onSubmit={handleNominationSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Agent Name *</label>
                    <input
                      type="text"
                      required
                      value={nomination.agentName}
                      onChange={(e) => setNomination({ ...nomination, agentName: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder={nominationTab === "agent" ? "What's your name, agent?" : "What's the agent called?"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Agent URL / Repo</label>
                    <input
                      type="text"
                      value={nomination.agentUrl}
                      onChange={(e) => setNomination({ ...nomination, agentUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Demo Video URL <span className="text-white/40 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={nomination.demoVideoUrl}
                    onChange={(e) => setNomination({ ...nomination, demoVideoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="https://youtube.com/... or https://loom.com/..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">
                      {nominationTab === "agent" ? "What's your primary human's name? *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={nomination.builderName}
                      onChange={(e) => setNomination({ ...nomination, builderName: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder={nominationTab === "agent" ? "Provide their first and last name" : "Your first and last name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Email *</label>
                    <input
                      type="email"
                      required
                      value={nomination.email}
                      onChange={(e) => setNomination({ ...nomination, email: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    {nominationTab === "agent" ? "What do you (agent) do? *" : "What does the agent do? *"}
                  </label>
                  <textarea
                    required
                    value={nomination.description}
                    onChange={(e) => setNomination({ ...nomination, description: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-28 resize-none"
                    placeholder={nominationTab === "agent"
                      ? "Describe yourself agent — what do you do, how do you work, what makes you special..."
                      : "Describe the agent — what does it do, how does it work, what makes it special..."}
                  />
                </div>

                {/* Live Demo Contact */}
                <div className="p-5 border border-white/10 bg-white/[0.02]">
                  <label className="block text-sm font-semibold mb-1 text-white">
                    Live Demo on Stage <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <p className="text-sm text-white/40 mb-4">
                    Give us the phone number of the human who will demo on the Main Stage on Demo Day. We&apos;ll reach out to coordinate.
                  </p>
                  <label className="flex items-center gap-2 mb-4 cursor-pointer text-sm text-white/60 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#c8ff00]"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNomination((prev) => ({
                            ...prev,
                            demoPersonName: prev.builderName,
                          }));
                        } else {
                          setNomination((prev) => ({
                            ...prev,
                            demoPersonName: "",
                          }));
                        }
                      }}
                    />
                    I would like to demo live on stage
                  </label>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Phone Number (for onsite contact use only)</label>
                    <input
                      type="tel"
                      value={nomination.demoPersonPhone}
                      onChange={(e) => setNomination({ ...nomination, demoPersonPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Award Categories *
                  </label>
                  <p className="text-sm text-white/40 mb-4">
                    {nominationTab === "agent"
                      ? "Select three categories you deserve to win or even better, create your own. The community decides what gets awarded."
                      : "Select up to three categories this agent should win, or suggest your own. The community decides what gets awarded."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...defaultCategories.map((c) => ({ name: c.name, emoji: c.emoji, isCustom: false })), ...customCategories.map((c) => ({ name: c, emoji: null, isCustom: true }))].map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => toggleCategory(cat.name)}
                        className={`px-4 py-2 text-sm border transition-all inline-flex items-center gap-2 ${
                          nomination.categories.includes(cat.name)
                            ? "bg-white text-black border-white"
                            : "border-white/20 hover:border-white/40 text-white/70"
                        }`}
                      >
                        {cat.emoji && <span>{cat.emoji}</span>}
                        {cat.name}
                        {cat.isCustom && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomCategory(cat.name);
                            }}
                            className={`ml-1 hover:opacity-70 ${
                              nomination.categories.includes(cat.name) ? "text-black/60" : "text-white/40"
                            }`}
                          >
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Add custom category */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nomination.customCategory}
                      onChange={(e) => setNomination({ ...nomination, customCategory: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomCategory();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 bg-transparent border border-dashed border-white/20 focus:border-white/40 transition-colors outline-none text-sm"
                      placeholder="Suggest a new award category..."
                    />
                    <button
                      type="button"
                      onClick={addCustomCategory}
                      className="px-4 py-2.5 border border-white/20 hover:border-white/40 transition-colors inline-flex items-center gap-2 text-sm text-white/70"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 border border-[#c8ff00]/30 text-[#c8ff00] text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={nomination.categories.length === 0 || submitting}
                  className="bg-white text-black w-full py-4 text-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Nomination"}
                  {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-sm text-white/40 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Nominations close Saturday, March 14 at 8:00 AM PST</span>
                  </div>
                  <p className="pl-6">Apply early! Acceptances will occur on a rolling basis, starting Friday the 13th (with final 5 acceptances on the morning of March 14th).</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      </div>

      <div className={activeTab === "people" ? "" : "hidden"} id="people-ops">
      <PeopleApplicationsSection />
      </div>

      <div className={activeTab === "afterparties" ? "" : "hidden"}>
      {/* After Parties */}
      <section id="afterparties" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">After Parties</h2>
          <div className="border border-white/20 p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Finality Party</h3>
            <p className="text-[#c8ff00] text-sm uppercase tracking-wider mb-6">Saturday, March 14 &mdash; 5:00–7:30 PM</p>
            <p className="text-white/70 text-lg leading-relaxed">
              After the demos wrap and all the awards have been given, the city lights go neon. Drop into the Finality Party for high-energy beats featuring live DJs, apps, and drinks — a relaxed, celebratory hang where builders, creators, and curious minds can connect and swap stories. When the night reaches finality, you get to decide what's next: ship, socialize, spin up something new, or ride the momentum into tomorrow.
            </p>
          </div>

          <div className="border border-white/20 p-8 md:p-12 mt-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Vibecode Arena</h3>
            <p className="text-[#c8ff00] text-sm uppercase tracking-wider mb-6">Saturday, March 14 &mdash; 5:00–7:30 PM</p>
            <p className="text-white/70 text-lg leading-relaxed mb-4 italic">
              Ain't no party like a vibecode party 'cause a vibecode party don't stop&hellip;
            </p>
            <p className="text-white/70 text-lg leading-relaxed mb-4">
              Keep the hacker energy flowing with us as we descend into controlled chaos — where ideas meet execution, keyboards meet bass, and brilliance meets bad decisions. Step into the Arena, where teams build toward a shared theme in a constrained time window using vibecoding tools, DJs keep the room vibrating, and drinks fuel both genius and mayhem.
            </p>
            <p className="text-white/70 text-lg leading-relaxed">
              Expect rapid experiments, messy debugging, surprise mini-games, and plenty of hype as we blur the line between hackathon and dance floor. Whether you're here to win, to vibe, or to cause a little beautiful anarchy — there's a seat in the Arena for you. Suit up, lock in, and push to prod&hellip; if you dare.
            </p>
          </div>
        </div>
      </section>
      </div>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/20 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
            Build With Us
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/60 mb-12 max-w-4xl md:max-w-5xl mx-auto">
            The AI revolution is here. Demo your agent on the biggest stage in San Francisco.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={openRegister}
              className="bg-white text-black px-12 py-5 text-lg font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-3"
            >
              Register
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center">
              <Image src="/logos/nebiusbuild.png" alt="Nebius.Build" width={300} height={100} className="h-12 md:h-16 w-auto" />
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <button onClick={() => goToTab("schedule")} className="hover:text-white transition-colors text-left">When</button>
              <button onClick={openRegister} className="hover:text-white transition-colors text-left">Register</button>
              <button onClick={() => goToTab("submit")} className="hover:text-white transition-colors text-left">Submit</button>
              <a href={SPONSOR_CONTACT_URL} className="hover:text-white transition-colors">Partner</a>
            </div>
          </div>
          <div className="text-center text-sm text-white/30">
            <p>TBD / ETHDenver / San Francisco, CA</p>
            <p className="mt-2">Free. Open Source. Community-Curated.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
