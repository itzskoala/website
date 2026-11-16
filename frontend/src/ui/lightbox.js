// lightbox.js
import { $ } from "../utils/dom.js";
import { PHOTOS } from "../data/photos.js";

const lb = $("[data-lightbox]"), lbImg = $("[data-lb-img]"), lbCap = $("[data-lb-cap]");
let curIdx = -1;

export function openLightbox(i) {
  const p = PHOTOS[i];
  if (!p) return;
  curIdx = i;
  lbImg.src = p.src; lbCap.textContent = p.cap; lb.classList.add("show");
}

export function closeLightbox() { lb.classList.remove("show"); lbImg.src = ""; curIdx = -1; }

function showDelta(d) { if (curIdx !== -1) openLightbox((curIdx + d + PHOTOS.length) % PHOTOS.length); }

lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target.closest("[data-lb-close]")) return closeLightbox();
  if (e.target.closest("[data-lb-prev]")) return showDelta(-1);
  if (e.target.closest("[data-lb-next]")) return showDelta(1);
});
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowLeft") showDelta(-1);
  else if (e.key === "ArrowRight") showDelta(1);
});
