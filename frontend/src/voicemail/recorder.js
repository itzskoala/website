// recorder.js
import { $ } from "../utils/dom.js";
import { tstr } from "../i18n/translate.js";

const VM_MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
const VM_MAX_SECONDS = 300;

let vmStream = null, vmRecorder = null, vmChunks = [];
export let vmRecording = false;
let vmTimerId = null, vmStartedAt = 0, vmDuration = 0, vmBlobUrl = null, vmBlob = null, vmTouched = false, vmSendingBlob = null;

function fmt(s) { return isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00"; }

function vmPickMimeType() {
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return "";
  return VM_MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}
function vmSupported() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
function vmSetStatus(text) { const el = $("[data-vm-status]"); if (el) el.textContent = tstr(text); }
function vmErrorMessage(err) {
  const name = err && err.name;
  if (name === "NotAllowedError" || name === "PermissionDeniedError") return "Microphone access was denied. Allow it in your browser’s site settings, then try again.";
  if (name === "NotFoundError" || name === "DevicesNotFoundError") return "No microphone was found on this device.";
  if (name === "NotReadableError" || name === "TrackStartError") return "Your microphone is already in use by another app.";
  return "Couldn’t access the microphone. Please try again.";
}

export function vmEnter() {
  vmRecording = false;
  vmTouched = false;
  const mic = $("[data-vm-mic]"), retry = $("[data-vm-retry]");
  if (!mic) return;
  if (retry) retry.hidden = true;
  if (!vmSupported()) {
    mic.disabled = true; mic.classList.remove("is-ready", "is-recording", "is-denied");
    mic.setAttribute("aria-label", "Voice recording not supported");
    vmSetStatus("Voice recording isn’t supported in this browser.");
    return;
  }
  mic.disabled = false; mic.classList.add("is-ready"); mic.classList.remove("is-recording", "is-denied");
  mic.setAttribute("aria-label", "Start recording");
  vmSetStatus("Tap the mic to record — your browser will ask for microphone access.");
}

export function vmTeardown() {
  if (vmTimerId) { clearInterval(vmTimerId); vmTimerId = null; }
  if (vmRecorder && vmRecorder.state !== "inactive") { try { vmRecorder.stop(); } catch (e) {} }
  if (vmStream) { vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; }
  vmRecorder = null; vmChunks = []; vmRecording = false;
  if (vmBlobUrl) { URL.revokeObjectURL(vmBlobUrl); vmBlobUrl = null; }
}

function vmShowDenied(err) {
  const mic = $("[data-vm-mic]"), retry = $("[data-vm-retry]"); if (!mic) return;
  mic.disabled = false; mic.classList.remove("is-ready", "is-recording"); mic.classList.add("is-denied");
  mic.setAttribute("aria-label", "Microphone access denied");
  if (retry) retry.hidden = false;
  vmSetStatus(vmErrorMessage(err));
}

function vmValidate() {
  const nameEl = $("#vm-name"), emailEl = $("#vm-email"), phoneEl = $("#vm-phone");
  const nameErr = $("[data-vm-error='name']"), emailErr = $("[data-vm-error='email']"), contactErr = $("[data-vm-error='contact']");
  let ok = true;
  const hasName = !!(nameEl && nameEl.value.trim());
  if (nameErr) { nameErr.hidden = hasName; nameErr.textContent = tstr("Please tell me your name."); }
  if (nameEl) nameEl.setAttribute("aria-invalid", String(!hasName));
  if (!hasName) ok = false;
  const emailVal = emailEl ? emailEl.value.trim() : "";
  const emailValid = !emailVal || (emailEl && emailEl.checkValidity());
  if (emailErr) { emailErr.hidden = emailValid; emailErr.textContent = tstr("That doesn’t look like a valid email."); }
  if (emailEl) emailEl.setAttribute("aria-invalid", String(!emailValid));
  if (!emailValid) ok = false;
  const hasContact = !!(emailVal || (phoneEl && phoneEl.value.trim()));
  if (contactErr) { contactErr.hidden = hasContact; contactErr.textContent = tstr("Leave an email or phone number so I can get back to you."); }
  if (!hasContact) ok = false;
  return ok;
}

export function vmStartRecording() {
  const mic = $("[data-vm-mic]");
  if (!mic || mic.disabled || vmRecording) return;
  vmTouched = true;
  if (!vmValidate()) { vmSetStatus("Fill in your name and a way to reach you before recording."); return; }
  mic.disabled = true;
  const retry = $("[data-vm-retry]"); if (retry) retry.hidden = true;
  vmSetStatus("Requesting microphone access…");
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    vmStream = stream;
    vmChunks = [];
    const mimeType = vmPickMimeType();
    try { vmRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream); }
    catch (e) { vmSetStatus("This browser can’t record audio."); vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; return; }
    vmRecorder.ondataavailable = (e) => { if (e.data && e.data.size) vmChunks.push(e.data); };
    vmRecorder.onstop = vmFinishRecording;
    vmRecorder.onerror = () => { vmSetStatus("Recording failed. Please try again."); vmStopRecording(); };
    vmRecorder.start();
    vmRecording = true;
    vmStartedAt = Date.now();
    vmClearPreview();
    const mic2 = $("[data-vm-mic]");
    mic2.disabled = false;
    mic2.classList.remove("is-ready"); mic2.classList.add("is-recording");
    mic2.setAttribute("aria-label", "Stop recording");
    vmSetStatus("Recording… tap to stop.");
    const timerEl = $("[data-vm-timer]"); if (timerEl) { timerEl.hidden = false; timerEl.textContent = "0:00"; }
    vmTimerId = setInterval(() => {
      const elapsed = (Date.now() - vmStartedAt) / 1000;
      const t = $("[data-vm-timer]"); if (t) t.textContent = fmt(elapsed);
      if (elapsed >= VM_MAX_SECONDS) vmStopRecording();
    }, 250);
  }).catch((err) => { vmShowDenied(err); });
}

