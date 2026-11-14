// transcribe.js
const { InferenceClient } = require("@huggingface/inference");
const { HF_WHISPER_MODEL, HF_WHISPER_PROVIDER } = require("./config");

async function hfTranscribe(buffer, mimeType) {
  if (!process.env.HF_TOKEN) throw new Error("HF_TOKEN is not set");
  const hf = new InferenceClient(process.env.HF_TOKEN);
  const result = await hf.automaticSpeechRecognition({
    model: HF_WHISPER_MODEL,
    provider: HF_WHISPER_PROVIDER,
    data: new Blob([buffer], { type: mimeType || "audio/webm" }),
    task: "transcribe",
  });
  return (result && result.text) || null;
}

module.exports = { hfTranscribe };
