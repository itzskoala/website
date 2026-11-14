// finishInBackground.js
const { hfTranscribe } = require("./transcribe");
const { hfSummarize } = require("./summarize");
const { sendVoicemailNotification } = require("./emailNotify");
const { updateTranscriptSummary, markEmailSent } = require("./db");
const { logHfError } = require("./logHfError");
const { MIN_CONFIDENCE_TO_EMAIL } = require("./config");

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
    try { await updateTranscriptSummary(sql, row.id, { transcript, summary, category, confidence }); }
    catch (err) { console.error("voicemail: failed to save transcript/summary", err); }
  }

  const worthEmailing = !!(moderation && moderation.worthEmailing && typeof confidence === "number" && confidence >= MIN_CONFIDENCE_TO_EMAIL);

  let emailSent = false;
  if (worthEmailing) {
    try {
      emailSent = await sendVoicemailNotification({ name, email, phone, isRepeat, category, confidence, summary, blobUrl, createdAt: row.created_at });
    } catch (err) {
      console.error("voicemail: email send failed", err);
    }
  } else {
    console.log("voicemail: skipped email (gated by moderation)", { id: row.id, category, confidence, worthEmailing: moderation && moderation.worthEmailing });
  }

  if (emailSent) {
    try { await markEmailSent(sql, row.id); }
    catch (err) { console.error("voicemail: failed to flag email_sent", err); }
  }
}

module.exports = { finishInBackground };
