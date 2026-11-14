// cards.js
import { esc, grad } from "../utils/dom.js";
import { playSvg, githubSvg, extSvg } from "../utils/icons.js";

export function fabHtml(p, btnClass, label) {
  if (!p.site) return `<button class="${btnClass}" data-open="${esc(p.url)}" aria-label="${esc(label)}">${playSvg}</button>`;
  const wrapClass = btnClass === "card-fab" ? "fab-wrap card-fab-pos" : "fab-wrap";
  return `<div class="${wrapClass}" data-fabwrap>
    <button class="${btnClass}" data-fab-toggle aria-haspopup="true" aria-expanded="false" aria-label="${esc(label)}">${playSvg}</button>
    <div class="fab-menu" data-fab-menu hidden>
      <a class="fab-opt" data-open="${esc(p.url)}">${githubSvg}<span>GitHub Repo</span></a>
      <a class="fab-opt" data-open="${esc(p.site)}">${extSvg}<span>Website</span></a>
    </div>
  </div>`;
}

export function projectCard(p) {
  return `<div class="card" data-project="${p.id}">
    <div class="card-art"><img src="${p.img}" alt="${esc(p.title)}" loading="lazy"></div>
    <div class="card-title">${esc(p.title)}</div>
    <div class="card-sub">${esc(p.kind)}</div>
    ${fabHtml(p, "card-fab", "Open " + p.title)}
  </div>`;
}

export function photoCard(p, i) {
  return `<div class="card" data-photo="${i}">
    <div class="card-art"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy"></div>
    <div class="card-title">${esc(p.cap)}</div>
    <div class="card-sub">${esc("Photo")}</div>
  </div>`;
}

export function tile(s) {
  return `<div class="tile" data-route="${s.id}">
    <div class="tile-cover" style="background:${grad(s.c1, s.c2)}">${s.img ? `<img src="${s.img}" alt="">` : s.emoji}</div>
    <div class="tile-name">${esc(s.name)}</div>
    <button class="tile-fab" data-route="${s.id}" aria-label="Open ${esc(s.name)}">${playSvg}</button>
  </div>`;
}
