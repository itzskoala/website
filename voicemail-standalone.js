const { neon } = require("@neondatabase/serverless");
const { put } = require("@vercel/blob");
const { InferenceClient } = require("@huggingface/inference");
const { Resend } = require("resend");
const { waitUntil } = require("@vercel/functions");

const MAX_AUDIO_BYTES = 4_000_000;
const MIN_CONFIDENCE_TO_EMAIL = 0.6;

const config = {
  whisperModel: process.env.HF_WHISPER_MODEL || "openai/whisper-large-v3",
  whisperProvider: process.env.HF_WHISPER_PROVIDER || "fal-ai",
  summaryModel: process.env.HF_SUMMARY_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
  summaryProvider: process.env.HF_SUMMARY_PROVIDER || "deepinfra",
  notifyEmail: process.env.NOTIFY_EMAIL,
  fromEmail: process.env.RESEND_FROM_EMAIL || "Voicemail <onboarding@resend.dev>",
};

const SUMMARY_PROMPT = `You summarize and moderate voicemail transcripts left on a personal portfolio site. The transcript may be in any language — always write the summary in English regardless of what language it's in.

Respond with ONLY a single JSON object, no other text before or after it, no markdown code fences, in exactly this shape:
{"summary": "...", "category": "...", "worth_emailing": true or false, "confidence": 0.0 to 1.0}

- "summary": a short paragraph, then key points as bullets, then any clear action items. Plain text, concise, no markdown headers.
- "category": one of "compliment", "inquiry", "comment", "question", "spam", "inappropriate", "junk" (junk = silence, noise, a test recording, or otherwise no real message).
- "worth_emailing": true only for a genuine compliment, inquiry, comment, or question. False for spam, abusive/inappropriate content, or junk.
- "confidence": how confident you are in the worth_emailing decision specifically. Be conservative — if genuinely unsure, use a low confidence rather than guessing true.`;

function audioExtension(mimeType) {
  const type = String(mimeType || "");
  if (type.includes("mp4")) return "m4a";
  if (type.includes("ogg")) return "ogg";
  return "webm";
}

function senderKey(email, phone) {
  if (email) return `email:${email.trim().toLowerCase()}`;
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `phone:${digits}` : null;
}

function extractJson(text) {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return null;
  }
}

class Transcriber {
  constructor(client) {
    this.client = client;
  }

  async transcribe(buffer, mimeType) {
    const result = await this.client.automaticSpeechRecognition({
      model: config.whisperModel,
      provider: config.whisperProvider,
      data: new Blob([buffer], { type: mimeType || "audio/webm" }),
      task: "transcribe",
    });
    return (result && result.text) || null;
  }
}

class Summarizer {
  constructor(client) {
    this.client = client;
  }

  async summarize(transcript, senderName) {
    const result = await this.client.chatCompletion({
      model: config.summaryModel,
      provider: config.summaryProvider,
      messages: [
        { role: "system", content: SUMMARY_PROMPT },
        { role: "user", content: `Voicemail from ${senderName}:\n\n${transcript}` },
      ],
      max_tokens: 500,
    });

    const raw = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
    if (!raw) return null;

    const parsed = extractJson(raw);
    if (parsed && typeof parsed.summary === "string") {
      return {
        summary: parsed.summary,
        category: typeof parsed.category === "string" ? parsed.category : null,
        confidence: typeof parsed.confidence === "number" ? Math.min(1, Math.max(0, parsed.confidence)) : null,
        worthEmailing: parsed.worth_emailing === true,
      };
    }

    return { summary: raw, category: null, confidence: null, worthEmailing: false };
  }
}

class VoicemailRepository {
  constructor(sql) {
    this.sql = sql;
  }

  async hasPriorMessageFrom(key) {
    if (!key) return false;
    const rows = await this.sql`select 1 from voicemails where sender_key = ${key} limit 1`;
    return rows.length > 0;
  }

  async create(entry) {
    const rows = await this.sql`
      insert into voicemails (name, email, phone, sender_key, is_repeat_sender, audio_url, duration_seconds)
      values (${entry.name}, ${entry.email}, ${entry.phone}, ${entry.senderKey}, ${entry.isRepeat}, ${entry.audioUrl}, ${entry.durationSeconds})
      returning id, created_at
    `;
    return rows[0];
  }

