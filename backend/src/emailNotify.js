// emailNotify.js
const { Resend } = require("resend");

async function sendVoicemailNotification({ name, email, phone, isRepeat, category, confidence, summary, blobUrl, createdAt }) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) return false;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dateStr = new Date(createdAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Voicemail <onboarding@resend.dev>",
    to: process.env.NOTIFY_EMAIL,
    subject: `New voicemail from ${name}${isRepeat ? " (repeat sender)" : ""}`,
    text: [
      `From: ${name}`,
      email ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      `Date: ${dateStr}`,
      isRepeat ? "This person has left a message before." : null,
      category ? `Category: ${category} (confidence ${confidence.toFixed(2)})` : null,
      "",
      "Summary:", summary || "(summary unavailable — see the recording)",
      "",
      `Recording: ${blobUrl}`,
    ].filter(Boolean).join("\n"),
  });
  return true;
}

module.exports = { sendVoicemailNotification };
