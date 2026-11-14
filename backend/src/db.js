// db.js
const { neon } = require("@neondatabase/serverless");

function getSql() {
  return neon(process.env.DATABASE_URL);
}

function senderKeyFor(email, phone) {
  if (email && email.trim()) return "email:" + email.trim().toLowerCase();
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits) return "phone:" + digits;
  return null;
}

async function hasPriorSender(sql, senderKey) {
  if (!senderKey) return false;
  const prior = await sql`select 1 from voicemails where sender_key = ${senderKey} limit 1`;
  return prior.length > 0;
}

async function insertVoicemail(sql, { name, email, phone, senderKey, isRepeat, audioUrl, durationSeconds }) {
  const rows = await sql`
    insert into voicemails (name, email, phone, sender_key, is_repeat_sender, audio_url, duration_seconds)
    values (${name}, ${email || null}, ${phone || null}, ${senderKey}, ${isRepeat}, ${audioUrl}, ${durationSeconds || null})
    returning id, created_at
  `;
  return rows[0];
}

async function updateTranscriptSummary(sql, id, { transcript, summary, category, confidence }) {
  await sql`update voicemails set transcript = ${transcript}, summary = ${summary || null}, category = ${category || null}, confidence = ${confidence ?? null} where id = ${id}`;
}

async function markEmailSent(sql, id) {
  await sql`update voicemails set email_sent = true where id = ${id}`;
}

module.exports = { getSql, senderKeyFor, hasPriorSender, insertVoicemail, updateTranscriptSummary, markEmailSent };
