// POST /api/voicemail — receives a recorded voice message (base64 audio + name/contact
// fields) from the Voicemail page, stores the audio in Vercel Blob and writes the row, then
// responds immediately. Transcription (open-weight Whisper) + summary (open-weight instruct
// model) — both via Hugging Face Inference Providers, no OpenAI — and the Resend notification
// email all happen *after* the response, via waitUntil(), so the client isn't stuck on
// "Sending…" for however long the AI calls take. That background work updates the same row.
//
// Every message is transcribed, summarized, and stored regardless of content — but the summary
// call also classifies + scores it (see SUMMARY_SYSTEM_PROMPT / MIN_CONFIDENCE_TO_EMAIL), and
// only genuine compliments/inquiries/comments/questions the model is actually confident about
// get emailed. Spam, abuse, junk recordings, and low-confidence calls stay DB-only, silently.
//
// Required env vars (see .env.example): DATABASE_URL, BLOB_READ_WRITE_TOKEN, HF_TOKEN,
// RESEND_API_KEY, NOTIFY_EMAIL, RESEND_FROM_EMAIL.

const { neon } = require("@neondatabase/serverless");
const { put } = require("@vercel/blob");
const { InferenceClient } = require("@huggingface/inference");
const { Resend } = require("resend");
const { waitUntil } = require("@vercel/functions");

const MAX_AUDIO_BYTES = 4_000_000; // keep comfortably under Vercel's 4.5MB function body limit
const HF_WHISPER_MODEL = process.env.HF_WHISPER_MODEL || "openai/whisper-large-v3";
// fal-ai is the provider Hugging Face's own model page suggests for this model — not every
// Inference Providers partner hosts every model, so the "model not supported" failures earlier
// were really "wrong provider for this model," not a broken request. Swappable via env var,
// same as the model id.
const HF_WHISPER_PROVIDER = process.env.HF_WHISPER_PROVIDER || "fal-ai";
// Verified live, not guessed — queried https://huggingface.co/api/models/<id>?expand[]=
// inferenceProviderMapping directly. meta-llama/Llama-3.2-3B-Instruct (voice-message.py's
// original pick) and mistralai/Mistral-7B-Instruct-v0.3 both came back with zero live providers
// on this account; Llama-3.1-8B-Instruct came back live on FOUR (novita, nscale, featherless-ai,
// deepinfra) — pick one of those three as a fallback if deepinfra ever goes stale.
const HF_SUMMARY_MODEL = process.env.HF_SUMMARY_MODEL || "meta-llama/Llama-3.1-8B-Instruct";
// Explicit, not "auto" — "auto" only considers providers in this account's enabled list at
// https://huggingface.co/settings/inference-providers, which doesn't cover chat models here
// (transcription only worked once fal-ai was named explicitly too, same pattern).
const HF_SUMMARY_PROVIDER = process.env.HF_SUMMARY_PROVIDER || "deepinfra";
// The transcript is left in whatever language it was spoken in (Whisper auto-detects; there's no
// task/language override in HF's current ASR parameters to force otherwise), but the summary
// always goes to Sri's inbox, so it's always written in English regardless of transcript language.
//
// Also does double duty as a moderation gate: every message is summarized and stored regardless,
// but only ones the model is actually confident are a genuine compliment/inquiry/comment/question
// (not spam, abuse, or a junk/test recording) get emailed — see MIN_CONFIDENCE_TO_EMAIL below.
const SUMMARY_SYSTEM_PROMPT = `You summarize and moderate voicemail transcripts left on a personal portfolio site. The transcript may be in any language — always write the summary in English regardless of what language it's in.

Respond with ONLY a single JSON object, no other text before or after it, no markdown code fences, in exactly this shape:
{"summary": "...", "category": "...", "worth_emailing": true or false, "confidence": 0.0 to 1.0}

- "summary": a short paragraph, then key points as bullets, then any clear action items. Plain text, concise, no markdown headers.
- "category": one of "compliment", "inquiry", "comment", "question", "spam", "inappropriate", "junk" (junk = silence, noise, a test recording, or otherwise no real message).
- "worth_emailing": true only for a genuine compliment, inquiry, comment, or question. False for spam, abusive/inappropriate content, or junk.
- "confidence": how confident you are in the worth_emailing decision specifically. Be conservative — if genuinely unsure, use a low confidence rather than guessing true.`;
// Even when the model says worth_emailing: true, require it to also be reasonably sure — a
// low-confidence "true" is exactly the ambiguous case worth erring toward NOT emailing over.
const MIN_CONFIDENCE_TO_EMAIL = 0.6;

