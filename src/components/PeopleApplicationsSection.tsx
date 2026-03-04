"use client";

import { useState, type FormEvent } from "react";
import { Calendar, Check, Mail, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type RoleKey = "judge" | "mentor" | "volunteer" | "sponsors" | "press" | "hacker";

const roles: { key: RoleKey; label: string; summary: string }[] = [
  {
    key: "hacker",
    label: "Hacker",
    summary: "Apply for on-site support as a participating hacker or team member with a focused build-time role.",
  },
  {
    key: "judge",
    label: "Judge",
    summary: "Review submissions, score demos, and help choose finalists. Prior event judging experience preferred.",
  },
  {
    key: "mentor",
    label: "Mentor",
    summary: "Help teams during build time: architecture questions, debugging, and MVP scoping support.",
  },
  {
    key: "volunteer",
    label: "Volunteer",
    summary: "Assist with onsite flow: check-ins, room logistics, and general attendee support.",
  },
  {
    key: "sponsors",
    label: "Partner",
    summary: "Represent your partner org for booth presence, media timing, and networking opportunities.",
  },
  {
    key: "press",
    label: "Press",
    summary: "Includes videographers, photographers, and influencers for coverage, interviews, and media support during the event.",
  },
];

const roleQuestions: Record<RoleKey, { q1: string; q2: string }> = {
  judge: {
    q1: "What categories are you best suited to judge (e.g., technical execution, UX, infra, agentic systems)?",
    q2: "How many hours can you commit?",
  },
  mentor: {
    q1: "What technologies/areas can you help teams with quickly?",
    q2: "How many hours can you hold office-hours during the event?",
  },
  volunteer: {
    q1: "What volunteer tasks have you done before at events?",
    q2: "Can you be on-site 3-5 hours including setup/teardown?",
  },
  sponsors: {
    q1: "What partnership opportunity are you interested in?",
    q2: "Do you have materials or a branding checklist ready for the event?",
  },
  press: {
    q1: "What publication or outlet do you represent, and what coverage are you planning?",
    q2: "Which interviews, demos, or stories are you most interested in covering?",
  },
  hacker: {
    q1: "Tell us about your project focus and what you hope to build at Nebius.Build.",
    q2: "What resources or support would make your hacking day more successful?",
  },
};

export default function PeopleApplicationsSection() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>("judge");
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timezone: "",
    organization: "",
    q1: "",
    q2: "",
    comments: "",
    canConfirmAvailability: false,
    github: "",
    linkedin: "",
  });

  const questionSet = roleQuestions[selectedRole];
  const needsGithub = selectedRole === "hacker" || selectedRole === "mentor";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("people_applications").insert({
      role: selectedRole,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      timezone: formData.timezone,
      organization: formData.organization || null,
      github: formData.github || null,
      linkedin: formData.linkedin || null,
      question_one: formData.q1 || null,
      question_two: formData.q2 || null,
      availability: formData.canConfirmAvailability ? ["march_14"] : [],
      comments: formData.comments || null,
      availability_confirmed: formData.canConfirmAvailability,
      status: "pending",
    });

    setSubmitting(false);

    if (insertError) {
      console.error("People application error:", insertError);
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "people_application",
        data: {
          name: formData.name,
          email: formData.email,
          role: selectedRole,
          availability: formData.canConfirmAvailability ? ["march_14"] : [],
          questionOne: formData.q1,
          questionTwo: formData.q2,
          canConfirmAvailability: formData.canConfirmAvailability,
          github: formData.github || null,
          linkedin: formData.linkedin || null,
          timezone: formData.timezone,
          comments: formData.comments,
        },
      }),
    }).catch(() => {});
  };

  const reset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      timezone: "",
      organization: "",
      q1: "",
      q2: "",
      comments: "",
      canConfirmAvailability: false,
      github: "",
      linkedin: "",
    });
    setSelectedRole("judge");
    setHasSelectedRole(false);
  };

  return (
    <section id="people-ops" className="py-24 px-6 border-t border-white/10 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Calendar className="w-8 h-8 text-[#c8ff00]" />
          <h2 className="text-3xl md:text-4xl font-bold">Partner / Volunteer Interest</h2>
        </div>

        <p className="text-white/60 mb-8">
          Apply as a judge, mentor, volunteer, partner, or press — or register as a hacker on Cerebral Valley. Share your experience, confirm your availability,
          and we&apos;ll follow up with next steps.
        </p>

        <div className="border border-white/20 p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Application Sent</h3>
              <p className="text-white/60 mb-4">
                Thanks for applying. Our ops lead will confirm availability and next steps.
              </p>
              <button
                onClick={reset}
                className="border border-white/20 px-6 py-3 font-semibold hover:border-white/40 transition-colors"
              >
                Apply Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!hasSelectedRole ? (
                <div>
                  <p className="text-sm text-white/50 mb-3">Role applying for</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => {
                          if (role.key === "hacker") {
                            window.open("https://cerebralvalley.ai/e/nebius-build-sf", "_blank", "noopener,noreferrer");
                            return;
                          }
                          setSelectedRole(role.key);
                          setHasSelectedRole(true);
                        }}
                        className={`border p-4 text-left transition-colors ${
                          selectedRole === role.key && hasSelectedRole
                            ? "border-[#c8ff00] text-white"
                            : "border-white/20 text-white/70 hover:border-white/40"
                        }`}
                      >
                        <div className="font-semibold">{role.label}{role.key === "hacker" ? " →" : ""}</div>
                        <p className="text-sm text-white/50 mt-1">{role.key === "hacker" ? "Register on Cerebral Valley" : role.summary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-[#c8ff00]/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/50">Applying for</p>
                      <p className="text-lg font-semibold">
                        {roles.find((role) => role.key === selectedRole)?.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasSelectedRole(false)}
                      className="border border-white/20 text-white/80 px-3 py-2 text-sm hover:border-white/40"
                    >
                      Change role
                    </button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Full name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="Jordan Lee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Phone (optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="+1 (555) 555-5555"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">City, State/Country</label>
                  <input
                    required
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Company / Team (optional)</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                  placeholder="Open Source Project, Company, School"
                />
              </div>

              {needsGithub && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">GitHub Profile *</label>
                  <input
                    required
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                    placeholder="https://github.com/your-handle"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">LinkedIn Profile *</label>
                <input
                  required
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none"
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">{questionSet.q1}</label>
                  <textarea
                    required
                    value={formData.q1}
                    onChange={(e) => setFormData({ ...formData, q1: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-28 resize-none"
                    placeholder="Tell us in one paragraph."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">{questionSet.q2}</label>
                  <textarea
                    required
                    value={formData.q2}
                    onChange={(e) => setFormData({ ...formData, q2: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-28 resize-none"
                    placeholder="Share availability and constraints."
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={formData.canConfirmAvailability}
                  onChange={(e) => setFormData({ ...formData, canConfirmAvailability: e.target.checked })}
                  className="accent-[#c8ff00]"
                />
                I confirm availability on March 14th.
              </label>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Other notes (optional)</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-white transition-colors outline-none h-24 resize-none"
                  placeholder="Any additional info we should know."
                />
              </div>

              {error && <div className="p-4 border border-[#c8ff00]/30 text-[#c8ff00] text-sm">{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-white text-black w-full py-4 text-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Application"}
                {!submitting && <Send className="w-5 h-5" />}
              </button>
            </form>
          )}
        </div>

        <p className="text-sm text-white/40 mt-5 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Application confirmation and availability updates are handled by the event ops desk.
        </p>
      </div>
    </section>
  );
}
