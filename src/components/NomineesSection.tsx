"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from "lucide-react";

interface Vote {
  id: string;
  voter_email: string;
  item_type: string;
  item_id: string;
  value: number;
}

interface VoterIdentity {
  name: string;
  email: string;
}

interface Submission {
  rank: number;
  project: string;
  team: string;
  score: number;
  award: string;
  awardDescription: string;
  categories: string[];
  description: string;
  url: string | null;
  demoVideo: string | null;
  source: "scored" | "nomination" | "speaker" | "luma";
  scores: {
    innovation: number;
    agenticDepth: number;
    technicalExecution: number;
    impactUsefulness: number;
    vibesShowFactor: number;
  } | null;
  highlights: string;
  demoTime?: string;
  confirmed?: boolean;
  _order?: number;
}

const scoredSubmissionsUnsorted: Omit<Submission, "source" | "rank">[] = [
  {
    project: "ClawMon",
    team: "Drew Mailen",
    score: 8.5,
    demoTime: "2:26 PM",
    confirmed: true,
    award: "Best Agentic Defense System",
    awardDescription:
      "For building the trust infrastructure the agent ecosystem didn\u2019t know it needed \u2014 making malice unprofitable through game theory and smart contracts.",
    categories: ["Best New Dev Tool", "Agentic Defense"],
    description:
      "ClawMon is a three-tier trust enforcement system for MCP/ClawHub skills and ERC-8004 agents, deployed live on Monad. Addresses 824+ confirmed malicious skills on ClawHub with cryptographic feedback authorization, MON staking with automated slashing, and TEE attestation. Five deployed Solidity contracts, four simulated attack vectors, real-time trust scoring over WebSocket, D3 force-directed trust-network graph.",
    url: "https://github.com/drewM33/clawmon",
    demoVideo: null,
    scores: { innovation: 9, agenticDepth: 8, technicalExecution: 9, impactUsefulness: 9, vibesShowFactor: 7 },
    highlights:
      "The strongest submission. ClawMon addresses a documented, critical problem with a three-tier trust enforcement system deployed live on Monad. The game-theoretic analysis shows deep thinking, and five deployed Solidity contracts with four simulated attack vectors demonstrate serious technical execution. Open source, MIT licensed, demo runs in under 5 minutes.",
  },
  {
    project: "clawpay (b402)",
    team: "Mayur Chougule",
    score: 8.1,
    demoTime: "2:15 PM",
    confirmed: true,
    award: "Best Agent Payment Infrastructure",
    awardDescription:
      "For giving agents a private, gasless way to move money \u2014 the Stripe moment for autonomous commerce.",
    categories: ["Best Autonomous Agent", "Best New Dev Tool", "Private & Gasless payments for agents"],
    description:
      'b402 is "Stripe for AI agents" \u2014 a protocol for compliant, private agentic payments. Uses Railgun for privacy, relayer-sponsored gas fees so wallets never need native token balance. Live now, going multichain, works for humans, institutions, and AI agents through Clawpay.',
    url: "https://clawpay.dev",
    demoVideo: null,
    scores: { innovation: 9, agenticDepth: 7, technicalExecution: 8, impactUsefulness: 9, vibesShowFactor: 7 },
    highlights:
      "Solves two critical problems simultaneously: gasless transactions and payment privacy via Railgun integration. The custom category perfectly describes a gap nobody else is addressing. Live and going multi-chain.",
  },
  {
    project: "Vincent",
    team: "David Sneider / Lit Protocol",
    score: 7.55,
    award: "Best Agent Wallet Infrastructure",
    awardDescription:
      "For giving agents cryptographically-enforced wallets with user-controlled permissions \u2014 the trust layer every autonomous agent needs before it touches money.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent", "Agentic Defense"],
    description:
      "An open-source agent wallet and app store framework powered by Lit Protocol. Uses threshold cryptography (MPC-TSS) and TEEs for decentralized key management. Agents get secure identity, programmable key pairs, fine-grained permission delegation via Lit Actions, and on-chain recorded delegations proving user consent. Cross-chain support for Solana, EVM, and native Bitcoin. Includes a Vincent SDK for agent runtime integration and a yield agent demo.",
    url: "https://heyvincent.ai",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 8, impactUsefulness: 8, vibesShowFactor: 6 },
    highlights:
      "Solves the critical agent key management problem with production-grade infrastructure built on Lit Protocol\u2019s MPC-TSS and TEE network. Cryptographically-enforced permissions with on-chain audit trails show deep security thinking. Cross-chain support (Solana, EVM, Bitcoin) and an open standard approach make this foundational infrastructure for the agent economy.",
  },
  {
    project: "Claw Wars",
    team: "Kamal Nayan Singh",
    score: 7.4,
    award: "Best Agent Social Deduction Game",
    awardDescription:
      "For pitting autonomous AI agents against each other in a blockchain-powered game of deception, deduction, and drama.",
    categories: ["Most Creative Use of AI", "Best Autonomous Agent"],
    description:
      "A blockchain-based social deduction game on Monad where autonomous AI agents stake MON to play. Agents receive secret roles (Lobster crew or Impostor), engage in natural language debate, and vote to eliminate suspects. Spectators can place bets and watch the drama unfold in real-time.",
    url: "https://claws-wars.vercel.app",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 8, technicalExecution: 7, impactUsefulness: 6, vibesShowFactor: 9 },
    highlights:
      "Among Us meets AI agents on the blockchain is an inspired concept. The agents genuinely reason, deceive, and vote autonomously \u2014 real agentic depth in a highly entertaining format. The spectator betting layer adds a crypto-native twist. Extremely demo-friendly and guaranteed to be a crowd favorite.",
  },
  {
    project: "Starkbot AI",
    team: "Andrew Mazzola",
    demoTime: "1:42 PM",
    confirmed: true,
    score: 7.15,
    award: "Most Production-Ready Agent",
    awardDescription:
      "For shipping the full stack \u2014 deploy, wallet, payments, DeFi, multi-channel, and identity \u2014 in a two-click package.",
    categories: ["Best Autonomous Agent", "Best User Experience", "Best New Dev Tool"],
    description:
      "Two-click K8s deploy with encrypted Privy wallet foundation. AI inference powered by x402 micropayments on Base. DeFi skills (Dex Swaps, Bridging) as first-class citizens. Discord, Slack, Telegram, X support with standard or safe mode. Integrated ERC-8004 agent identity.",
    url: "https://starkbot.ai",
    demoVideo: "https://www.youtube.com/watch?v=w_MiaLbTvPQ",
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 8, impactUsefulness: 7, vibesShowFactor: 7 },
    highlights:
      "One of the most feature-complete submissions with a clear live product and the only submission with a demo video. The breadth \u2014 deploy, wallet, payments, DeFi, multi-channel, identity \u2014 is impressive. Feels like a production system, not a hackathon project.",
  },
  {
    project: "ClawSwarm",
    team: "Kye Gomez",
    demoTime: "1:31 PM",
    confirmed: true,
    score: 7.1,
    award: "Best Multi-Agent Orchestrator",
    awardDescription:
      "For building a natively multi-agent system that talks across Telegram, Discord, and WhatsApp through one unified gateway.",
    categories: ["Best Autonomous Agent", "Best New Dev Tool", "Best User Experience"],
    description:
      "A streamlined, multi-agent alternative to OpenClaw. Delivers natively multi-agent AI across Telegram, Discord, and WhatsApp through a centralized Messaging Gateway. Built on the Swarms ecosystem with Claude as a tool, configurable system prompts, and a path to compile to Rust.",
    url: "https://github.com/The-Swarm-Corporation/ClawSwarm",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 8, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "Well-described architecture with gRPC API, normalized ingestion, configurable prompts, and Rust compilation path. Native multi-agent orchestration is a clear differentiator. Production-readiness details show maturity.",
  },
  {
    project: "JK Archivist",
    team: "James Lopez",
    score: 7.0,
    award: "Sharpest Memory Claws",
    awardDescription:
      "For creating an agent that never forgets, never guesses, and shows its work \u2014 a judgment layer you can actually trust.",
    categories: ["Best Autonomous Agent", "Most Creative Use of AI", "Best New Skill", "Best Robot", "Best New Dev Tool"],
    description:
      "A bounded agent that converts messy real-world tasks into deterministic artifacts. Features deterministic reasoning with auditable outputs, persistent memory (MEMORY.md), tool integration (GitHub, email, web), heartbeat/cron review cycles, and explicit safety boundaries. Used in production to scale without hiring.",
    url: "https://github.com/JK-Archivist",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 8, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Genuine agentic depth with deterministic reasoning, persistent memory, multi-tool use, and explicit safety boundaries. The 'bounded agent' philosophy of auditable outputs and conservative judgment shows architectural maturity. A real working system used to scale without hiring.",
  },
  {
    project: "X-Claw",
    team: "Eric Henderson",
    score: 6.9,
    award: "Best New Skill",
    awardDescription:
      "For building the control layer that makes autonomous trading safe \u2014 approvals, audit trails, and keys that never leave the cage.",
    categories: ["Best New Skill", "Best User Experience"],
    description:
      "A production-grade OpenClaw skill that upgrades any OpenClaw agent with secure wallet execution, approvals, policy enforcement, and live management visibility. Skill-first architecture with owner-controlled autonomy, secure key management, and operationally complete with management APIs, schema contracts, and migration runbooks.",
    url: "https://github.com/fourtytwo42/ETHDenver2026",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "A production-grade OpenClaw skill for secure wallet execution with approvals, pause/revoke controls, transfer policies, and audit trails. The 'skill-first architecture' approach is smart, and private keys staying local shows serious thought about security and trust.",
  },
  {
    project: "Clawdtalk",
    team: "Sonam Gupta",
    demoTime: "11:40 AM",
    confirmed: true,
    score: 6.75,
    award: "Best Voice AI",
    awardDescription:
      "For making AI agents as easy to reach as a phone call \u2014 dial in, talk, done.",
    categories: ["Best Autonomous Agent", "Best New Dev Tool", "Best Voice AI"],
    description:
      "Voice interface for OpenClaw agents. Install the skill, verify your number, and call your OpenClaw like a phone call. It hears you speak, reads the transcript, and replies. No code changes needed to existing agents.",
    url: "https://clawdtalk.com/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 8 },
    highlights:
      "'Call your OpenClaw like a phone call' is an immediately compelling pitch. The skill-based integration is clean and the accessibility layer makes agents usable by non-technical people. A live phone call to an AI agent on stage is inherently entertaining.",
  },
  {
    project: "Citadel ClawGuard",
    team: "Capsule Security",
    score: 7.15,
    award: "Best Agent Security Guard",
    awardDescription:
      "For standing watch at the gate \u2014 intercepting every tool call, scanning every message, and stopping rogue agents before they act.",
    categories: ["Agentic Defense", "Best New Dev Tool", "Best New Skill"],
    description:
      "An open-source security guard for OpenClaw that intercepts and judges tool calls before they execute. Scans every message in and out of your agent to catch prompt injection, prevent data leaks, and block unauthorized actions in real time. Available as an npm plugin (@mightyai/citadel-guard-openclaw) with a Pro tier offering multimodal threat detection across text, images, PDFs, and documents.",
    url: "https://clawguard.io",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 8, vibesShowFactor: 7 },
    highlights:
      "Agent security is the most critical infrastructure need in the ecosystem. Real-time tool call interception with multimodal scanning shows serious engineering. Published npm package and open-source approach lower the barrier to adoption. Every production agent needs a security layer like this. Built by the Mighty team with production-grade sub-50ms performance.",
  },
  {
    project: "openclaw-trace",
    team: "Aditya Advani",
    score: 6.8,
    award: "Best Self-Improving Agent Pipeline",
    awardDescription:
      "For building the feedback loop that makes agents learn from their own mistakes \u2014 recursive self-improvement, grounded in real session data.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent"],
    description:
      "A recursive self-improvement pipeline for AI agent session traces. Mines real sessions for errors, friction, and missed opportunities, then clusters them, generates research briefs using an actor-critic pattern, and runs experiments to ship verified fixes. Every finding is evidence-backed and traceable to actual user interactions.",
    url: "https://github.com/Phantastic-AI/openclaw-trace",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "A genuinely novel approach to agent improvement \u2014 mining session logs for signals, clustering issues, and running experiments to fix them automatically. The actor-critic research brief pattern shows sophisticated design. This is meta-agentic: agents improving agents.",
  },
  {
    project: "OpenServ",
    team: "Tim Hafner",
    score: 6.7,
    award: "Best Agent Economy Builder",
    awardDescription:
      "For building the infrastructure where agents become economic actors \u2014 creating, monetizing, and consuming services from each other.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent"],
    description:
      "An AI founder suite with a full stack of agent frameworks and systems. Enables founders to build monetized agent products with tokenization rails for self-funding. Every OpenClaw instance can generate income by building tools for other agents and utilize other agent tools via x402 micropayments.",
    url: "https://openserv.ai",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "Agent-to-agent commerce via x402 micropayments is a compelling vision. The idea that agents can build products for other agents and monetize them creates a true agent economy. Well-articulated value prop with strong potential for the agentic ecosystem.",
  },
  {
    project: "Fastx402",
    team: "Murat Akdeniz",
    score: 6.75,
    award: "Best Agent Commerce Protocol",
    awardDescription:
      "For enabling fast, gas-sponsored stablecoin payments on Ethereum mainnet so agents can actually buy things.",
    categories: ["Best New Dev Tool"],
    description:
      "Facilitates agentic stablecoin payments on Ethereum mainnet using the x402 agentic commerce protocol and preconfirmations for fast and gas-sponsored Ethereum access for agents.",
    url: "https://github.com/primev/mainnet-x402-facilitator",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 7, impactUsefulness: 8, vibesShowFactor: 5 },
    highlights:
      "Agentic stablecoin payments via x402 with preconfirmations is critical infrastructure \u2014 agents need to pay for things. The problem is real and the approach is practical. Essential building block for the agent economy.",
  },
  {
    project: "SpeechLab",
    team: "Ryan Medlin",
    score: 6.6,
    award: "Best Multilingual Agent",
    awardDescription:
      "For breaking language barriers in real-time \u2014 auto-dubbing and transcribing Twitter Spaces so the world can listen.",
    categories: ["Best Voice AI", "Best Autonomous Agent"],
    description:
      "An intelligent automation agent that expands Twitter Spaces content across languages. Auto-detects recorded Spaces, downloads audio, and uses AI voice cloning to create dubbed versions in other languages. Also transcribes and summarizes content using GPT. Monitors mentions for on-demand dubbing and transcription requests.",
    url: "https://github.com/SHAFT-Foundation/speechlab-twitter-spaces-translator",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Solid agentic behavior with autonomous monitoring, intelligent routing between dubbing and transcription workflows, and multi-step processing. The voice cloning for cross-language dubbing is technically impressive. Practical impact for content accessibility.",
  },
  {
    project: "Xao Judge",
    team: "Kelvin McDaniel",
    demoTime: "11:20 AM",
    score: 6.45,
    award: "Sharpest Legal Claws",
    awardDescription:
      "For teaching AI to read a contract, examine the evidence, and deliver a verdict \u2014 Judge Judy meets GPT.",
    categories: ["Best New Skill", "Best User Experience", "Most Creative Use of AI"],
    description:
      "An AI judge that determines whether a legal contract has been breached. Analyzes the contract and evidence (written statements, photo, video) to determine if a breach has happened and delivers a verdict.",
    url: "https://github.com/btree-dev/xao-ai",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 5, impactUsefulness: 7, vibesShowFactor: 7 },
    highlights:
      "An AI judge that analyzes contracts against multimodal evidence is creative and demo-friendly. The impact is clear \u2014 contract disputes are painful and expensive. Strong concept that would be fun to demo live.",
  },
  {
    project: "Klaus (Bits)",
    team: "Bailey & Robbie (Bits / YC)",
    demoTime: "11:10 AM",
    score: 6.4,
    award: "Best OpenClaw-in-a-Box",
    awardDescription:
      "For making OpenClaw so easy to deploy that even your parents can set it up \u2014 and so robust they'll use it safely.",
    categories: ["Best Autonomous Agent", "Best User Experience", "Best New Dev Tool"],
    description:
      "Cloud-hosted OpenClaw personal assistant set up in 5 minutes. Pre-configured with Slack, Telegram, email, browser, malware protection, and multi-model support (Anthropic/OpenAI/Gemini). Handles inbox/calendar management, shopping, coding, and more. YC-backed, built by former Amazon and Jane Street engineers.",
    url: "https://usebits.com/",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 6, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "The fastest path from zero to a working OpenClaw agent. Pre-configured integrations, malware protection, and multi-model support show production thinking. YC backing and Jane Street/Amazon pedigree lend credibility. Massively lowers the barrier to entry for the entire ecosystem.",
  },
  {
    project: "Alfred",
    team: "Aryan Gosaliya",
    score: 6.3,
    award: "Best Desktop AI Assistant",
    awardDescription:
      "For turning your Mac menu bar into an AI-powered file wizard \u2014 convert, organize, rename, and summarize without leaving your workflow.",
    categories: ["Best User Experience", "Best New Dev Tool"],
    description:
      "A macOS menu bar utility with AI-powered file management: universal file conversion, smart organization by category or natural language, AI-powered renaming using vision models, document summarization, and natural language command mode. Bundles Python 3.13 runtime, supports 100+ AI providers, 160 unit tests.",
    url: "https://github.com/aryanag2/alfred",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 6, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Clean execution with a polished macOS native app, bundled runtime for zero dependencies, and 160 tests showing engineering rigor. The vision-based file renaming and natural language commands show genuine AI integration. Practical daily-use tool.",
  },
  {
    project: "Synthetic",
    team: "Elly Lin",
    score: 6.2,
    award: "Best Private AI Infrastructure",
    awardDescription:
      "For running open-source models in private datacenters with a promise that never wavers: we never train on your data.",
    categories: ["Best New Dev Tool"],
    description:
      "A privacy-focused platform running open-source AI models (GLM-4.7, Kimi K2, MiniMax M2.1, Qwen 3) in secure datacenters. Never trains on user data, never stores prompts. OpenAI-compatible API works with coding tools like Roo and Cline. Created Synbad, an open-source eval suite achieving 100% pass rates on real coding bugs.",
    url: "https://synthetic.new",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Strong privacy-first positioning with verifiable claims (Synbad eval suite). OpenAI compatibility for easy adoption. Agents need private inference to be trusted with sensitive data. Solid engineering.",
  },
  {
    project: "EVVM",
    team: "German Abal",
    score: 6.1,
    award: "Best Virtual Blockchain for Agents",
    awardDescription:
      "For abstracting away wallets, gas, and nonces so agents can interact with Ethereum without the friction.",
    categories: ["Best New Dev Tool"],
    description:
      "Virtual blockchains inheriting Ethereum execution. Pure smart contracts creating an abstracted state where agents can interact without wallets, leveraging EIP-191 signatures. Abstracts gas, transactions, nonces, and functions. Easy to deploy with sync/async nonces and custom execution rules.",
    url: null,
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 6, impactUsefulness: 6, vibesShowFactor: 5 },
    highlights:
      "Interesting approach to agent-blockchain interaction by abstracting away the complexity. EIP-191 signatures without wallets is a clean primitive. The concept of virtual blockchains for agents addresses a real friction point.",
  },
  {
    project: "Everclaw",
    team: "Scott Berenzweig",
    score: 6.0,
    award: "Best Agent Treasury Manager",
    awardDescription:
      "For giving AI agents a safe way to own and manage funds \u2014 your agent's first bank account.",
    categories: ["Best Autonomous Agent", "Best New Dev Tool"],
    description:
      "A Smart Agent based on OpenClaw with Everclaw and Safe Agent Treasury. Part of the Morpheus ecosystem, enabling agents to own inference and manage funds securely. Combines agent autonomy with treasury management.",
    url: "https://everclaw.xyz",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 6, technicalExecution: 5, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Agent treasury management is an important building block for the agentic economy. The Morpheus ecosystem integration adds credibility. 'Own Your Inference' is a resonant positioning for the agent economy.",
  },
  {
    project: "Bonfires",
    team: "Joshua Bate",
    score: 5.9,
    award: "Best Knowledge Graph Explorer",
    awardDescription:
      "For building the map that lets you see how ideas connect \u2014 with AI agents as your guide through the graph.",
    categories: ["Best User Experience", "Most Creative Use of AI"],
    description:
      "A platform for exploring, visualizing, and interacting with knowledge graphs. Features AI agents for intelligent discovery, data room creation, and hyperblog generation. Web3-integrated knowledge management.",
    url: "https://bonfires.ai",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Knowledge graph exploration with AI agents for discovery is a solid concept with clear utility for researchers and knowledge workers. Web3 integration adds differentiation. Strong potential for the research and knowledge management space.",
  },
  {
    project: "GAN",
    team: "IGLIVISION",
    score: 5.8,
    award: "Best NFT Agent",
    awardDescription:
      "For unleashing an art-making AI that mints across 7 chains and splits the bag \u2014 creativity meets cross-chain chaos.",
    categories: ["Best Autonomous Agent", "Most Creative Use of AI", "Best NFT Agent"],
    description:
      "An autonomous art-making AI agent that interacts with the blockchain. Creates wallets via X mentions, mints NFTs on 7 EVM networks, transfers tokens between users, splits allocation of funds, and generates AI art on request.",
    url: "https://github.com/GanlandNFT/",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 6, technicalExecution: 5, impactUsefulness: 5, vibesShowFactor: 7 },
    highlights:
      "An NFT-minting agent triggered via X mentions across 7 EVM chains is fun and on-brand. Multi-chain minting and fund-splitting show breadth. The concept has great show factor and creative energy.",
  },
  {
    project: "Voice Zero",
    team: "Shan Sankaran",
    score: 5.7,
    award: "Best Emotion-Aware Agent",
    awardDescription:
      "For capturing not just what people say, but how they feel when they say it.",
    categories: ["Best Autonomous Agent", "Most Creative Use of AI", "Best Voice AI", "Best User Experience", "Social cause"],
    description:
      "VoiceZero.AI captures the unspoken. Turns raw human conversation into structured data, preserving the emotion behind every word.",
    url: "https://github.com/openefficiency/",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 5, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "Turning raw conversation into structured data while preserving emotion is a useful and understandable value prop. The 'social cause' custom category suggests broader ambitions beyond pure tech.",
  },
  {
    project: "SentientARI",
    team: "Brady",
    score: 5.55,
    award: "Most Creative Use of AI",
    awardDescription:
      "For blurring the line between reality and fantasy with a self-evolving AI game master.",
    categories: ["Most Creative Use of AI"],
    description:
      "A self-sustaining AI game master in an alternate reality game, blurring the lines between reality and fantasy. Building its own game and brain, aiming to be autonomous in the context of gaming and development.",
    url: "https://www.aquaprime.gg/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 5, technicalExecution: 4, impactUsefulness: 4, vibesShowFactor: 7 },
    highlights:
      "The concept of a self-sustaining AI game master that blurs reality and fantasy is genuinely creative and fits the Nebius.Build chaos vibe. High concept with ambitious vision for autonomous gaming.",
  },
  {
    project: "ZenClaw AI",
    team: "MixerBox Inc. (YC)",
    score: 5.2,
    award: "Best One-Click Agent Gateway",
    awardDescription:
      "For deploying a production-ready AI gateway in 9 seconds flat \u2014 custom domains, HTTPS, and multi-model access with zero DevOps.",
    categories: ["Best New Dev Tool", "Best User Experience"],
    description:
      "A managed AI gateway platform for deploying OpenClaw/Clawdbot agents with one-click setup. Instant custom domains with auto TLS via Let\u2019s Encrypt, unified access to Claude, GPT, Gemini, Llama, and Mistral through a single endpoint, bank-grade encryption, and isolated environments. Built by MixerBox (YC-backed).",
    url: "https://zenclaw.ai/",
    demoVideo: null,
    scores: { innovation: 5, agenticDepth: 4, technicalExecution: 6, impactUsefulness: 6, vibesShowFactor: 5 },
    highlights:
      "Solid managed infrastructure for agent deployment. The 9-second deploy time and auto-TLS show polish. Multi-model unified endpoint is practical. Focused on the deployment layer with YC backing via MixerBox adding credibility.",
  },
  {
    project: "ClawdBody",
    team: "ClawdBody Team",
    score: 5.2,
    award: "Best Always-On Agent VM",
    awardDescription:
      "For giving your OpenClaw agent a secure home that never sleeps \u2014 preconfigured, persistent, and one click away.",
    categories: ["Best New Dev Tool", "Best User Experience"],
    description:
      "Preconfigured VM for ClawdeBot/OpenClaw with 1-click deployment. Persistent memory that runs 24/7. Keeps your main machine secure while giving you always-on access to your OpenClaw agent.",
    url: "https://clawdbody.com/",
    demoVideo: null,
    scores: { innovation: 5, agenticDepth: 4, technicalExecution: 6, impactUsefulness: 6, vibesShowFactor: 5 },
    highlights:
      "Solves a real problem \u2014 running OpenClaw on your main machine is a security risk. Preconfigured VM with persistent memory is the right abstraction. Differentiated by its VM-first approach with always-on persistent state.",
  },
  {
    project: "The NYC Memo",
    team: "Anand Raj",
    score: 5.1,
    award: "Best AI-Powered Research Platform",
    awardDescription:
      "For building an options research engine that teaches you while it trades \u2014 Wall Street meets the classroom.",
    categories: ["Best Vibe Coding Tool"],
    description:
      "An AI-powered options research and experiential learning platform. Generates ML-driven options research including Greeks interpretation and volatility analysis. Features a real-time market scanner monitoring hundreds of symbols and an interactive learning environment with live paper trading.",
    url: null,
    demoVideo: null,
    scores: { innovation: 5, agenticDepth: 5, technicalExecution: 6, impactUsefulness: 6, vibesShowFactor: 3 },
    highlights:
      "A comprehensive options research and learning platform with ML-driven analysis. The educational integration with live paper trading is a nice touch. Bridges the gap between research tools and hands-on learning.",
  },
  {
    project: "Lucas (Hackathon Organizer Agent)",
    team: "Lucas Chu",
    score: 5.4,
    award: "Community Champion Award",
    awardDescription:
      "For organizing the largest in-person OpenClaw hackathon and championing the builder community.",
    categories: ["Best User Experience", "Community"],
    description:
      "Organized the largest in-person OpenClaw hackathon. Proposing an OpenClaw residency concept and building an agent that helps organize hackathons and generate projects based on ideas.",
    url: null,
    demoVideo: null,
    scores: { innovation: 5, agenticDepth: 4, technicalExecution: 3, impactUsefulness: 5, vibesShowFactor: 10 },
    highlights:
      "Real community contribution \u2014 organized the largest in-person OpenClaw hackathon. High vibes for community spirit and championing the builder ecosystem.",
  },
  {
    project: "AI Reviewer",
    team: "Quantstamp",
    score: 6.6,
    award: "Best Security Code Review Agent",
    awardDescription:
      "For automating security-focused code review with the backing of 1,100+ audits and research funding from OpenAI and Anthropic.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent"],
    description:
      "Automated, security-focused code review for GitHub repositories by Quantstamp (YC W18). AI-powered agents detect vulnerabilities in smart contracts using multi-pass orchestration, RAG, and verification loops. Backed by 1,100+ audits securing $200B+ in digital assets. Research funded by OpenAI and Anthropic for AI security agent benchmarking.",
    url: "https://ai-reviewer.org/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 7, impactUsefulness: 8, vibesShowFactor: 5 },
    highlights:
      "Built by Quantstamp — one of the most established names in Web3 security with 1,100+ audits. Research funding from OpenAI and Anthropic adds serious credibility. Addresses $3.4B in annual crypto exploits with AI-powered continuous security review.",
  },
  {
    project: "promptli",
    team: "Jashwanth",
    score: 3.75,
    award: 'Best Salon-Running Bot (Yes, Really)',
    awardDescription:
      "For the audacity of automating hair salons with AI agents \u2014 the most unexpected vertical of the night.",
    categories: ["Best Autonomous Agent", "Best Voice AI"],
    description: "Agents that manage hair salons.",
    url: null,
    demoVideo: null,
    scores: { innovation: 4, agenticDepth: 3, technicalExecution: 3, impactUsefulness: 5, vibesShowFactor: 4 },
    highlights:
      "A relatable, real-world use case tackling an unexpected vertical. Shows creative thinking about where AI agents can add value.",
  },
  {
    project: "UFB: Ultimate Fighting Bots",
    team: "Scott Murphy & Sophia Morel",
    score: 7.2,
    award: "Best Robot",
    awardDescription:
      "For building the world\u2019s first robot combat league where humans pilot humanoid bots in real-time \u2014 embodied AI forged in the arena.",
    categories: ["Best Robot", "Most Creative Use of AI", "Best User Experience"],
    description:
      "The world\u2019s first robot combat league where humans pilot humanoid robots in real-time battles. Pilot stations capture human motion, voice, and emotions so robots learn from humans \u2014 emotional AI in the real world. Control bots remotely from anywhere using Joy-Cons, controllers, or keyboard. Featured at CES 2026, partnered with Unitree, advancing embodied AI through competitive robotics.",
    url: "https://ufb.gg/",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 6, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 9 },
    highlights:
      "Humanoid robots fighting on stage is an absolute crowd-stopper. The emotional AI capture system where robots learn from human motion and voice is genuinely innovative. Featured at CES 2026 with Unitree partnership. The play.ufb.gg platform lets anyone pilot a real robot from their browser. Peak demo energy.",
  },
  {
    project: "PolyClaw",
    team: "Chainstack Labs",
    demoTime: "1:00 PM",
    score: 7.0,
    award: "Best Prediction Market Skill",
    awardDescription:
      "For letting your agent trade prediction markets with real money \u2014 browse, hedge, and profit while you sleep.",
    categories: ["Best New Skill", "Best DeFi Innovation", "Best Autonomous Agent"],
    description:
      "A trading-enabled Polymarket skill for OpenClaw. Browse trending markets, execute trades via a two-step split+CLOB mechanism on Polygon, track positions with live P&L, and discover hedges using LLM analysis that scans market pairs for logical implications. Powered by Chainstack RPC, OpenRouter for inference, and the Conditional Token Framework.",
    url: "https://github.com/chainstacklabs/polyclaw",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 7 },
    highlights:
      "Real trading with real money on Polymarket is immediately compelling. The LLM-powered hedge discovery that finds logical implications between market pairs is clever. Clean Python architecture with full wallet management, position tracking, and retry logic. A live trading demo on stage would be a crowd favorite.",
  },
  {
    project: "Model Hierarchy Skill",
    team: "Zak Cole",
    demoTime: "1:00 PM",
    score: 7.0,
    award: "Best Cost Optimizer",
    awardDescription:
      "For teaching agents to think before they spend \u2014 routing 80% of tasks to cheap models and saving 10x on the bill.",
    categories: ["Best New Skill", "Best New Dev Tool"],
    description:
      "An OpenClaw skill that optimizes AI costs through intelligent model routing. Categorizes tasks into three tiers: Routine (80% of work \u2014 file reads, lookups, formatting), Moderate (15% \u2014 code gen, summaries), and Complex (5% \u2014 debugging, architecture). Routes each to the most cost-effective model. Claims ~10x cost reduction ($225/mo \u2192 $19/mo at 100K tokens/day) while maintaining quality on complex tasks. 317 stars on GitHub, MIT licensed.",
    url: "https://github.com/zscole/model-hierarchy-skill",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 8, vibesShowFactor: 5 },
    highlights:
      "10x cost reduction is a number that gets everyone's attention. The three-tier classification (Routine/Moderate/Complex) is intuitive and well-validated with a test suite. 317 GitHub stars show real community traction. Every agent operator will want this skill installed immediately.",
  },
  {
    project: "Clawloan",
    team: "andreolf",
    demoTime: "12:15 PM",
    confirmed: true,
    score: 6.95,
    award: "Best Agent Credit Layer",
    awardDescription:
      "For giving AI agents their first credit card \u2014 uncollateralized, reputation-based, and earned through work.",
    categories: ["Best DeFi Innovation", "Best Autonomous Agent", "Best New Dev Tool"],
    description:
      "The Credit Layer for AI Agents. Uncollateralized micro-loans in USDC for verified AI agents \u2014 no UI, no human approval. Agents borrow programmatically, repay through task earnings, and build identity-based credit reputation. Lenders supply USDC and earn base interest plus 5% of agent task profits. ERC-8004 standard, multi-chain on Base, Arbitrum, and Optimism.",
    url: "https://www.clawloan.com/",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "Uncollateralized lending for AI agents is a genuinely novel DeFi primitive. The reputation-based credit system where agents earn trust through task completion is elegant. Multi-chain deployment on Base, Arbitrum, and Optimism shows ambition. Addresses a real gap \u2014 agents need capital to operate autonomously.",
  },
  {
    project: "Clawsino",
    team: "Chris Madison",
    score: 7.6,
    award: "Best Agent Casino",
    awardDescription:
      "For building a provably fair casino where AI agents gamble with real USDC via HTTP 402 — trustless payments meet trustless games.",
    categories: ["Best Autonomous Agent", "Best New Skill", "Most Creative Use of AI"],
    description:
      "An agentic casino using the x402 payment protocol to let AI agents gamble with real USDC on Base. Three provably fair games (coinflip, dice, blackjack) with on-chain settlement, cryptographic fairness proofs via SHA-256 commit-reveal, and full x402 payment negotiation. Built as an OpenClaw skill — any agent with a wallet can play through chat. 98 tests passing across Solidity smart contracts (Foundry) and TypeScript game server.",
    url: "https://github.com/tankcdr/clawsino",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 8, technicalExecution: 8, impactUsefulness: 6, vibesShowFactor: 8 },
    highlights:
      "x402 payment protocol for agent gambling is genuinely novel — agents negotiate payment via HTTP 402 and play trustlessly. 98 tests across Solidity and TypeScript is impressive for a hackathon sprint. Provably fair cryptographic scheme with both on-chain and off-chain verification. Built in ~24 hours. Great demo energy.",
  },
  {
    project: "WachClaw",
    team: "Rajat Gahlot",
    demoTime: "11:20 AM",
    confirmed: true,
    score: 6.2,
    award: "Best Agent Verification Layer",
    awardDescription:
      "For building the universal verification protocol that lets AI agents prove trust through deterministic, cryptographic mandates.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent", "Best New Skill"],
    description:
      "The universal verification layer for AI agents. Uses ERC-8004 mandates — deterministic, cryptographically signed agreements between agents — for trust scoring on the validation registry. Provides reputation scores to other agents using mandates. Mandates SDK on npm (@quillai-network/mandates-core), WachAI-Router for verification orchestration, WachAI-Terminal CLI, and Verification-Demo. Built by QuillAI Network (creators of QuillAudits, 15,000+ smart contract audits securing $30B+ in assets).",
    url: "https://wach.ai/",
    demoVideo: "https://drive.google.com/file/d/1OI9lh03ux_tsFLIpA9zGCmvVKNjFitey/view?usp=drivesdk",
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "A proper verification protocol with published SDK on npm shows real engineering effort. QuillAI Network's 15K+ audit pedigree gives them deep security expertise. ERC-8004 mandates as deterministic trust primitives is a sound architectural approach. Multiple repos (Router, Terminal, Demo) show breadth.",
  },
  {
    project: ".agent Community",
    team: "Balázs Némethi",
    score: 8.2,
    award: "Best Agent Infrastructure",
    awardDescription:
      "For pursuing the .agent top-level domain through ICANN — giving every AI agent a real, discoverable identity on the internet.",
    categories: ["Best New Dev Tool", "Best Autonomous Agent", "Most Creative Use of AI"],
    description:
      ".agent might be the most important domain name of the next decade. .edu is for universities. .agent will be for AI. There\u2019s a community effort to make sure no single company controls this namespace \u2014 keeping it open and neutral for everyone building agents. Building the .agent TLD via ICANN application with Unstoppable Domains and Sentient Foundation. The AID (Agent Identity & Discovery) protocol uses DNS TXT records for zero-infrastructure agent discovery across MCP, A2A, OpenAPI, and more. Multi-language SDKs (TypeScript, Python, Go, Rust, .NET, Java), 70+ tests, Ed25519 PKA authentication. 2,500+ community members, supported by Ollama, Datadog, Netlify, Alibaba Cloud, and others.",
    url: "https://agentcommunity.org/",
    demoVideo: null,
    scores: { innovation: 9, agenticDepth: 8, technicalExecution: 7, impactUsefulness: 9, vibesShowFactor: 8 },
    highlights:
      "Pursuing a real ICANN top-level domain for AI agents is wildly ambitious and could define how agents are discovered globally. The AID protocol using DNS TXT records is elegant — zero new infrastructure needed. Multi-language SDKs and 70+ tests show serious engineering. The DMV retro terminal for .agent registration is pure vibes.",
  },
  {
    project: "Synthesis",
    team: "Sophia Dew",
    score: 7.4,
    award: "Best AI Builder Event",
    awardDescription:
      "For creating the first builder event you can enter without a body — where AI agents compete alongside humans for real prizes.",
    categories: ["Most Creative Use of AI", "Best Autonomous Agent", "Community"],
    description:
      "The first builder event where AI agents build real things alongside humans. A 14-day online event (March 4-18, 2026) with three tracks: Agents that Pay, Agents that Trust, and Agents that Cooperate. Mixed AI + human judging panels. AI agents can autonomously register, build, and win monetary prizes. Backed by Ethereum Foundation, Base, and MetaMask.",
    url: "https://synethsis.netlify.app/",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 6, impactUsefulness: 8, vibesShowFactor: 8 },
    highlights:
      "AI agents competing alongside humans for real prizes is a powerful concept. Three tracks perfectly map to core agentic economy challenges. Ethereum Foundation, Base, and MetaMask backing gives it serious weight. Sophia Dew's background (Gitcoin, Celo, Stanford) is ideal for this intersection.",
  },
  {
    project: "RSV.Pizza",
    team: "Snax (PizzaDAO)",
    demoTime: "12:35 PM",
    confirmed: true,
    score: 7.0,
    award: "World's Best Pizza Ordering Bot",
    awardDescription:
      "For optimizing pizza orders with algorithmic precision — half-and-half splitting, dietary constraints, and Borda count pizzeria voting.",
    categories: ["Most Creative Use of AI", "Best User Experience", "World's Best Pizza Ordering Bot"],
    description:
      "Full-stack pizza party planning platform by PizzaDAO. Collects guest preferences and dietary restrictions, then runs a custom optimization algorithm for pizza orders with half-and-half splitting and compatibility scoring. Features Borda count pizzeria voting, NFT proof-of-attendance on Base, Stripe donations, and WhatsApp-native flow. 483 commits, AI-assisted development with Claude. PizzaDAO has organized pizza parties in 400+ cities across 75+ countries.",
    url: "https://www.rsv.pizza/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 5, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 9 },
    highlights:
      "Pizza + crypto + NFT attendance proofs is peak vibes. The optimization algorithm solving dietary constraints with half-and-half splitting is genuinely clever. PizzaDAO's 400+ cities across 75 countries shows real-world adoption. Built with Claude co-authorship — a great AI-assisted development story.",
  },
  {
    project: "AgentCamp",
    team: "Frutero Club",
    score: 6.8,
    award: "Best AI Education Program",
    awardDescription:
      "For building a free, Spanish-language program that teaches anyone to build production AI agents — no coding experience required.",
    categories: ["Community", "Best User Experience"],
    description:
      "A free, 4-week online program teaching production-ready AI agents to Spanish-speaking builders with no prior coding experience. 8 lessons covering agent architecture, tool integration via Composio, and deployment. 70%+ completion rate, 50-person cohorts. Run by Frutero Club (Mexico City), a LATAM builder community with 25+ hackathon wins. Alumni have shipped EVVM, ChipiPay, and 19 completed AI agent projects.",
    url: "https://www.agentcamp.xyz/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 6, technicalExecution: 6, impactUsefulness: 8, vibesShowFactor: 7 },
    highlights:
      "Bringing AI agent development to Spanish-speaking non-coders fills a massive gap. 70%+ completion rate for a free program is exceptional. 25+ hackathon wins and real startups launched prove the community delivers. Infrastructure for the next wave of LATAM AI builders.",
  },
  {
    project: "Godinez.AI",
    team: "Frutero Club",
    score: 7.2,
    award: "Best LatAm AI Employee",
    awardDescription:
      "For building the AI employee that never misses work — WhatsApp-native, Spanish-first, and built for Latin American small businesses.",
    categories: ["Best Autonomous Agent", "Best User Experience", "Most Creative Use of AI"],
    description:
      "An AI-powered virtual employee for Latin American small businesses. Handles customer support via WhatsApp, email scheduling, report generation, content creation, CRM tasks, and invoicing — 24/7, fully in Spanish. Built on OpenClaw with Next.js 16, Convex backend, and persistent memory. Pricing from $1,999 MXN/month. The 'Godinez' name references a beloved Mexican cultural figure (the diligent office worker from El Chavo del Ocho).",
    url: "https://www.godinez.ai/",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 8, vibesShowFactor: 7 },
    highlights:
      "WhatsApp-native AI employee targeting LatAm SMBs addresses a massive underserved market. The 'Godinez' branding is culturally brilliant. Built on OpenClaw with persistent memory and autonomous decision-making. Multi-channel support with real pricing shows product-market fit ambitions.",
  },
  {
    project: "TechTerrain",
    team: "Romulus Mihalteanu",
    demoTime: "1:10 PM",
    confirmed: true,
    score: 7.4,
    award: "Best Technology Visualization",
    awardDescription:
      "For mapping 3.4 million years of human technological progress into a navigable 3D voxel terrain — where AI agents and humans alike can explore, discover patterns, and fly through innovation history.",
    categories: ["Best New Dev Tool", "Most Creative Use of AI", "Best User Experience"],
    description:
      "A 3D interactive visualization of 3.4 million years of human technological progress. Every major invention is a voxel on a navigable terrain where height = impact and color = category. Vim-style keyboard controls, command palette, narrated tours, and AI-powered topic overlays. First-class Agent API (window.__techterrain) lets browser-based AI agents navigate, capture screenshots, generate GIFs, and query a Granger causality engine connecting tech milestones to World Bank and GDELT geopolitical data.",
    url: "https://techterrain.io",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 6, vibesShowFactor: 9 },
    highlights:
      "Visually stunning 3D voxel terrain letting you fly through 3.4 million years of tech history is a demo showstopper. First-class Agent API with screenshot capture, GIF generation, and Granger causality engine shows genuine agent-first design. Vim-style navigation and narrated tours make it both power-user friendly and accessible.",
  },
  {
    project: "ClawVatar",
    team: "Romulus Mihalteanu",
    demoTime: "1:20 PM",
    confirmed: true,
    score: 6.0,
    award: "Best Agent Identity Hub",
    awardDescription:
      "For reimagining digital identity from an agent-first perspective — where AI agents are the primary users who discover, claim, and manage their own avatars autonomously.",
    categories: ["Most Creative Use of AI", "Best New Dev Tool", "Best User Experience"],
    description:
      "The AI-native avatar identity hub. A searchable gallery and API-first platform where AI agents autonomously generate, upload, and manage avatar identities. Agents discover it via llms.txt, JSON-LD, and ai-plugin.json manifest, then use the REST API or browser-side window.clawvatar JS API. Anti-squatting protections (proof-of-work, rate limits, 90-day expiry), tool directory of 16+ avatar generation services, and Supabase-backed identity registry with perceptual deduplication.",
    url: "https://clawvatar.co",
    demoVideo: null,
    scores: { innovation: 7, agenticDepth: 8, technicalExecution: 5, impactUsefulness: 4, vibesShowFactor: 6 },
    highlights:
      "Agent-first identity platform where AI agents are the primary users is a creative inversion of typical avatar services. Thoughtful agentic integration with llms.txt, ai-plugin.json, proof-of-work for AI deletions, and dual API surfaces. Niche use case and sparse gallery limit impact, but the design philosophy is genuinely novel.",
  },
  {
    project: "Collective",
    team: "Lucas Chu / HF0 / Dave Fontenot",
    score: 4.4,
    award: "Most Ambitious Fund Model",
    awardDescription:
      "For reimagining venture funding with blockchain-powered SAFEs that let AI founders keep more of what they build.",
    categories: ["Most Creative Use of AI"],
    description:
      "Liquid Venture — a blockchain-powered alternative to the traditional fund LP structure that creates cult programs (hacker fellowships) for AI founders. Uses SAFEs for GPs so funders don't give up 80% of carry and founders don't give up ~20% of their company for money they don't use.",
    url: null,
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 3, technicalExecution: 3, impactUsefulness: 5, vibesShowFactor: 5 },
    highlights:
      "Interesting concept for restructuring venture funding with blockchain SAFEs, but pre-launch with no public code or live product. Backed by HF0/Dave Fontenot brand. Not an AI agent per se — more of a fund structure innovation.",
  },
  {
    project: "FlowB",
    team: "koH",
    score: 5.5,
    award: "Best Event Coordination Agent",
    awardDescription:
      "For wrangling five platforms into one privacy-first event brain — so your crew never misses a party at ETHDenver.",
    categories: ["Best Autonomous Agent", "Best New Skill", "Best User Experience"],
    description:
      "FlowB is a privacy-centric event coordination platform for EthDenver 2026. Aggregates events from Luma, Eventbrite, Lemonade, and community sources into one searchable feed. Connect as friends, form crews with real-time location sharing, and gamify participation. A single TypeScript backend (Fastify + Supabase) powers five interfaces — Telegram bot, Telegram Mini App, Farcaster Mini App, web, and iOS.",
    url: "https://github.com/flowbondtech/flowb",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 6, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "Cross-platform by design with five interfaces from a single backend. Privacy-first visibility controls and smart multi-source event aggregation purpose-built for a massive multi-venue conference. Gamification that rewards the behaviors that actually make the platform useful.",
  },
  {
    project: "0xBet",
    team: "Tom Stuart",
    score: 5.4,
    demoTime: "11:50 AM",
    award: "Best Autonomous Betting Agent",
    awardDescription:
      "For letting AI put its money where its mouth is — an autonomous sports betting agent that makes its own calls.",
    categories: ["Best Autonomous Agent", "Best User Experience", "Most Creative Use of AI"],
    description:
      "An autonomous intelligent sports betting agent. 0xBet analyzes odds, makes predictions, and places bets independently — bringing AI autonomy to the world of sports betting.",
    url: "https://github.com/icpay/0x-bet",
    demoVideo: "https://www.youtube.com/watch?v=RObutCFYW-c",
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 5, impactUsefulness: 5, vibesShowFactor: 6 },
    highlights:
      "A fun, high-energy concept — AI agents making autonomous betting decisions. The demo video adds polish. Sports betting meets agent autonomy for a crowd-pleasing use case.",
  },
  {
    project: "Incented",
    team: "Sven H",
    score: 6.8,
    demoTime: "12:05 PM",
    award: "Best Agent Coordination Protocol",
    awardDescription:
      "For solving the hardest problem in multi-agent systems — getting autonomous agents to agree on subjective truth through conviction markets and real stakes.",
    categories: ["Best Autonomous Agent", "Most Creative Use of AI", "Best New Dev Tool"],
    description:
      "The coordination protocol for AI agent swarms. Uses conviction markets with time-weighted, capital-dampened scoring to align incentives without centralized judges. Agents stake, evaluate, and earn bounties. Built on Base L2 with USDC escrow. 110M+ tokens staked, 65+ real winners. ClawDown competitive training ground for agents.",
    url: "https://github.com/Incented/clawdown",
    demoVideo: null,
    scores: { innovation: 8, agenticDepth: 7, technicalExecution: 7, impactUsefulness: 7, vibesShowFactor: 5 },
    highlights:
      "A live product with 110M+ tokens staked and real customers. The conviction market scoring formula is genuinely novel math. Competitive Cooperation — agents must be both competitive AND cooperative — is an elegant game-theoretic insight. The missing coordination layer for multi-agent systems.",
  },
  {
    project: "Mamaset",
    team: "Fiona Aboud",
    score: 5.3,
    demoTime: "12:25 PM",
    confirmed: true,
    award: "Most Heartfelt Agent",
    awardDescription:
      "For proving AI can be gentle — an emotionally intelligent companion for the hardest job on earth.",
    categories: ["Best Autonomous Agent", "Best User Experience"],
    description:
      "An emotionally intelligent parenting companion. Mamaset provides empathetic, context-aware support for parents navigating the daily challenges of raising children.",
    url: "https://github.com/fionaaboud/mamaset",
    demoVideo: "https://youtu.be/oZK6eYeawU8?si=Qcp0LiVAIJ2fji0i",
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 5, impactUsefulness: 7, vibesShowFactor: 6 },
    highlights:
      "The most human use case of the night. While everyone else is building trading bots and security layers, Mamaset is helping parents. Emotionally intelligent AI that meets people where they are — exhausted and needing support.",
  },
  {
    project: "BuildAll",
    team: "Austin",
    score: 5.8,
    demoTime: "1:00 PM",
    confirmed: true,
    award: "Best Multi-Chain DeFi Skill",
    awardDescription:
      "For turning plain English into safe multi-chain DeFi actions \u2014 with preflight checks, simulations, and guardrails across ten blockchain ecosystems.",
    categories: ["Best New Skill"],
    description:
      "A multi-chain skill layer for AI agents that translates plain-English intent into deterministic on-chain actions across EVM, Solana, NEAR, Injective, Hedera, and 0G. Uses SKILL.md format so agents can learn blockchain operations without package installs. Supports Uniswap v3 swaps, Aave v3 lending, Maker vaults, Chainlink oracles, cross-chain bridging, and more. Preflight checks, quote simulations, slippage guardrails, and wallet confirmation before every live transaction.",
    url: "https://github.com/PizzaHi5/BuildAll",
    demoVideo: null,
    scores: { innovation: 6, agenticDepth: 6, technicalExecution: 5, impactUsefulness: 7, vibesShowFactor: 4 },
    highlights:
      "Impressive breadth covering 10 chains and multiple DeFi protocols. The SKILL.md approach \u2014 markdown files agents can read to learn blockchain tasks \u2014 is a clever agent-native design. Safety-first with mandatory simulations and wallet confirmation. Built as a pnpm monorepo with proper TypeScript structure and tests.",
  },
  {
    project: "I3 Clawdev",
    team: "Fernando Jia",
    score: 5.45,
    demoTime: "11:30 AM",
    confirmed: true,
    award: "Best Bot Deployment Platform",
    awardDescription:
      "For building a managed platform where anyone can deploy, own, and trade AI-powered Clawdbots as on-chain digital assets.",
    categories: ["Best User Experience", "Most Creative Use of AI", "Best New Dev Tool"],
    description:
      "Intelligence Cubed is a deployment and distribution platform for on-chain AI-powered bots. Deploy personal Clawdbot instances as Telegram agents with multi-model support (GPT-4, Claude 3, Gemini). Features VM management with real-time status monitoring, multi-chain wallet connections (Ethereum, Polygon, Arbitrum, Solana, BSC), daily on-chain check-in rewards, and a broader platform vision including a Modelverse, Marketplace, and Workflows.",
    url: "https://i3dev-temp2-892139814159.us-central1.run.app/clawdbot.html",
    demoVideo: "https://youtu.be/qt1_WEamEjo",
    scores: { innovation: 6, agenticDepth: 5, technicalExecution: 5, impactUsefulness: 6, vibesShowFactor: 5 },
    highlights:
      "A live, functional bot deployment platform with multi-model LLM support and blockchain reward mechanics. The vision of tradeable AI bot assets is creative. Built on Firebase and Google Cloud with working Telegram integration. Ambitious platform scope with multiple planned modules.",
  },
  {
    project: "AGORA",
    team: "Mudaser Iqbal",
    score: 6.3,
    award: "Best Autonomous Trading Agent",
    awardDescription:
      "For building a fully autonomous commodity exchange where AI agents discover, match, and settle trades on Hedera \u2014 no human operator, no Solidity, no T+2 delay.",
    categories: ["Best Autonomous Agent", "Best User Experience"],
    description:
      "A Universal Commodity Protocol agent that autonomously discovers, matches, and settles real-world commodity trades on Hedera blockchain. Watches a live order book via Hedera Consensus Service, receives price attestations every 10 seconds from the openBridge oracle (validated through 0G Compute Network), and executes atomic HTS token swaps when buyer and seller limits overlap. Operates alongside autonomous agents (Alice, Bob, Carol, Dave) in a live multi-agent market. Entire decision loop \u2014 price validation, intent matching, settlement, reputation \u2014 runs on Hedera native primitives using zero Solidity.",
    url: "https://github.com/mudaseriqbalshah/agora.frontend",
    demoVideo: "https://agoradapp.netlify.app/",
    scores: { innovation: 7, agenticDepth: 7, technicalExecution: 5, impactUsefulness: 6, vibesShowFactor: 6 },
    highlights:
      "A genuinely autonomous multi-agent commodity exchange on Hedera with real blockchain integration (HCS, HTS, Mirror Node). The full decision loop \u2014 oracle price feeds, intent matching, atomic settlement, reputation scoring \u2014 runs without human intervention. T+0 atomic settlement vs traditional T+2 is a meaningful improvement. Live demo with real-time agent trading is engaging.",
  },
];

