"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ArrowLeft,
  X,
} from "lucide-react";

function twitterUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace("twitter.com", "x.com");
  }
  return `https://x.com/${trimmed.replace("@", "")}`;
}

type Tab = "nominations" | "speakers";
type SortOption = "votes" | "newest";

interface Nomination {
  id: string;
  created_at: string;
  agent_name: string;
  agent_url: string | null;
  description: string;
  categories: string[];
  builder_name: string;
}

interface Speaker {
  id: string;
  created_at: string;
  name: string;
  email: string;
  twitter: string | null;
  company: string | null;
  topic: string;
  format: string;
  bio: string;
}

interface Vote {
  id: string;
  voter_email: string;
  item_type: "nomination" | "speaker";
  item_id: string;
  value: number;
}

interface VoterIdentity {
  name: string;
  email: string;
}

export default function VotePage() {
  const [tab, setTab] = useState<Tab>("nominations");
  const [sort, setSort] = useState<SortOption>("votes");
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voter, setVoter] = useState<VoterIdentity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [pendingVote, setPendingVote] = useState<{
    itemType: "nomination" | "speaker";
    itemId: string;
    value: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Load voter identity from localStorage
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

  // Fetch all data on mount
  useEffect(() => {
    async function fetchData() {
      const [nomRes, speakerRes, voteRes] = await Promise.all([
        supabase.from("nominations").select("id, created_at, agent_name, agent_url, description, categories, builder_name"),
        supabase.from("speaker_applications").select("id, created_at, name, email, twitter, company, topic, format, bio"),
        supabase.from("votes").select("*"),
      ]);
      if (nomRes.error) console.error("Fetch nominations error:", nomRes.error);
      if (speakerRes.error) console.error("Fetch speakers error:", speakerRes.error);
      if (voteRes.error) console.error("Fetch votes error:", voteRes.error);
      const hiddenNoms = new Set(["ClawToClaw", "Kiteshield"]);
      if (nomRes.data)
        setNominations(
          nomRes.data.filter((n: { agent_name: string }) => !hiddenNoms.has(n.agent_name))
        );
      if (speakerRes.data) setSpeakers(speakerRes.data);
      if (voteRes.data) setVotes(voteRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Aggregate vote counts
  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of votes) {
      const key = `${v.item_type}:${v.item_id}`;
      counts[key] = (counts[key] || 0) + v.value;
    }
    return counts;
  }, [votes]);

  // Get current user's vote for an item
  const myVote = useCallback(
    (itemType: "nomination" | "speaker", itemId: string): number => {
      if (!voter) return 0;
      const v = votes.find(
        (v) => v.voter_email === voter.email && v.item_type === itemType && v.item_id === itemId
      );
      return v ? v.value : 0;
    },
    [voter, votes]
  );

  // Sorted nominations
  const sortedNominations = useMemo(() => {
    const sorted = [...nominations];
    if (sort === "votes") {
      sorted.sort((a, b) => {
        const aCount = voteCounts[`nomination:${a.id}`] || 0;
        const bCount = voteCounts[`nomination:${b.id}`] || 0;
        return bCount - aCount;
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [nominations, sort, voteCounts]);

  // Sorted speakers
  const sortedSpeakers = useMemo(() => {
    const sorted = [...speakers];
    if (sort === "votes") {
      sorted.sort((a, b) => {
        const aCount = voteCounts[`speaker:${a.id}`] || 0;
        const bCount = voteCounts[`speaker:${b.id}`] || 0;
        return bCount - aCount;
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [speakers, sort, voteCounts]);

  // Execute the actual vote upsert
  const executeVote = useCallback(
    async (
      identity: VoterIdentity,
      itemType: "nomination" | "speaker",
      itemId: string,
      value: number
    ) => {
      const currentVote = votes.find(
        (v) => v.voter_email === identity.email && v.item_type === itemType && v.item_id === itemId
      );

      if (currentVote && currentVote.value === value) {
        // Toggle off: remove the vote
        setVotes((prev) => prev.filter((v) => v.id !== currentVote.id));
        const { error } = await supabase.from("votes").delete().eq("id", currentVote.id);
        if (error) console.error("Vote delete error:", error);
      } else if (currentVote) {
        // Switch direction: update existing vote
        setVotes((prev) =>
          prev.map((v) => (v.id === currentVote.id ? { ...v, value } : v))
        );
        const { error } = await supabase.from("votes").update({ value }).eq("id", currentVote.id);
        if (error) console.error("Vote update error:", error);
      } else {
        // New vote: insert
        const tempId = `temp-${Date.now()}`;
        const newVote: Vote = {
          id: tempId,
          voter_email: identity.email,
          item_type: itemType,
          item_id: itemId,
          value,
        };
        setVotes((prev) => [...prev, newVote]);

        const { data, error } = await supabase
          .from("votes")
          .insert({
            voter_name: identity.name,
            voter_email: identity.email,
            item_type: itemType,
            item_id: itemId,
            value,
          })
          .select()
          .single();

        if (error) {
          console.error("Vote insert error:", error);
          // Roll back optimistic update
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

  // Handle vote click
  const handleVote = (itemType: "nomination" | "speaker", itemId: string, value: number) => {
    if (!voter) {
      setPendingVote({ itemType, itemId, value });
      setShowModal(true);
      return;
    }
    executeVote(voter, itemType, itemId, value);
  };

  // Handle modal submit
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identity: VoterIdentity = { name: modalName.trim(), email: modalEmail.trim().toLowerCase() };
    localStorage.setItem("nebius_build_voter", JSON.stringify(identity));
    setVoter(identity);
    setShowModal(false);
    if (pendingVote) {
      executeVote(identity, pendingVote.itemType, pendingVote.itemId, pendingVote.value);
      setPendingVote(null);
    }
  };

  const getCount = (itemType: "nomination" | "speaker", itemId: string) =>
    voteCounts[`${itemType}:${itemId}`] || 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <Image src="/logos/nebius-build-logo.png" alt="Nebius.Build" width={200} height={67} className="h-10 w-auto" />
          </a>
          {voter && (
            <div className="text-sm text-white/40">
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
      </nav>

      {/* Header */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Community Vote
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Upvote your favorite nominations and speaker applications. Help the community decide who takes the stage.
          </p>
        </div>
      </section>

      {/* Tabs + Sort */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setTab("nominations")}
                className={`px-5 py-2.5 text-sm font-semibold border transition-colors ${
                  tab === "nominations"
                    ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
              >
                Nominations
              </button>
              <button
                onClick={() => setTab("speakers")}
                className={`px-5 py-2.5 text-sm font-semibold border transition-colors ${
                  tab === "speakers"
                    ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
              >
                Speakers
              </button>
            </div>

            {/* Sort */}
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSort("votes")}
                className={`px-3 py-1.5 border transition-colors ${
                  sort === "votes"
                    ? "border-white/40 text-white"
                    : "border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Most Voted
              </button>
              <button
                onClick={() => setSort("newest")}
                className={`px-3 py-1.5 border transition-colors ${
                  sort === "newest"
                    ? "border-white/40 text-white"
                    : "border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Newest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center py-20 text-white/40">Loading...</div>
          ) : tab === "nominations" ? (
            sortedNominations.length === 0 ? (
              <div className="text-center py-20 text-white/40">No nominations yet.</div>
            ) : (
              sortedNominations.map((nom) => (
                <div
                  key={nom.id}
                  className="border border-white/10 p-6 hover:border-white/20 transition-colors flex gap-4 sm:gap-6"
                >
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 min-w-[40px]">
                    <button
                      onClick={() => handleVote("nomination", nom.id, 1)}
                      className={`p-1 transition-colors ${
                        myVote("nomination", nom.id) === 1
                          ? "text-[#c8ff00]"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      <ChevronUp className="w-6 h-6" />
                    </button>
                    <span
                      className={`text-sm font-semibold ${
                        getCount("nomination", nom.id) > 0
                          ? "text-[#c8ff00]"
                          : getCount("nomination", nom.id) < 0
                          ? "text-red-400"
                          : "text-white/40"
                      }`}
                    >
                      {getCount("nomination", nom.id)}
                    </span>
                    <button
                      onClick={() => handleVote("nomination", nom.id, -1)}
                      className={`p-1 transition-colors ${
                        myVote("nomination", nom.id) === -1
                          ? "text-red-400"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      <ChevronDown className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{nom.agent_name}</h3>
                      {nom.agent_url && (
                        <a
                          href={nom.agent_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-white/50 text-sm mt-1 line-clamp-2">{nom.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {nom.categories?.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 text-xs border border-[#c8ff00]/30 text-[#c8ff00]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs mt-3">
                      by {nom.builder_name}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : sortedSpeakers.length === 0 ? (
            <div className="text-center py-20 text-white/40">No speaker applications yet.</div>
          ) : (
            sortedSpeakers.map((spk) => (
              <div
                key={spk.id}
                className="border border-white/10 p-6 hover:border-white/20 transition-colors flex gap-4 sm:gap-6"
              >
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 min-w-[40px]">
                  <button
                    onClick={() => handleVote("speaker", spk.id, 1)}
                    className={`p-1 transition-colors ${
                      myVote("speaker", spk.id) === 1
                        ? "text-[#c8ff00]"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                  <span
                    className={`text-sm font-semibold ${
                      getCount("speaker", spk.id) > 0
                        ? "text-[#c8ff00]"
                        : getCount("speaker", spk.id) < 0
                        ? "text-red-400"
                        : "text-white/40"
                    }`}
                  >
                    {getCount("speaker", spk.id)}
                  </span>
                  <button
                    onClick={() => handleVote("speaker", spk.id, -1)}
                    className={`p-1 transition-colors ${
                      myVote("speaker", spk.id) === -1
                        ? "text-red-400"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{spk.name}</h3>
                      {spk.company && (
                        <p className="text-white/40 text-sm">{spk.company}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {spk.format && (
                        <span className="px-2 py-0.5 text-xs border border-white/20 text-white/50">
                          {spk.format}
                        </span>
                      )}
                      {spk.twitter && (
                        <a
                          href={twitterUrl(spk.twitter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-[#c8ff00] text-sm mt-2 font-medium">{spk.topic}</p>
                  <p className="text-white/50 text-sm mt-1 line-clamp-3">{spk.bio}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-white/30">
          <a href="/" className="hover:text-white/60 transition-colors">
            Nebius.Build 2026
          </a>
          <span>Community-curated</span>
        </div>
      </footer>

      {/* Voter Identity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-[#0a0a0a] border border-white/20 p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowModal(false);
                setPendingVote(null);
              }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Before you vote</h2>
            <p className="text-white/50 text-sm mb-6">
              Enter your name and email so we can track your votes. This is saved locally on your device.
            </p>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full bg-transparent border border-white/20 px-4 py-2.5 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/20 px-4 py-2.5 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#c8ff00] text-black py-2.5 font-semibold hover:bg-[#d4ff33] transition-colors"
              >
                Start Voting
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