export function vmStopRecording() {
  if (vmRecorder && vmRecorder.state !== "inactive") vmRecorder.stop();
  else vmFinishRecording();
  if (vmStream) { vmStream.getTracks().forEach((t) => t.stop()); vmStream = null; }
  if (vmTimerId) { clearInterval(vmTimerId); vmTimerId = null; }
  vmRecording = false;
}

function vmFinishRecording() {
  const mic = $("[data-vm-mic]");
  if (!mic) return;
  mic.classList.remove("is-recording"); mic.classList.add("is-ready");
  mic.setAttribute("aria-label", "Start recording");
  const timerEl = $("[data-vm-timer]"); if (timerEl) timerEl.hidden = true;
  if (!vmChunks.length) { vmSetStatus("Ready when you are — tap the mic to record."); return; }
  vmDuration = Math.round((Date.now() - vmStartedAt) / 1000);
  vmBlob = new Blob(vmChunks, { type: (vmRecorder && vmRecorder.mimeType) || "audio/webm" });
  if (vmBlobUrl) URL.revokeObjectURL(vmBlobUrl);
  vmBlobUrl = URL.createObjectURL(vmBlob);
  const audio = $("[data-vm-audio]"), preview = $("[data-vm-preview]"), sendBtn = $("[data-vm-send]"), sendStatus = $("[data-vm-send-status]");
  if (audio) audio.src = vmBlobUrl;
  if (sendBtn) { sendBtn.disabled = false; sendBtn.classList.remove("is-sent"); }
  if (sendStatus) sendStatus.hidden = true;
  if (preview) preview.hidden = false;
  vmSetStatus("Got it! Preview your message below, then hit send.");
}

function vmClearPreview() {
  const preview = $("[data-vm-preview]"), audio = $("[data-vm-audio]");
  if (preview) preview.hidden = true;
  if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
  if (vmBlobUrl) { URL.revokeObjectURL(vmBlobUrl); vmBlobUrl = null; }
  vmBlob = null;
}

export function vmRerecord() {
  vmClearPreview();
  vmSetStatus("Ready when you are — tap the mic to record.");
}

function vmBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function vmSend() {
  if (!vmBlob || vmSendingBlob === vmBlob) return;
  if (!vmValidate()) { vmSetStatus("Fill in your name and a way to reach you before sending."); return; }
  const thisBlob = vmBlob;
  vmSendingBlob = thisBlob;
  const sendBtn = $("[data-vm-send]"), sendStatus = $("[data-vm-send-status]");
  if (sendBtn) sendBtn.disabled = true;
  if (sendStatus) { sendStatus.hidden = false; sendStatus.textContent = tstr("Sending…"); }
  const name = $("#vm-name") ? $("#vm-name").value.trim() : "";
  const email = $("#vm-email") ? $("#vm-email").value.trim() : "";
  const phone = $("#vm-phone") ? $("#vm-phone").value.trim() : "";
  const mimeType = thisBlob.type || "audio/webm";
  vmBlobToBase64(thisBlob).then((audioBase64) => fetch("/api/voicemail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, mimeType, durationSeconds: vmDuration, audioBase64 }),
  })).then((res) => { if (!res.ok) throw new Error("bad status"); return res.json().catch(() => ({})); })
    .then(() => {
      if (vmSendingBlob === thisBlob) vmSendingBlob = null;
      if (sendBtn && vmBlob === thisBlob) sendBtn.classList.add("is-sent");
      if (sendStatus && vmBlob === thisBlob) sendStatus.textContent = tstr("Sent! Thanks — I’ll get back to you.");
    })
    .catch(() => {
      if (vmSendingBlob === thisBlob) vmSendingBlob = null;
      if (sendBtn && vmBlob === thisBlob) sendBtn.disabled = false;
      if (sendStatus && vmBlob === thisBlob) sendStatus.textContent = tstr("Couldn’t reach the server — please try again in a moment.");
    });
}

document.addEventListener("submit", (e) => { if (e.target && e.target.hasAttribute && e.target.hasAttribute("data-vm-form")) e.preventDefault(); });
document.addEventListener("input", (e) => { if (vmTouched && e.target.closest && e.target.closest("[data-vm-input]")) vmValidate(); });
document.addEventListener("input", (e) => {
  const phoneEl = e.target.closest && e.target.closest("[data-vm-phone]");
  if (!phoneEl) return;
  const digitsOnly = phoneEl.value.replace(/\D/g, "");
  if (digitsOnly === phoneEl.value) return;
  const pos = phoneEl.selectionStart - (phoneEl.value.slice(0, phoneEl.selectionStart).match(/\D/g) || []).length;
  phoneEl.value = digitsOnly;
  phoneEl.setSelectionRange(pos, pos);
});
