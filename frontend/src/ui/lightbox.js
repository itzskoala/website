// lightbox.js
import { $ } from "../utils/dom.js";
import { PHOTOS } from "../data/photos.js";

const lb = $("[data-lightbox]"), lbImg = $("[data-lb-img]"), lbCap = $("[data-lb-cap]");

export function openLightbox(i) {
  const p = PHOTOS[i];
  if (!p) return;
  lbImg.src = p.src; lbCap.textContent = p.cap; lb.classList.add("show");
}

export function closeLightbox() { lb.classList.remove("show"); lbImg.src = ""; }

lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-lb-close]")) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
