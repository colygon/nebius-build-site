"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { convex } from "@/lib/convex";

export default function PartnerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    plans: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (convex) {
        await convex.mutation("registrations:submit" as any, {
          roles: "partner",
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          website: form.website || undefined,
          message: form.plans || undefined,
        });
      }

      setSubmitted(true);

      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          data: form,
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
              Become a Partner
            </h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Join Nebius.Build as a partner. Help us bring the best AI + robotics builders together in San Francisco.
            </p>
          </div>

          <div className="border border-white/20 p-8 md:p-10">
            <p className="text-white/50 mb-8">
              Fill out this form and we&apos;ll be in touch to discuss partnership opportunities.
            </p>

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
                  We look forward to partnering with you for Nebius.Build.
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
                  <label className="block text-sm font-medium mb-2 text-white/70">Company *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="Your company or organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    How would you like to partner with Nebius.Build? *
                  </label>
                  <textarea
                    required
                    value={form.plans}
                    onChange={(e) => setForm({ ...form, plans: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-32 resize-none"
                    placeholder="Tell us about your goals and how you'd like to be involved."
                  />
                </div>

                {error && (
                  <div className="p-4 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#c8ff00] text-black w-full py-4 text-lg font-semibold hover:bg-[#d4ff33] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                  {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>
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
