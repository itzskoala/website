// voicemail.js
import { grad } from "../utils/dom.js";
import { micSvg, sendSvg, playSvg, voicemailSvg } from "../utils/icons.js";

export function viewVoicemail() {
  return { tint: "#3a0d10", hero: "#5a0014", html: `
    <div class="hero" style="--hero-c:#5a0014;padding-top:48px">
      <div class="hero-cover" style="background:${grad("#7a0019", "#33000a")}">${voicemailSvg}</div>
      <div>
        <div class="hero-kind">Playlist</div>
        <h1 class="hero-title">Voicemail</h1>
        <div class="hero-meta">Send me a voice message in whatever language you wish! <span aria-hidden="true">🎙️</span></div>
      </div>
    </div>
    <div class="action-bar">
      <a class="play-big" data-project="voicenotes" title="Click to see how I made this." aria-label="View the code on GitHub">${playSvg}</a>
    </div>
    <div class="view-pad">
      <div class="vm-card">
        <form class="vm-fields" data-vm-form novalidate>
          <label class="vm-field">
            <span>Your name</span>
            <input type="text" id="vm-name" name="name" autocomplete="name" placeholder="Full name" data-vm-input required>
            <small class="vm-error" data-vm-error="name" hidden></small>
          </label>
          <label class="vm-field">
            <span>Email</span>
            <input type="email" id="vm-email" name="email" autocomplete="email" placeholder="name@example.com" data-vm-input>
            <small class="vm-error" data-vm-error="email" hidden></small>
          </label>
          <label class="vm-field">
            <span>Phone number</span>
            <input type="tel" id="vm-phone" name="phone" autocomplete="tel" inputmode="numeric" placeholder="5555555555" data-vm-input data-vm-phone>
          </label>
          <small class="vm-error" data-vm-error="contact" hidden></small>
        </form>

        <div class="vm-recorder">
          <button type="button" class="vm-mic" data-vm-mic disabled aria-label="Requesting microphone access">
            ${micSvg}<span class="vm-mic-ring" aria-hidden="true"></span>
          </button>
          <div class="vm-status" data-vm-status>Requesting microphone access…</div>
          <div class="vm-timer" data-vm-timer hidden>0:00</div>
          <button type="button" class="ghost-btn" data-vm-retry hidden>Allow microphone access</button>
        </div>

        <div class="vm-preview" data-vm-preview hidden>
          <audio controls data-vm-audio></audio>
          <div class="vm-preview-actions">
            <button type="button" class="ghost-btn" data-vm-rerecord>Record again</button>
            <button type="button" class="play-big vm-send" data-vm-send aria-label="Send voicemail">${sendSvg}</button>
          </div>
          <div class="vm-send-status" data-vm-send-status hidden></div>
        </div>
      </div>
    </div>
  ` };
}
