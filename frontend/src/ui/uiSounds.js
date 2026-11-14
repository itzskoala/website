// uiSounds.js
import { $ } from "../utils/dom.js";
import { playClick, playToggle } from "./sound.js";

let muted = localStorage.getItem("uiSound") === "off", last = 0;

const hover = () => { const n = performance.now(); if (n - last < 90) return; last = n; if (!muted) playClick(); };
const tick = () => { if (!muted) playClick(); };
const swoosh = () => { if (!muted) playToggle(); };

const HOVER = ".side-nav a, .lib-list li, .card, .tile, .connect-card, .ctrl, .theme-btn, .photo, .ghost-btn, .play-big, .round-btn, .show-all, .track-row.link";
const CLICK = "a, button, .card, .tile, .lib-list li, .connect-card, .photo, .track-row.link";
document.addEventListener("pointerover", (e) => { if (e.target.closest && e.target.closest(HOVER)) hover(); }, { passive: true });
document.addEventListener("pointerdown", (e) => { const el = e.target.closest && e.target.closest(CLICK); if (!el) return; if (el.matches("[data-theme-toggle], [data-theme-toggle] *, [data-lang-toggle], [data-lang-toggle] *")) swoosh(); else tick(); }, { passive: true });

const btn = $("[data-sound-toggle]");
if (btn) {
  const reflect = () => { btn.classList.toggle("on", !muted); btn.setAttribute("title", muted ? "UI sounds: off" : "UI sounds: on"); };
  btn.addEventListener("click", () => { muted = !muted; localStorage.setItem("uiSound", muted ? "off" : "on"); reflect(); if (!muted) tick(); });
  reflect();
}
