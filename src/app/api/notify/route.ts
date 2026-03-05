import { NextRequest, NextResponse } from "next/server";

const NOTIFY_EMAIL = "colin@lowenberg.org";
const FROM_EMAIL = "events@nebius.build";
const FROM_NAME = "Nebius.Build";

// Build a flat row array for Google Sheets based on form type
function buildSheetRow(type: string, data: Record<string, unknown>): unknown[] {
  const timestamp = new Date().toISOString();

  if (type === "nomination") {
    return [
      timestamp,
      data.agentName,
      data.agentUrl || "",
      data.builderName,
      data.email,
      data.description,
      data.demoPersonName || "",
      data.demoPersonEmail || "",
      data.demoPersonPhone || "",
      (data.categories as string[])?.join(", ") || "",
      (data.customCategories as string[])?.join(", ") || "",
    ];
  } else if (type === "speaker") {
    return [
      timestamp,
      data.name,
      data.email,
      data.twitter || "",
      data.company || "",
      data.topic,
      data.format,
      data.bio,
    ];
  } else if (type === "people_application") {
    return [
      timestamp,
      data.role || "",
      data.name || "",
      data.email || "",
      ((data.availability as string[]) || []).join(", "),
      data.canConfirmAvailability ? "Confirmed" : "Unconfirmed",
      data.questionOne || "",
      data.questionTwo || "",
      data.timezone || "",
    ];
  } else if (type === "sponsor") {
    return [
      timestamp,
      data.firstName,
      data.lastName,
      data.email,
      data.company,
      data.previousSponsor === "yes" ? "Yes" : "No",
      data.telegram || "",
      data.donationAmount || "",
      data.plans,
    ];
  }
  return [];
}

// Map form type to Google Sheet tab name
function sheetTabName(type: string): string {
  const map: Record<string, string> = {
    nomination: "Nominations",
    speaker: "Speakers",
    people_application: "People Applications",
    sponsor: "Sponsors",
  };
  return map[type] || type;
}

async function sendEmail(to: string, subject: string, text: string, html?: string, cc?: string[]) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body:\n${text}`);
    return;
  }

  const body: Record<string, unknown> = {
    personalizations: [{
      to: [{ email: to }],
      ...(cc?.length ? { cc: cc.map(e => ({ email: e })) } : {}),
    }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    content: html
      ? [
          { type: "text/plain", value: text },
          { type: "text/html", value: html },
        ]
      : [{ type: "text/plain", value: text }],
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[EMAIL] SendGrid error (${res.status}):`, err);
  }
}

function nominationConfirmationHtml(data: Record<string, unknown>): string {
  const categories = (data.categories as string[])?.join(", ") || "";
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px 30px; border: 1px solid rgba(255,255,255,0.1);">
  <h1 style="font-size: 24px; margin: 0 0 8px 0;">Nebius.Build</h1>
  <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0 0 30px 0;">OpenClaw + Robotics Hackathon &middot; March 15, 2026</p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 30px 0;" />
  <h2 style="font-size: 20px; margin: 0 0 16px 0;">Congratulations!</h2>
  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 24px 0;">
    <strong>${data.agentName}</strong> has been nominated for an award at Nebius.Build Demo Day!
  </p>
  <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0;"><strong>Agent:</strong> ${data.agentName}</p>
    ${data.agentUrl ? `<p style="margin: 0 0 8px 0;"><strong>URL:</strong> <a href="${data.agentUrl}" style="color: #ec4899;">${data.agentUrl}</a></p>` : ""}
    <p style="margin: 0 0 8px 0;"><strong>Categories:</strong> ${categories}</p>
    <p style="margin: 0;"><strong>Description:</strong> ${(data.description as string)?.slice(0, 200)}${(data.description as string)?.length > 200 ? "..." : ""}</p>
  </div>
  <div style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); padding: 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Please confirm you'll be there!</strong></p>
    <p style="color: rgba(255,255,255,0.7); margin: 0; line-height: 1.6;">If your project is selected, we'll call you on stage to demo live. <strong>Reply to this email</strong> to confirm you'll be attending in person so we know you'll be there when it's your turn.</p>
  </div>
  <h3 style="font-size: 16px; margin: 0 0 12px 0;">Next Steps</h3>
  <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px 0;">
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">1.</strong> <strong>Register for the Event on Luma</strong><br/>
        <a href="https://nebius.build" style="color: #ec4899;">nebius.build</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">2.</strong> <strong>Getting There</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">Nebius.Build is happening at SHACK15, San Francisco, CA.</span><br/>
        <a href="https://maps.app.goo.gl/a1NzbKaeSEFVFgt36" style="color: #ec4899;">View on Google Maps</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">3.</strong> <strong>Getting In</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">Have your Luma QR code ready at the door.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">4.</strong> <strong>Check If You Were Selected!</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">You'll get an email and your name and project will be listed on <a href="https://nebius.build" style="color: #ec4899;">nebius.build</a>.</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid rgba(255,255,255,0.1); vertical-align: top;">
        <strong style="color: #ec4899;">5.</strong> <strong>Didn't Apply with the Right URL? Want to Change Your Submission? It's Not Too Late.</strong><br/>
        <span style="color: rgba(255,255,255,0.7);">Just re-submit your nomination at <a href="https://nebius.build" style="color: #ec4899;">nebius.build</a>!</span>
      </td>
    </tr>
  </table>
  <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 30px 0;">
    Questions? Reply to this email or find us at <a href="https://nebius.build" style="color: #ec4899;">nebius.build</a>.
  </p>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 20px 0;" />
  <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">Nebius.Build &middot; ETHDenver 2026 &middot; March 14, San Francisco, CA</p>
