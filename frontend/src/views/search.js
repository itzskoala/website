// search.js
import { esc } from "../utils/dom.js";
import { PROJECTS } from "../data/projects/index.js";
import { PHOTOS } from "../data/photos.js";
import { SECTIONS } from "../data/sections.js";
import { tile, projectCard } from "./cards.js";
import { I18N } from "../i18n/strings.js";

export function viewSearch(q) {
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const both = (s) => norm(s + " " + (I18N[s] || ""));
  const query = norm((q || "").trim());
  if (!query) {
    return { tint: "#1f1f1f", html: `<div class="view-pad">
      <h1 class="greeting">Search</h1>
      <p style="color:var(--muted)">Browse everything</p>
      <div class="tiles">${SECTIONS.map(tile).join("")}</div></div>` };
  }
  const proj = PROJECTS.filter((p) => (both(p.title) + " " + norm(p.tags.join(" ")) + " " + both(p.kind) + " " + both(p.desc)).includes(query));
  const secs = SECTIONS.filter((s) => both(s.name).includes(query));
  const phs = PHOTOS.map((p, i) => ({ p, i })).filter((x) => both(x.p.cap).includes(query));
  let html = `<div class="view-pad"><h1 class="greeting">Results for "${esc(query)}"</h1>`;
  if (secs.length) html += `<div class="section-label">Sections</div><div class="tiles">${secs.map(tile).join("")}</div>`;
  if (proj.length) html += `<div class="section-label">Projects</div><div class="grid">${proj.map(projectCard).join("")}</div>`;
  if (phs.length) html += `<div class="section-label">Photos</div><div class="photo-grid">${phs.map((x) => `<div class="photo" data-photo="${x.i}"><img src="${x.p.src}" alt="${esc(x.p.cap)}"><div class="photo-cap">${esc(x.p.cap)}</div></div>`).join("")}</div>`;
  if (!secs.length && !proj.length && !phs.length) html += `<p style="color:var(--muted)">Nothing found.</p>`;
  html += `</div>`;
  return { tint: "#1f1f1f", html };
}