// console.error's default depth collapses the SDK's nested httpResponse.body (where the actual
// provider error message lives, e.g. {error: {message: "..."}}) down to "[Object]" — pull it out
// explicitly so logs are actually useful.
function logHfError(label, err) {
  const detail = err && err.httpResponse && err.httpResponse.body;
  console.error(label, err && err.message, detail ? JSON.stringify(detail) : "");
}

function extFor(mimeType) {
  const m = String(mimeType || "");
  if (m.includes("mp4")) return "m4a";
  if (m.includes("ogg")) return "ogg";
  return "webm";
}

// Uses the official @huggingface/inference SDK rather than hand-rolled fetch calls — it knows
// the correct request shape per provider internally (every provider has slightly different
// conventions) and already retries on cold-start ("model is loading") by default, so no manual
// retry logic is needed here.
async function hfTranscribe(buffer, mimeType) {
  if (!process.env.HF_TOKEN) throw new Error("HF_TOKEN is not set");
  const hf = new InferenceClient(process.env.HF_TOKEN);
  const result = await hf.automaticSpeechRecognition({
    model: HF_WHISPER_MODEL,
    provider: HF_WHISPER_PROVIDER,
    // fal-ai builds a data: URL from this Blob and needs a real content-type to do it —
    // an untyped Blob ("" type) throws InferenceClientInputError before any request is sent.
    data: new Blob([buffer], { type: mimeType || "audio/webm" }),
    // Not part of HF's own documented ASR parameters, but confirmed (by reading the installed
    // fal-ai provider's source) to pass any extra property straight through to fal.ai's actual
    // Whisper API verbatim — this is fal.ai's own "transcribe" vs "translate" task switch, kept
    // explicit so a non-English recording comes back in its original language, not translated.
    // No `language` set — left to auto-detect.
    task: "transcribe",
  });
  return (result && result.text) || null;
}

// A small instruct model asked for "JSON only" won't always comply perfectly (markdown fences,
// stray leading/trailing text) — pull out the first {...} block rather than requiring the whole
// response to be clean JSON.
function extractJsonObject(text) {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (e) { return null; }
}

// Summarizes + moderates the transcript with an open-weight instruct model, also hosted on
// Hugging Face, via the same SDK's OpenAI-compatible chatCompletion(). Returns null on total
// failure; on a response that doesn't parse as the expected JSON shape, still returns the raw
// text as the summary but with worthEmailing: false — an unparseable response is exactly the
// kind of uncertain case that should default to not emailing, same as low confidence would.
async function hfSummarize(transcript, name) {
  if (!process.env.HF_TOKEN) throw new Error("HF_TOKEN is not set");
  const hf = new InferenceClient(process.env.HF_TOKEN);
  const result = await hf.chatCompletion({
    model: HF_SUMMARY_MODEL,
    provider: HF_SUMMARY_PROVIDER,
    messages: [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: `Voicemail from ${name}:\n\n${transcript}` },
    ],
    max_tokens: 500,
  });
  const raw = (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) || null;
  if (!raw) return null;

  const parsed = extractJsonObject(raw);
  if (parsed && typeof parsed.summary === "string") {
    return {
      summary: parsed.summary,
      category: typeof parsed.category === "string" ? parsed.category : null,
      confidence: typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : null,
      worthEmailing: parsed.worth_emailing === true,
    };
  }
  console.error("voicemail: summary response wasn't the expected JSON shape, treating as unparseable:", raw.slice(0, 300));
  return { summary: raw, category: null, confidence: null, worthEmailing: false };
}

