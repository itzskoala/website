// about.js
import { $, esc } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { INTERESTS } from "../data/interests.js";
import { SLIDESHOW_PHOTOS, SLIDESHOW_SPEED_MS } from "../data/slideshow.js";

export function viewAbout() {
  const slides = SLIDESHOW_PHOTOS.map((src, i) => `<img class="artist-slide${i === 0 ? " is-active" : ""}" src="${src}" alt="">`).join("");
  const headline = PROFILE.headline.map((line) => esc(line)).join("<br>");
  const bio = PROFILE.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  const interests = INTERESTS.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  return { tint: "#1a1a1a", html: `
    <div class="artist-hero" data-artist-hero>
      ${slides}
      <div class="artist-hero-overlay"></div>
      <div class="artist-hero-text">
        <h1 class="artist-name">${esc(PROFILE.name)}</h1>
        <button class="ghost-btn" data-route="connect">Follow</button>
      </div>
    </div>
    <div class="artist-tabs" data-artist-tabs>
      <button class="artist-tab is-active" data-artist-tab="about">About</button>
      <button class="artist-tab" data-artist-tab="favorites">My Favorites</button>
    </div>
    <div class="view-pad">
      <div class="artist-panel" data-artist-panel="about">
        <p class="artist-headline">${headline}</p>
        <div class="artist-bio">${bio}</div>
        <div class="section-label">What I'm into right now</div>
        <div class="tags">${interests}</div>
      </div>
      <div class="artist-panel" data-artist-panel="favorites" hidden>
        <p class="artist-favorites-placeholder">Music favorites, coming soon.</p>
      </div>
    </div>
  ` };
}

let slideTimer = null;

export function aboutEnter() {
  const hero = $("[data-artist-hero]");
  if (hero) {
    let i = 0;
    const slideEls = hero.querySelectorAll(".artist-slide");
    if (slideEls.length > 1) {
      slideTimer = setInterval(() => {
        slideEls[i].classList.remove("is-active");
        i = (i + 1) % slideEls.length;
        slideEls[i].classList.add("is-active");
      }, SLIDESHOW_SPEED_MS);
    }
  }
  const tabs = $("[data-artist-tabs]");
  if (tabs) {
    tabs.addEventListener("click", onTabClick);
  }
}

export function aboutTeardown() {
  if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
}

function onTabClick(e) {
  const btn = e.target.closest("[data-artist-tab]");
  if (!btn) return;
  const tabs = $("[data-artist-tabs]");
  tabs.querySelectorAll("[data-artist-tab]").forEach((b) => b.classList.toggle("is-active", b === btn));
  document.querySelectorAll("[data-artist-panel]").forEach((p) => { p.hidden = p.dataset.artistPanel !== btn.dataset.artistTab; });
}