</div>`;
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    let subject = "";
    let text = "";

    if (type === "nomination") {
      subject = `[Nebius.Build] New Nomination: ${data.agentName}`;
      text = [
        `New award nomination submitted!`,
        ``,
        `Agent: ${data.agentName}`,
        `URL: ${data.agentUrl || "N/A"}`,
        `Builder: ${data.builderName}`,
        `Email: ${data.email}`,
        `Description: ${data.description}`,
        `Demo Person: ${data.demoPersonName || "Same as above"}`,
        `Demo Person Email: ${data.demoPersonEmail || "Same as above"}`,
        `Phone: ${data.demoPersonPhone}`,
        `Categories: ${data.categories.join(", ")}`,
        `Custom Categories: ${data.customCategories?.join(", ") || "None"}`,
      ].join("\n");
    } else if (type === "speaker") {
      subject = `[Nebius.Build] New Speaker Application: ${data.name}`;
      text = [
        `New speaker application submitted!`,
        ``,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Twitter: ${data.twitter || "N/A"}`,
        `Company: ${data.company || "N/A"}`,
        `Topic: ${data.topic}`,
        `Format: ${data.format}`,
        `Bio: ${data.bio}`,
      ].join("\n");
    } else if (type === "people_application") {
      subject = `[Nebius.Build] New ${data.role} Application: ${data.name}`;
      text = [
        `New people application submitted!`,
        ``,
        `Role: ${data.role}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Timezone: ${data.timezone || "N/A"}`,
        `Availability: ${(data.availability || []).join(", ")}`,
        `Availability confirmed: ${data.canConfirmAvailability ? "Yes" : "No"}`,
        `Question 1: ${data.questionOne || "N/A"}`,
        `Question 2: ${data.questionTwo || "N/A"}`,
      ].join("\n");
    } else if (type === "sponsor") {
      subject = `[Nebius.Build] New Sponsor Inquiry: ${data.company}`;
      text = [
        `New sponsorship inquiry submitted!`,
        ``,
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${data.email}`,
        `Company: ${data.company}`,
        `Previous Sponsor: ${data.previousSponsor === "yes" ? "Yes" : "No"}`,
        `Telegram: ${data.telegram || "N/A"}`,
        `Donation/Sponsor Amount: ${data.donationAmount || "N/A"}`,
        `Plans: ${data.plans}`,
      ].join("\n");
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    // Send admin notification
    await sendEmail(NOTIFY_EMAIL, subject, text);

    // Send confirmation email to nominator
    if (type === "nomination" && data.email) {
      const confirmSubject = `${data.agentName} has been nominated for a award!`;
      const confirmText = `Congratulations! ${data.agentName} has been nominated for a award at Nebius.Build Demo Day & AI Agent Awards. Our AI judge will review all nominations and top projects will be selected to demo live on stage. Questions? Reply to this email or visit nebius.build.`;
      const confirmHtml = nominationConfirmationHtml(data);
      await sendEmail(data.email, confirmSubject, confirmText, confirmHtml, ["justin@ethdenver.com"]);
    }

    // Sync to Google Sheets via Apps Script webhook (fire-and-forget)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: sheetTabName(type),
          row: buildSheetRow(type, data),
        }),
      }).catch((err) =>
        console.error("[GOOGLE SHEETS SYNC] Failed:", err)
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
