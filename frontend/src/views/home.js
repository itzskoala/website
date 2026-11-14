// home.js
import { $ } from "../utils/dom.js";
import { PROJECTS } from "../data/projects/index.js";
import { PHOTOS } from "../data/photos.js";
import { SECTIONS } from "../data/sections.js";
import { tile, projectCard, photoCard } from "./cards.js";
import { setupReveals } from "../router/reveals.js";
import { translateEl } from "../i18n/translate.js";

export function viewHome() {
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return { tint: "#1f1f1f", html: `<div class="view-pad">
    <h1 class="greeting">${greet}!<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></h1>
    <p class="greeting-sub">Welcome to my tiny corner of the internet!</p>
    <div class="tiles">${SECTIONS.map(tile).join("")}</div>

    <div class="shelf-head"><h2>Featured Projects</h2><button class="show-all" data-route="projects">Show all</button></div>
    <div class="grid" data-shelf="projects">${PROJECTS.slice(0, 5).map(projectCard).join("")}</div>

    <div class="shelf-head"><h2>From the camera roll</h2><button class="show-all" data-route="photos">Show all</button></div>
    <div class="grid" data-shelf="photos">${PHOTOS.slice(0, 5).map(photoCard).join("")}</div>
  </div>` };
}

export function fitShelf(el, items, renderFn) {
  if (!el || !items.length) return;
  const card = el.firstElementChild;
  if (!card) return;
  const cardW = card.getBoundingClientRect().width;
  if (!cardW) return;
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  const fitCols = Math.floor((el.clientWidth + gap) / (cardW + gap));
  const cols = Math.max(1, Math.min(items.length, fitCols - 1));
  if (cols === el.children.length) return;
  el.innerHTML = items.slice(0, cols).map(renderFn).join("");
  translateEl(el);
  setupReveals(el);
}

export function fitShelves() {
  fitShelf($('[data-shelf="projects"]'), PROJECTS, projectCard);
  fitShelf($('[data-shelf="photos"]'), PHOTOS, photoCard);
}

let fitShelvesTimer = 0;
window.addEventListener("resize", () => {
  if ((location.hash || "#home").slice(1).split("/")[0] !== "home") return;
  clearTimeout(fitShelvesTimer);
  fitShelvesTimer = setTimeout(fitShelves, 150);
});
