#!/usr/bin/env npx tsx

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually
const envPath = resolve(import.meta.dirname || __dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "events@clawsout.ai";
const FROM_NAME = "Claws Out";

const demos = [
  { time: "11:20 AM", project: "WachClaw", presenter: "Rajat Gahlot", email: "rajat@quillai.network" },
  { time: "11:30 AM", project: "I3 Clawdev", presenter: "Fernando Jia", email: "fernando.jia@intelligencecubed.com" },
  { time: "11:50 AM", project: "Clawdtalk", presenter: "Jon Lucas", email: "jonlucas@telnyx.com" },
  { time: "12:00 PM", project: "Clawloan", presenter: "Francesco", email: "" },
  { time: "12:30 PM", project: "GAN", presenter: "IGLIVISION", email: "igliarts@gmail.com" },
  { time: "12:40 PM", project: "RSV.Pizza", presenter: "Snax (PizzaDAO)", email: "snax@rarepizzas.com" },
  { time: "12:50 PM", project: "BuildAll", presenter: "Austin", email: "j.austin.motley@gmail.com" },
  { time: "1:10 PM", project: "TechTerrain", presenter: "Romulus Mihalteanu", email: "r0mc0de@pm.me" },
  { time: "1:20 PM", project: "ClawVatar", presenter: "R. McAvatarface", email: "r0mc0de@pm.me" },
  { time: "1:40 PM", project: "ClawSwarm", presenter: "Kye Gomez", email: "kye@swarms.world" },
  { time: "1:50 PM", project: "Starkbot AI", presenter: "Andrew Mazzola", email: "admin@starkbot.ai" },
  { time: "2:20 PM", project: "clawpay (b402)", presenter: "Mayur Chougule", email: "mayur@vistara.dev" },
  { time: "2:30 PM", project: "ClawMon", presenter: "Drew Mailen", email: "d@bountybase.com" },
];

function buildHtml(demo: typeof demos[0]): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 30px; border: 1px solid rgba(255,255,255,0.1);">
  <h1 style="font-size: 24px; margin: 0 0 8px 0;">Claws Out 🦞</h1>
  <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 30px 0;">ETHDenver 2026 &middot; Demo Day &amp; AI Agent Awards</p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 30px 0;" />

  <h2 style="font-size: 20px; margin: 0 0 16px 0;">Stage Check-In Instructions</h2>
  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 24px 0;">
    Hi ${demo.presenter},<br/><br/>
    You're confirmed to demo <strong>${demo.project}</strong> today. Here's what you need to know about checking in.
  </p>

  <div style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); padding: 20px; margin: 0 0 24px 0; text-align: center;">
    <p style="margin: 0 0 4px 0; font-size: 14px; color: rgba(255,255,255,0.5);">Your Demo Time</p>
    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #ec4899;">${demo.time}</p>
  </div>

  <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 12px 0; font-weight: bold;">Check-In with the Stage Manager</p>
    <p style="margin: 0; color: rgba(255,255,255,0.7); line-height: 1.6;">
      Please come check in with the <strong>stage manager to the right of the stage</strong> at least <strong>30&ndash;45 minutes before your demo time</strong>.<br/><br/>
      After checking in, please <strong>sit in the white chairs directly to the right of the stage</strong>.<br/><br/>
      We need to make sure there are no problems with your presentation before we put you on stage.
    </p>
  </div>

  <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0; font-weight: bold;">Finding Us</p>
    <p style="margin: 0; color: rgba(255,255,255,0.7); line-height: 1.6;">
      There is only one entrance. The main stage is the first thing you will see when you walk in.
    </p>
  </div>

  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 30px 0;">
    See you on stage! Questions? Reply to this email.
  </p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 20px 0;" />
  <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">Claws Out &middot; ETHDenver 2026 &middot; Saturday, Feb 21 &middot; Denver CO</p>
</div>`;
}

function buildText(demo: typeof demos[0]): string {
  return `Hi ${demo.presenter},

You're confirmed to demo ${demo.project} today.

YOUR DEMO TIME: ${demo.time}

CHECK-IN WITH THE STAGE MANAGER:
Please come check in with the stage manager to the right of the stage at least 30-45 minutes before your demo time. After checking in, please sit in the white chairs directly to the right of the stage. We need to make sure there are no problems with your presentation before we put you on stage.

FINDING US:
There is only one entrance. The main stage is the first thing you will see when you walk in.

See you on stage! Questions? Reply to this email.

— Claws Out · ETHDenver 2026 · Saturday, Feb 21 · Denver CO`;
}

async function sendEmail(to: string, subject: string, text: string, html: string, cc?: string[]) {
  if (!SENDGRID_API_KEY) {
    console.log(`[DRY RUN] Would send to: ${to} | CC: ${cc?.join(", ") || "none"} | Subject: ${subject}`);
    return;
  }

  const personalization: Record<string, unknown> = {
    to: [{ email: to }],
  };
  if (cc && cc.length > 0) {
    personalization.cc = cc.map(e => ({ email: e }));
  }

  const body = {
    personalizations: [personalization],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    reply_to: { email: "colin@lowenberg.org", name: "Colin Lowenberg" },
    subject,
    content: [
      { type: "text/plain", value: text },
      { type: "text/html", value: html },
    ],
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[ERROR] SendGrid ${res.status} for ${to}:`, err);
  } else {
    console.log(`[SENT] ${to} — ${subject}`);
  }
}

async function main() {
  const testMode = process.argv.includes("--test");
  const sendAll = process.argv.includes("--send");

  if (testMode) {
    const testDemo = { time: "2:00 PM", project: "Test Project", presenter: "Colin", email: "colin@lowenberg.org" };
    console.log("Sending test email to colin@lowenberg.org...");
    await sendEmail(
      "colin@lowenberg.org",
      `[Claws Out] Please Confirm Your Demo Slot — Test Project at 2:00 PM`,
      buildText(testDemo),
      buildHtml(testDemo)
    );
    console.log("Done!");
    return;
  }

  const singleIdx = process.argv.indexOf("--single");
  if (singleIdx !== -1) {
    const name = process.argv[singleIdx + 1];
    const demo = demos.find(d => d.project.toLowerCase() === name?.toLowerCase());
    if (!demo) { console.error(`Project "${name}" not found`); return; }
    const ccIdx = process.argv.indexOf("--cc");
    const cc = ccIdx !== -1 ? process.argv.slice(ccIdx + 1).filter(a => !a.startsWith("--")) : undefined;
    const subject = `[Claws Out] Stage Check-In — ${demo.project} at ${demo.time}`;
    await sendEmail(demo.email, subject, buildText(demo), buildHtml(demo), cc);
    console.log("Done!");
    return;
  }

  if (sendAll) {
    // Deduplicate by email (TechTerrain and ClawVatar share same email)
    const seen = new Set<string>();
    for (const demo of demos) {
      if (seen.has(demo.email)) {
        console.log(`[SKIP] ${demo.email} (${demo.project}) — already sent to this email`);
        continue;
      }
      seen.add(demo.email);
      const subject = `[Claws Out] Stage Check-In — ${demo.project} at ${demo.time}`;
      await sendEmail(demo.email, subject, buildText(demo), buildHtml(demo));
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }
    console.log(`\nDone! Sent to ${seen.size} unique emails.`);
    return;
  }

  console.log("Usage:");
  console.log("  npx tsx scripts/send-confirm-emails.ts --test    Send test to colin@lowenberg.org");
  console.log("  npx tsx scripts/send-confirm-emails.ts --send    Send to all demo presenters");
}

main().catch(console.error);
