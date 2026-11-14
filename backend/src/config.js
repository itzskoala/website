// config.js
module.exports = {
  MAX_AUDIO_BYTES: 4_000_000,
  HF_WHISPER_MODEL: process.env.HF_WHISPER_MODEL || "openai/whisper-large-v3",
  HF_WHISPER_PROVIDER: process.env.HF_WHISPER_PROVIDER || "fal-ai",
  HF_SUMMARY_MODEL: process.env.HF_SUMMARY_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
  HF_SUMMARY_PROVIDER: process.env.HF_SUMMARY_PROVIDER || "deepinfra",
  MIN_CONFIDENCE_TO_EMAIL: 0.6,
};
