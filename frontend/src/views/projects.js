// projects.js
import { esc } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { PROJECTS } from "../data/projects/index.js";
import { projectCard, fabHtml } from "./cards.js";

export function viewProjects() {
  return { tint: "#3a2150", html: `
    <div class="hero" style="--hero-c:#3a2150;padding-top:48px">
      <div class="hero-cover"><img src="./assets/covers/projects.jpg" alt=""></div>
      <div>
        <div class="hero-kind">Playlist</div>
        <h1 class="hero-title">Projects</h1>
        <div class="hero-meta">${esc(PROFILE.name)} · ${PROJECTS.length} builds</div>
      </div>
    </div>
    <div class="view-pad"><div class="grid">${PROJECTS.map(projectCard).join("")}</div></div>
  ` };
}

export function viewProjectDetail(id) {
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  return { tint: p.c1 + "55", html: `
    <div class="hero" style="--hero-c:${p.c1}">
      <div class="hero-cover"><img src="${p.img}" alt="${esc(p.title)}"></div>
      <div>
        <div class="hero-kind">Project</div>
        <h1 class="hero-title">${esc(p.title)}</h1>
        <div class="hero-meta"><b>${esc(PROFILE.name)}</b> · ${esc(p.kind)}</div>
      </div>
    </div>
    <div class="action-bar">
      ${fabHtml(p, "play-big", "Open project")}
    </div>
    <div class="view-pad">
      <p style="max-width:620px;line-height:1.6;color:var(--muted)">${esc(p.desc)}</p>
      <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="section-label">More by Sri</div>
      <div class="grid">${PROJECTS.filter((x) => x.id !== p.id).slice(0, 4).map(projectCard).join("")}</div>
    </div>
  ` };
}
