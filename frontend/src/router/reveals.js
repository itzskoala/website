// reveals.js
import { $ } from "../utils/dom.js";

const main = $("[data-main]");
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealIO = null;

export function setupReveals(rootEl) {
  if (prefersReduced) return;
  const els = [...rootEl.querySelectorAll(".hero, .shelf-head, .tile, .card, .track-row, .photo, .connect-card, .doc-card")];
  if (!els.length) return;
  const idx = new Map();
  els.forEach((el) => {
    const p = el.parentElement, i = idx.get(p) || 0;
    idx.set(p, i + 1);
    el.classList.add("reveal");
    el.style.setProperty("--ri", Math.min(i, 8));
  });
  if (!revealIO) {
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        revealIO.unobserve(el);
        el.classList.add("in");
        const done = () => { el.classList.remove("reveal", "in"); el.style.removeProperty("--ri"); el.removeEventListener("transitionend", done); };
        el.addEventListener("transitionend", done);
      });
    }, { root: main, rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
  }
  els.forEach((el) => revealIO.observe(el));
}