// Same person/same name tracking: prefer a normalized email, fall back to digits-only phone.
function senderKeyFor(email, phone) {
  if (email && email.trim()) return "email:" + email.trim().toLowerCase();
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits) return "phone:" + digits;
  return null;
}

// Everything after the row exists: transcribe, summarize, write both back, email. Runs inside
// waitUntil() — the client already has its response by the time this executes, so none of it
// can block "Sent!". Each step stays independently best-effort (a transcription failure must
// still let the email go out, etc.) since the row + audio are already durably saved either way.
async function finishInBackground(sql, row, { name, email, phone, mimeType, isRepeat, blobUrl }) {
  let transcript = null, moderation = null;
  try { transcript = await hfTranscribe(row.audioBuffer, mimeType); }
  catch (err) { logHfError("voicemail: transcription failed", err); }

  if (transcript) {
    try { moderation = await hfSummarize(transcript, name); }
    catch (err) { logHfError("voicemail: summary failed", err); }
  }

  const summary = moderation && moderation.summary;
  const category = moderation && moderation.category;
  const confidence = moderation && moderation.confidence;

  if (transcript || moderation) {
    try { await sql`update voicemails set transcript = ${transcript}, summary = ${summary || null}, category = ${category || null}, confidence = ${confidence ?? null} where id = ${row.id}`; }
    catch (err) { console.error("voicemail: failed to save transcript/summary", err); }
  }

  // The actual moderation gate: only email when the model is both confident AND says this is
  // worth it (compliment/inquiry/comment/question) — never for spam/inappropriate/junk, and
  // never on a low-confidence guess either way. Everything still lives in the DB regardless.
  const worthEmailing = !!(moderation && moderation.worthEmailing && typeof confidence === "number" && confidence >= MIN_CONFIDENCE_TO_EMAIL);

  let emailSent = false;
  if (worthEmailing) {
    try {
      if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const dateStr = new Date(row.created_at).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
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
        emailSent = true;
      }
    } catch (err) {
      console.error("voicemail: email send failed", err);
    }
  } else {
    console.log("voicemail: skipped email (gated by moderation)", { id: row.id, category, confidence, worthEmailing: moderation && moderation.worthEmailing });
  }

  if (emailSent) {
    try { await sql`update voicemails set email_sent = true where id = ${row.id}`; }
    catch (err) { console.error("voicemail: failed to flag email_sent", err); }
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { name, email, mimeType, durationSeconds, audioBase64 } = req.body || {};
  // The frontend already restricts this field to digits as it's typed, but the API is callable
  // directly — strip to digits-only here too rather than trusting the client.
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
    const sql = neon(process.env.DATABASE_URL);

    const filename = `voicemails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFor(mimeType)}`;
    const blob = await put(filename, buffer, { access: "public", contentType: mimeType || "audio/webm" });

    const senderKey = senderKeyFor(email, phone);
    let isRepeat = false;
    if (senderKey) {
      const prior = await sql`select 1 from voicemails where sender_key = ${senderKey} limit 1`;
      isRepeat = prior.length > 0;
    }

    // transcript/summary start null — finishInBackground() fills them in after the response.
    const rows = await sql`
      insert into voicemails (name, email, phone, sender_key, is_repeat_sender, audio_url, duration_seconds)
      values (${name.trim()}, ${email || null}, ${phone || null}, ${senderKey}, ${isRepeat}, ${blob.url}, ${durationSeconds || null})
      returning id, created_at
    `;
    const row = rows[0];

    res.status(200).json({ ok: true, id: row.id });

    waitUntil(finishInBackground(sql, { ...row, audioBuffer: buffer }, { name: name.trim(), email, phone, mimeType, isRepeat, blobUrl: blob.url }));
  } catch (err) {
    console.error("voicemail: handler failed", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