  async saveSummary(id, { transcript, summary, category, confidence }) {
    await this.sql`
      update voicemails
      set transcript = ${transcript}, summary = ${summary}, category = ${category}, confidence = ${confidence}
      where id = ${id}
    `;
  }

  async markEmailed(id) {
    await this.sql`update voicemails set email_sent = true where id = ${id}`;
  }
}

class Notifier {
  constructor(resend) {
    this.resend = resend;
  }

  async notify({ name, email, phone, date, isRepeat, category, confidence, summary, audioUrl }) {
    await this.resend.emails.send({
      from: config.fromEmail,
      to: config.notifyEmail,
      subject: `New voicemail from ${name}${isRepeat ? " (repeat sender)" : ""}`,
      text: [
        `From: ${name}`,
        email ? `Email: ${email}` : null,
        phone ? `Phone: ${phone}` : null,
        `Date: ${date}`,
        isRepeat ? "This person has left a message before." : null,
        category ? `Category: ${category} (confidence ${confidence.toFixed(2)})` : null,
        "",
        "Summary:",
        summary || "(summary unavailable — see the recording)",
        "",
        `Recording: ${audioUrl}`,
      ].filter(Boolean).join("\n"),
    });
  }
}

async function processVoicemail({ repository, transcriber, summarizer, notifier, audioBuffer, mimeType, row, name, email, phone, isRepeat, audioUrl }) {
  let transcript = null;
  try {
    transcript = await transcriber.transcribe(audioBuffer, mimeType);
  } catch (error) {
    console.error("transcription failed", error);
  }

  let result = null;
  if (transcript) {
    try {
      result = await summarizer.summarize(transcript, name);
    } catch (error) {
      console.error("summary failed", error);
    }
  }

  if (transcript || result) {
    await repository.saveSummary(row.id, {
      transcript,
      summary: result ? result.summary : null,
      category: result ? result.category : null,
      confidence: result ? result.confidence : null,
    });
  }

  const shouldEmail = Boolean(
    result && result.worthEmailing && typeof result.confidence === "number" && result.confidence >= MIN_CONFIDENCE_TO_EMAIL
  );
  if (!shouldEmail || !config.notifyEmail) return;

  try {
    await notifier.notify({
      name,
      email,
      phone,
      isRepeat,
      date: new Date(row.created_at).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
      category: result.category,
      confidence: result.confidence,
      summary: result.summary,
      audioUrl,
    });
    await repository.markEmailed(row.id);
  } catch (error) {
    console.error("email failed", error);
  }
}

function validate(body) {
  const name = body && body.name && body.name.trim();
  if (!name) return "Name is required";
  const email = (body.email && body.email.trim()) || null;
  const phone = body.phone ? String(body.phone).replace(/\D/g, "") : null;
  if (!email && !phone) return "Email or phone is required";
  if (!body.audioBase64) return "Missing audio";
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const validationError = validate(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { name, mimeType, durationSeconds, audioBase64 } = req.body;
  const email = (req.body.email && req.body.email.trim()) || null;
  const phone = req.body.phone ? String(req.body.phone).replace(/\D/g, "") : null;

  const audioBuffer = Buffer.from(audioBase64, "base64");
  if (!audioBuffer.length || audioBuffer.length > MAX_AUDIO_BYTES) {
    return res.status(413).json({ error: "Invalid recording size" });
  }

  const sql = neon(process.env.DATABASE_URL);
  const hf = new InferenceClient(process.env.HF_TOKEN);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const repository = new VoicemailRepository(sql);
  const transcriber = new Transcriber(hf);
  const summarizer = new Summarizer(hf);
  const notifier = new Notifier(resend);

  try {
    const filename = `voicemails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${audioExtension(mimeType)}`;
    const blob = await put(filename, audioBuffer, { access: "public", contentType: mimeType || "audio/webm" });

    const key = senderKey(email, phone);
    const isRepeat = await repository.hasPriorMessageFrom(key);
    const row = await repository.create({
      name: name.trim(),
      email,
      phone,
      senderKey: key,
      isRepeat,
      audioUrl: blob.url,
      durationSeconds: durationSeconds || null,
    });

    res.status(200).json({ ok: true, id: row.id });

    waitUntil(
      processVoicemail({
        repository,
        transcriber,
        summarizer,
        notifier,
        audioBuffer,
        mimeType,
        row,
        name: name.trim(),
        email,
        phone,
        isRepeat,
        audioUrl: blob.url,
      })
    );
  } catch (error) {
    console.error("voicemail handler failed", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
