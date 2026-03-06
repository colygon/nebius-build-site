"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { convex } from "@/lib/convex";

const REGISTER_URL = "https://cerebralvalley.ai/e/nebius-build-sf";
const roles = ["Hacker", "Partner", "Sponsor", "Promoter", "Volunteer", "Judge", "Mentor", "Speaker", "Artist", "Press"] as const;

export default function RegisterPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    company: "",
    website: "",
    linkedin: "",
    twitter: "",
    phone: "",
    presentationTitle: "",
    speakerLinks: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoles.length === 0) return;
    setSubmitting(true);
    setError(null);

    const roleString = selectedRoles.map(r => r.toLowerCase()).join(", ");

    try {
      // Push to Convex
      if (convex) {
        await convex.mutation("registrations:submit" as any, {
          roles: roleString,
          name: form.name,
          title: form.title || undefined,
          email: form.email,
          company: form.company || undefined,
          website: form.website || undefined,
          linkedin: form.linkedin || undefined,
          twitter: form.twitter || undefined,
          phone: form.phone || undefined,
          presentationTitle: form.presentationTitle || undefined,
          speakerLinks: form.speakerLinks || undefined,
          message: form.message || undefined,
        });
      }

      setSubmitted(true);

      // Push to Google Sheet
      const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
      if (sheetUrl) {
        fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            roles: roleString,
            name: form.name,
            title: form.title,
            email: form.email,
            company: form.company,
            website: form.website,
            linkedin: form.linkedin,
            twitter: form.twitter,
            phone: form.phone,
            presentationTitle: form.presentationTitle,
            speakerLinks: form.speakerLinks,
            message: form.message,
          }),
        }).catch(() => {});
      }

      // Send email notification
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          data: { ...form, role: roleString },
        }),
      }).catch(() => {});
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Submit error:", err);
    }

    setSubmitting(false);
  };

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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Partner Registration
            </h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Join Nebius.Build as a partner, speaker, volunteer, judge, mentor, or press.
            </p>
          </div>

          <div className="border border-white/20 p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="text-white/60 mb-2">
                  We&apos;ve received your application and will be in touch soon.
                </p>
                <p className="text-white/40 text-sm mb-8">
                  We look forward to having you at Nebius.Build.
                </p>
                <Link
                  href="/"
                  className="border border-white/20 px-8 py-3 font-semibold hover:border-white/40 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Nebius.Build
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-white/70">I&apos;d like to participate as a... *</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          if (role === "Hacker") {
                            setSelectedRoles(prev =>
                              prev.includes("Hacker") ? prev.filter(r => r !== "Hacker") : ["Hacker"]
                            );
                          } else {
                            setSelectedRoles(prev => {
                              const without = prev.filter(r => r !== "Hacker");
                              return without.includes(role) ? without.filter(r => r !== role) : [...without, role];
                            });
                          }
                        }}
                        className={`px-5 py-2.5 text-sm font-semibold border transition-colors ${
                          selectedRoles.includes(role)
                            ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                            : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRoles.includes("Hacker") ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 mb-6">
                      Hacker registration is handled through Cerebral Valley.
                    </p>
                    <a
                      href={REGISTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#c8ff00] text-black px-8 py-4 text-lg font-semibold hover:bg-[#d4ff33] transition-colors inline-flex items-center gap-3"
                    >
                      Register as a Hacker
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                ) : (
                <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Company / Organization</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="Your company or organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Website</label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">LinkedIn</label>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Twitter / X</label>
                  <input
                    type="text"
                    value={form.twitter}
                    onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {selectedRoles.includes("Speaker") && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Presentation Title</label>
                    <input
                      type="text"
                      value={form.presentationTitle || ""}
                      onChange={(e) => setForm({ ...form, presentationTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="Title of your talk or presentation"
                    />
                  </div>
                )}

                {selectedRoles.includes("Speaker") && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Slides / Video Links</label>
                    <input
                      type="text"
                      value={form.speakerLinks || ""}
                      onChange={(e) => setForm({ ...form, speakerLinks: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="Links to slides, videos, or past talks"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Tell us more about how you&apos;d like to be involved
                  </label>
                  {selectedRoles.some(r => ["Partner", "Sponsor", "Mentor", "Judge"].includes(r)) && (
                    <p className="text-sm text-white/40 mb-2">
                      Please include any documentation links, presentation links, or details on prizes such as credits you plan to give away.
                    </p>
                  )}
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-32 resize-none"
                    placeholder={
                      selectedRoles.some(r => ["Partner", "Sponsor", "Mentor", "Judge"].includes(r))
                        ? "Your goals, documentation/presentation links, prizes or credits you plan to offer, and anything else we should know."
                        : "Your goals, relevant experience, or anything else we should know."
                    }
                  />
                </div>

                {error && (
                  <div className="p-4 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={selectedRoles.length === 0 || submitting}
                  className="bg-[#c8ff00] text-black w-full py-4 text-lg font-semibold hover:bg-[#d4ff33] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit"}
                  {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>
                </>
                )}
              </form>
            )}
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
