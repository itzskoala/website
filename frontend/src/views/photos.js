// photos.js
import { esc } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { PHOTOS } from "../data/photos.js";

export function viewPhotos() {
  return { tint: "#5a3a10", hero: "#8a5a14", html: `
    <div class="hero" style="--hero-c:#8a5a14;padding-top:48px">
      <div class="hero-cover"><img src="./assets/covers/photography.jpg" alt=""></div>
      <div>
        <div class="hero-kind">Playlist</div>
        <h1 class="hero-title">Photography</h1>
        <div class="hero-meta">${esc(PROFILE.name)} · the world through my eyes</div>
      </div>
    </div>
    <div class="view-pad"><div class="photo-grid">${PHOTOS.map((p, i) => `
      <div class="photo" data-photo="${i}">
        <img src="${p.src}" alt="${esc(p.cap)}" loading="lazy">
        <div class="photo-cap">${esc(p.cap)}</div>
      </div>`).join("")}</div></div>
  ` };
}
