// about.js
import { esc } from "../utils/dom.js";
import { playSvg } from "../utils/icons.js";
import { PROFILE } from "../data/profile.js";
import { PROJECTS } from "../data/projects/index.js";

export function viewAbout() {
  const popular = PROJECTS.slice(0, 4).map((p, i) => `
    <div class="track-row link" data-project="${p.id}">
      <span class="track-idx">${i + 1}</span>
      <div class="track-main"><div class="track-name">${esc(p.title)}</div><div class="track-sub">${esc(p.kind)}</div></div>
      <span class="track-meta">${esc(p.tags[0] || "")}</span>
    </div>`).join("");
  return { tint: "#7a001933", hero: "#5a0013", html: `
    <div class="hero" style="--hero-c:#5a0013">
      <div class="hero-cover round"><img src="${PROFILE.headshot}" alt="Sri Kotala"></div>
      <div>
        <h1 class="hero-title">${esc(PROFILE.name)}</h1>
        <div class="hero-meta">${esc(PROFILE.tagline)}</div>
      </div>
    </div>
    <div class="action-bar">
      <button class="play-big" data-play-first aria-label="Play">${playSvg}</button>
      <button class="ghost-btn" data-route="connect">Follow</button>
    </div>
    <div class="view-pad">
      <div class="about-card">
        <img src="./assets/headshot.jpg" alt="Sri Kotala" loading="lazy">
        <div><h2 class="about-lead">${PROFILE.intro}</h2>${PROFILE.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </div>
      <div class="section-label">Popular</div>
      <div class="tracklist">${popular}</div>
    </div>
  ` };
}
