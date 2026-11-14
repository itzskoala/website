// voicemailHandler.js
const { waitUntil } = require("@vercel/functions");
const { getSql, senderKeyFor, hasPriorSender, insertVoicemail } = require("./db");
const { uploadVoicemailAudio } = require("./blobStorage");
const { finishInBackground } = require("./finishInBackground");
const { MAX_AUDIO_BYTES } = require("./config");

async function handleVoicemail(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { name, email, mimeType, durationSeconds, audioBase64 } = req.body || {};
  const phone = req.body && req.body.phone ? String(req.body.phone).replace(/\D/g, "") : "";
  if (!name || !String(name).trim()) { res.status(400).json({ error: "Name is required" }); return; }
  if (!(email && email.trim()) && !phone) { res.status(400).json({ error: "Email or phone is required" }); return; }
  if (!audioBase64) { res.status(400).json({ error: "Missing audio" }); return; }

  let buffer;
  try { buffer = Buffer.from(audioBase64, "base64"); }
  catch (e) { res.status(400).json({ error: "Invalid audio data" }); return; }
  if (!buffer.length) { res.status(400).json({ error: "Empty audio" }); return; }
  if (buffer.length > MAX_AUDIO_BYTES) { res.status(413).json({ error: "Recording too large" }); return; }

  try {
    const sql = getSql();

    const blob = await uploadVoicemailAudio(buffer, mimeType);

    const senderKey = senderKeyFor(email, phone);
    const isRepeat = await hasPriorSender(sql, senderKey);

    const row = await insertVoicemail(sql, {
      name: name.trim(), email, phone, senderKey, isRepeat,
      audioUrl: blob.url, durationSeconds,
    });

    res.status(200).json({ ok: true, id: row.id });

    waitUntil(finishInBackground(sql, { ...row, audioBuffer: buffer }, { name: name.trim(), email, phone, mimeType, isRepeat, blobUrl: blob.url }));
  } catch (err) {
    console.error("voicemail: handler failed", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { handleVoicemail };