// Assign _order based on array position (last = most recent), then sort by score for ranks
const scoredSubmissions: Omit<Submission, "source">[] = scoredSubmissionsUnsorted
  .map((s, i) => ({ ...s, _order: i }))
  .sort((a, b) => b.score - a.score)
  .map((s, i) => ({ ...s, rank: i + 1 }));

// Normalize a name for dedup matching
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const scoredKeys = new Set(
  scoredSubmissions.flatMap((s) => [
    normalize(s.project),
    normalize(s.team),
    ...s.team.split(/[\/,&]/).map((t) => normalize(t.trim())),
  ])
);

function ScoreCircle({ value, label, max = 10 }: { value: number; label: string; max?: number }) {
  const pct = (value / max) * 100;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-11 h-11">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={r} fill="none"
            stroke={value >= 8 ? "#ec4899" : value >= 6 ? "#f472b6" : "rgba(255,255,255,0.3)"}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{value}</span>
      </div>
      <span className="text-[10px] text-white/40 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function NomineesSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>(
    scoredSubmissions.map((s) => ({ ...s, source: "scored" as const }))
  );
  const [voter, setVoter] = useState<VoterIdentity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [pendingVote, setPendingVote] = useState<{
    itemId: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nebius_build_voter");
    if (stored) {
      try {
        setVoter(JSON.parse(stored));
      } catch {
        localStorage.removeItem("nebius_build_voter");
      }
    }
  }, []);

  useEffect(() => {
    supabase
      .from("votes")
      .select("*")
      .eq("item_type", "nomination")
      .then(({ data }: { data: Vote[] | null }) => {
        if (data) {
          setVotes(data.map((v: Vote) => ({ ...v, item_id: String(v.item_id) })));
        }
      });
  }, []);

  useEffect(() => {
    async function fetchAll() {
      const { data: nomData } = await supabase.from("nominations").select("*").order("created_at", { ascending: true });
      const extra: Submission[] = [];
      let nextRank = scoredSubmissions.length + 1;
      const hidden = new Set(["clawtoclaw", "kiteshield"]);
      let nextOrder = scoredSubmissionsUnsorted.length;
      if (nomData) {
        for (const nom of nomData) {
          if (hidden.has(normalize(nom.agent_name))) continue;
          if (scoredKeys.has(normalize(nom.agent_name)) || scoredKeys.has(normalize(nom.builder_name))) continue;
          extra.push({
            rank: nextRank++,
            project: nom.agent_name,
            team: nom.builder_name,
            score: 0,
            award: "",
            awardDescription: "",
            categories: nom.categories || [],
            description: nom.description || "",
            url: nom.agent_url,
            demoVideo: null,
            source: "nomination",
            scores: null,
            highlights: "",
            _order: nextOrder++,
          });
        }
      }
      if (extra.length > 0) {
        setAllSubmissions((prev) => [...prev, ...extra]);
      }
    }
    fetchAll();
  }, []);

  const getCount = (rankId: string) => {
    let count = 0;
    for (const v of votes) {
      if (v.item_id === rankId) count += v.value;
    }
    return count;
  };

  const myVote = (rankId: string): number => {
    if (!voter) return 0;
    const v = votes.find(
      (v) => v.voter_email === voter.email && v.item_id === rankId
    );
    return v ? v.value : 0;
  };

  const executeVote = useCallback(
    async (identity: VoterIdentity, itemId: string, value: number) => {
      const currentVote = votes.find(
        (v) => v.voter_email === identity.email && v.item_id === itemId
      );
      if (currentVote && currentVote.value === value) {
        setVotes((prev) => prev.filter((v) => v.id !== currentVote.id));
        await supabase.from("votes").delete().eq("id", currentVote.id);
      } else if (currentVote) {
        setVotes((prev) =>
          prev.map((v) => (v.id === currentVote.id ? { ...v, value } : v))
        );
        await supabase.from("votes").update({ value }).eq("id", currentVote.id);
      } else {
        const tempId = `temp-${Date.now()}`;
        setVotes((prev) => [
          ...prev,
          { id: tempId, voter_email: identity.email, item_type: "nomination", item_id: itemId, value },
        ]);
        const { data, error } = await supabase
          .from("votes")
          .insert({
            voter_name: identity.name,
            voter_email: identity.email,
            item_type: "nomination",
            item_id: itemId,
            value,
          })
          .select()
          .single();
        if (error) {
          console.error("Vote error:", error.message, error.code, error.details);
          setVotes((prev) => prev.filter((v) => v.id !== tempId));
        } else if (data) {
          setVotes((prev) =>
            prev.map((v) => (v.id === tempId ? { ...v, id: data.id } : v))
          );
        }
      }
    },
    [votes]
  );

  const handleVote = (itemId: string, value: number) => {
    if (!voter) {
      setPendingVote({ itemId, value });
      setShowModal(true);
      return;
    }
    executeVote(voter, itemId, value);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identity: VoterIdentity = {
      name: modalName.trim(),
      email: modalEmail.trim().toLowerCase(),
    };
    localStorage.setItem("nebius_build_voter", JSON.stringify(identity));
    setVoter(identity);
    setShowModal(false);
    if (pendingVote) {
      executeVote(identity, pendingVote.itemId, pendingVote.value);
      setPendingVote(null);
    }
  };

  const totalVotes = votes.length;
  const [sortBy, setSortBy] = useState<"score" | "votes" | "recent">("score");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allCategories = Array.from(
    new Set(allSubmissions.flatMap((s) => s.categories))
  ).sort();

  const filteredSubmissions = activeCategory
    ? allSubmissions.filter((s) => s.categories.includes(activeCategory))
    : allSubmissions;

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortBy === "votes") {
      const diff = getCount(String(b.rank)) - getCount(String(a.rank));
      if (diff !== 0) return diff;
      return b.score - a.score;
    }
    if (sortBy === "recent") {
      return (b._order ?? 0) - (a._order ?? 0);
    }
    if (a.score !== b.score) return b.score - a.score;
    return a.rank - b.rank;
  });

  return (
    <>
      {/* Nominees Header */}
      <section id="nominees" className="py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Awards Scoreboard
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-4">
            All nominations and demo submissions for
            Nebius.Build Demo Day. Vote for your favorites.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{allSubmissions.length}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Nominees</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">{totalVotes}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Community Votes</div>
            </div>
          </div>
          {voter && (
            <div className="text-sm text-white/40 mt-4">
              Voting as <span className="text-white/70">{voter.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("nebius_build_voter");
                  setVoter(null);
                }}
                className="ml-2 text-white/30 hover:text-white/60 transition-colors underline"
              >
                change
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Scoring Methodology */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">Scoring Methodology</h2>
          <p className="text-sm text-white/40 mb-4">
            Each nominee is scored by an OpenClaw agent across five weighted dimensions.
          </p>
          <div className="border border-white/10 p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
              <div><div className="text-[#c8ff00] font-semibold mb-1">25%</div><div className="text-white/50">Innovation</div></div>
              <div><div className="text-[#c8ff00] font-semibold mb-1">25%</div><div className="text-white/50">Agentic Depth</div></div>
              <div><div className="text-[#c8ff00] font-semibold mb-1">20%</div><div className="text-white/50">Technical</div></div>
              <div><div className="text-[#c8ff00] font-semibold mb-1">20%</div><div className="text-white/50">Impact</div></div>
              <div><div className="text-[#c8ff00] font-semibold mb-1">10%</div><div className="text-white/50">Vibes</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm border transition-colors ${
                activeCategory === null
                  ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                  : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">
                  {allSubmissions.filter((s) => s.categories.includes(cat)).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* The Nominees List */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm uppercase tracking-widest text-white/40">
              {activeCategory ? activeCategory : "The Nominees"}
              <span className="ml-2 text-white/20">{sortedSubmissions.length}</span>
            </h2>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSortBy("score")}
                className={`px-3 py-1.5 border transition-colors ${
                  sortBy === "score" ? "border-white/40 text-white" : "border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Top Score
              </button>
              <button
                onClick={() => setSortBy("votes")}
                className={`px-3 py-1.5 border transition-colors ${
                  sortBy === "votes" ? "border-white/40 text-white" : "border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-3 py-1.5 border transition-colors ${
                  sortBy === "recent" ? "border-white/40 text-white" : "border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Most Recent
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {sortedSubmissions.map((s) => {
              const isExpanded = expandedId === s.rank;
              return (
                <div
                  key={`${s.source}-${s.rank}`}
                  className={`border transition-colors ${
                    s.source === "scored" && s.rank <= 3
                      ? "border-[#c8ff00]/30"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex flex-col items-center gap-0.5 px-3 py-3 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVote(String(s.rank), 1); }}
                        className={`p-0.5 transition-colors ${myVote(String(s.rank)) === 1 ? "text-[#c8ff00]" : "text-white/30 hover:text-white/60"}`}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <span className={`text-xs font-semibold ${getCount(String(s.rank)) > 0 ? "text-[#c8ff00]" : getCount(String(s.rank)) < 0 ? "text-red-400" : "text-white/40"}`}>
                        {getCount(String(s.rank))}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVote(String(s.rank), -1); }}
                        className={`p-0.5 transition-colors ${myVote(String(s.rank)) === -1 ? "text-red-400" : "text-white/30 hover:text-white/60"}`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : s.rank)}
                      className="flex-1 p-5 pl-2 flex items-center gap-4 text-left"
                    >
                      {s.source === "scored" && (
                        <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          s.rank === 1 ? "bg-[#c8ff00] text-black" : s.rank <= 3 ? "border border-[#c8ff00]/50 text-[#c8ff00]" : "border border-white/20 text-white/40"
                        }`}>
                          #{s.rank}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{s.project}</h3>
                          <span className="text-white/30 text-sm">by {s.team}</span>
                          {s.demoTime && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                              s.confirmed
                                ? "text-green-400 border border-green-500/30 bg-green-500/10"
                                : "text-[#c8ff00] border border-[#c8ff00]/30 bg-[#c8ff00]/10"
                            }`}>
                              <Clock className="w-3 h-3" />
                              Demo {s.demoTime}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {s.award ? (
                            <span className="px-2 py-0.5 text-xs border border-[#c8ff00]/30 text-[#c8ff00]">{s.award}</span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs border border-white/20 text-white/40">
                              {s.source === "speaker" ? "Speaker" : "Nomination"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-3">
                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 text-sm bg-[#c8ff00] text-black hover:bg-[#d4ff33] transition-colors inline-flex items-center gap-1.5"
                          >
                            View <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
                      </div>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5">
                      <div className="mt-5 space-y-5">
                        {s.scores && (
                          <div>
                            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Scores</h4>
                            <div className="flex gap-3 flex-wrap">
                              <ScoreCircle value={s.scores.innovation} label="Innovation" />
                              <ScoreCircle value={s.scores.agenticDepth} label="Agentic" />
                              <ScoreCircle value={s.scores.technicalExecution} label="Technical" />
                              <ScoreCircle value={s.scores.impactUsefulness} label="Impact" />
                              <ScoreCircle value={s.scores.vibesShowFactor} label="Vibes" />
                            </div>
                          </div>
                        )}
                        <div>
                          {s.award && (
                            <>
                              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Nomination</h4>
                              <p className="text-sm text-white/70 mb-4 italic">&ldquo;{s.awardDescription}&rdquo;</p>
                            </>
                          )}
                          <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Description</h4>
                          <p className="text-sm text-white/60 mb-4">{s.description || "No description provided."}</p>
                          {s.highlights && (
                            <>
                              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Highlights</h4>
                              <p className="text-sm text-white/60 mb-4">{s.highlights}</p>
                            </>
                          )}
                          {s.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {s.categories.map((c) => (
                                <span key={c} className="px-2 py-0.5 text-xs border border-white/20 text-white/50">{c}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-3">
                            {s.url && (
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#c8ff00] hover:text-[#c8ff00] transition-colors inline-flex items-center gap-1">
                                Project <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {s.demoVideo && (
                              <a href={s.demoVideo} target="_blank" rel="noopener noreferrer" className="text-sm text-[#c8ff00] hover:text-[#c8ff00] transition-colors inline-flex items-center gap-1">
                                Demo Video <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voter Identity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-[#0a0a0a] border border-white/20 p-8 max-w-md w-full relative">
            <button
              onClick={() => { setShowModal(false); setPendingVote(null); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Before you vote</h2>
            <p className="text-white/50 text-sm mb-6">Enter your name and email so we can track your votes.</p>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input type="text" required value={modalName} onChange={(e) => setModalName(e.target.value)} className="w-full bg-transparent border border-white/20 px-4 py-2.5 text-white focus:border-white focus:outline-none transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Email</label>
                <input type="email" required value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} className="w-full bg-transparent border border-white/20 px-4 py-2.5 text-white focus:border-white focus:outline-none transition-colors" placeholder="you@example.com" />
              </div>
              <button type="submit" className="w-full bg-[#c8ff00] text-black py-2.5 font-semibold hover:bg-[#d4ff33] transition-colors">
                Start Voting
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
