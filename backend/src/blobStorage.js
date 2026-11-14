// blobStorage.js
const { put } = require("@vercel/blob");

function extFor(mimeType) {
  const m = String(mimeType || "");
  if (m.includes("mp4")) return "m4a";
  if (m.includes("ogg")) return "ogg";
  return "webm";
}

async function uploadVoicemailAudio(buffer, mimeType) {
  const filename = `voicemails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFor(mimeType)}`;
  return put(filename, buffer, { access: "public", contentType: mimeType || "audio/webm" });
}

module.exports = { uploadVoicemailAudio, extFor };
