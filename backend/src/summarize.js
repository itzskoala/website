// summarize.js
const { InferenceClient } = require("@huggingface/inference");
const { HF_SUMMARY_MODEL, HF_SUMMARY_PROVIDER } = require("./config");
const { extractJsonObject } = require("./jsonExtract");

const SUMMARY_SYSTEM_PROMPT = `You summarize and moderate voicemail transcripts left on a personal portfolio site. The transcript may be in any language — always write the summary in English regardless of what language it's in.

Respond with ONLY a single JSON object, no other text before or after it, no markdown code fences, in exactly this shape:
{"summary": "...", "category": "...", "worth_emailing": true or false, "confidence": 0.0 to 1.0}

- "summary": a short paragraph, then key points as bullets, then any clear action items. Plain text, concise, no markdown headers.
- "category": one of "compliment", "inquiry", "comment", "question", "spam", "inappropriate", "junk" (junk = silence, noise, a test recording, or otherwise no real message).
- "worth_emailing": true only for a genuine compliment, inquiry, comment, or question. False for spam, abusive/inappropriate content, or junk.
- "confidence": how confident you are in the worth_emailing decision specifically. Be conservative — if genuinely unsure, use a low confidence rather than guessing true.`;

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

module.exports = { hfSummarize };
