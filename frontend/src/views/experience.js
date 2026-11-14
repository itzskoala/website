// experience.js
import { esc, grad } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { EXPERIENCE } from "../data/experience.js";

function trackRows(list) {
  return list.map((e, i) => `
    <div class="track-row">
      <span class="track-idx">${i + 1}</span>
      <div class="track-main"><div class="track-name">${esc(e.name)}</div>${e.sub ? `<div class="track-sub">${esc(e.sub)}</div>` : ""}</div>
      <span class="track-meta">${esc(e.meta || "")}</span>
    </div>`).join("");
}

export function viewExperience() {
  const docs = EXPERIENCE.documents.map((d) => `
    <div class="card" data-open="${esc(d.url)}">
      <div class="card-art doc-art" style="background:${grad(d.c1, d.c2)}">${d.thumb ? `<img src="${d.thumb}" alt="" loading="lazy" class="${d.thumbFit === "contain" ? "fit-contain" : "fit-cover"}">` : `<span style="font-size:2rem">📄</span>`}</div>
      <div class="card-title">${esc(d.title)}</div>
      <div class="card-sub">${esc(d.kind)} ↗</div>
    </div>`).join("");
  return { tint: "#2a1840", hero: "#5b2a6e", html: `
    <div class="hero" style="--hero-c:#5b2a6e;padding-top:48px">
      <div class="hero-cover"><img src="./assets/covers/experience.jpg" alt=""></div>
      <div>
        <div class="hero-kind">Playlist</div>
        <h1 class="hero-title">Experience</h1>
        <div class="hero-meta">${esc(PROFILE.name)} · work, education, research & awards</div>
      </div>
    </div>
    <div class="view-pad">
      <div class="section-label">Work Experience</div><div class="tracklist">${trackRows(EXPERIENCE.work)}</div>
      <div class="section-label">Education</div>
      <div class="edu-block">
        <img class="edu-logo" src="./assets/umn.svg" alt="University of Minnesota" loading="lazy">
        <div class="tracklist">${trackRows(EXPERIENCE.education)}</div>
      </div>
      <div class="section-label">Research</div><div class="tracklist">${trackRows(EXPERIENCE.research)}</div>
      <div class="section-label">Awards & Achievements</div><div class="tracklist">${trackRows(EXPERIENCE.awards)}</div>
      <div class="section-label">Documents</div><div class="grid">${docs}</div>
    </div>
  ` };
}
