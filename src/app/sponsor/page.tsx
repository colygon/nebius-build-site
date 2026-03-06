"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { convex } from "@/lib/convex";

export default function SponsorPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    previousSponsor: "",
    telegram: "",
    donationAmount: "",
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
        await convex.mutation("sponsorInquiries:submit" as any, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
          previousSponsor: form.previousSponsor === "yes",
          telegram: form.telegram || undefined,
          donationAmount: form.donationAmount || undefined,
          plans: form.plans,
        });
      }

      setSubmitted(true);

      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sponsor",
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
            <Image src="/logos/nebius-build-logo.png" alt="Nebius.Build" width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">Nebius.Build</span>
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
            <div className="mb-6">
              <Image src="/logos/nebius-build-logo.png" alt="Nebius.Build" width={120} height={120} className="w-24 md:w-30 h-auto mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Become a Sponsor
            </h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Thank you for your interest in sponsoring Nebius.Build — The 2026 Awards at ETHDenver.
            </p>
          </div>

          <div className="border border-white/20 p-8 md:p-10">
            <p className="text-white/50 mb-8">
              Fill out this brief intake form and we'll be in touch to understand your goals and identify the sponsorship opportunities that best fit your organization.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="text-white/60 mb-2">
                  We've received your inquiry and will be in touch soon.
                </p>
                <p className="text-white/40 text-sm mb-8">
                  We look forward to connecting about Nebius.Build sponsorship opportunities.
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                      placeholder="Last name"
                    />
                  </div>
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
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Have you sponsored ETHDenver before? *
                  </label>
                  <div className="flex gap-3">
                    {["yes", "no"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, previousSponsor: opt })}
                        className={`px-6 py-2.5 text-sm border transition-all capitalize ${
                          form.previousSponsor === opt
                            ? "bg-white text-black border-white"
                            : "border-white/20 hover:border-white/40 text-white/70"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Telegram</label>
                  <input
                    type="text"
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">How much would you like to donate/sponsor (USD)?</label>
                  <input
                    type="text"
                    value={form.donationAmount}
                    onChange={(e) => setForm({ ...form, donationAmount: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="e.g. $5,000, $10,000, $20,000 (Title Sponsor)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Tell us about your plans for Nebius.Build 2026 *
                  </label>
                  <textarea
                    required
                    value={form.plans}
                    onChange={(e) => setForm({ ...form, plans: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-32 resize-none"
                    placeholder="What are your goals? What kind of sponsorship are you interested in?"
                  />
                </div>

                {error && (
                  <div className="p-4 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!form.previousSponsor || submitting}
                  className="bg-white text-black w-full py-4 text-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
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
          <p>Nebius.Build — The 2026 Awards</p>
          <p className="mt-2">March 14, 2026 / San Francisco, CA</p>
        </div>
      </footer>
    </main>
  );
}
