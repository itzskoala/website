// router.js
import { $ } from "../utils/dom.js";
import { setupReveals } from "./reveals.js";
import { setTitle } from "./titles.js";
import { translateEl } from "../i18n/translate.js";
import { viewHome, fitShelves } from "../views/home.js";
import { viewAbout, aboutEnter, aboutTeardown } from "../views/about.js";
import { viewProjects, viewProjectDetail } from "../views/projects.js";
import { viewExperience } from "../views/experience.js";
import { viewPhotos } from "../views/photos.js";
import { viewConnect } from "../views/connect.js";
import { viewVoicemail } from "../views/voicemail.js";
import { viewSearch } from "../views/search.js";
import { vmEnter, vmTeardown } from "../voicemail/recorder.js";

const main = $("[data-main]");
const viewEl = $("[data-view]");
const searchBox = $("[data-search-box]");
const searchInput = $("[data-search-input]");

export function setHeaderTint(c) { main.style.setProperty("--header-tint", c || "var(--panel)"); }

export function render(out) {
  viewEl.className = "view fade-view";
  viewEl.innerHTML = out.html;
  translateEl(viewEl);
  setHeaderTint(out.tint);
  main.scrollTop = 0;
  setupReveals(viewEl);
}

export function route() {
  const hash = (location.hash || "#home").slice(1);
  const [base, arg] = hash.split("/");
  searchBox.classList.toggle("show", base === "search");
  let out;
  if (base === "home") out = viewHome();
  else if (base === "about") out = viewAbout();
  else if (base === "projects" && arg) out = viewProjectDetail(arg);
  else if (base === "projects") out = viewProjects();
  else if (base === "experience") out = viewExperience();
  else if (base === "photos") out = viewPhotos();
  else if (base === "connect") out = viewConnect();
  else if (base === "voicemail") out = viewVoicemail();
  else if (base === "search") out = viewSearch(searchInput.value);
  else out = viewHome();
  setTitle(base, arg);
  render(out);
  if (base === "home") fitShelves();
  document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === base));
  document.querySelectorAll("[data-lib]").forEach((li) => li.classList.toggle("is-active", li.dataset.lib === base));
  if (base === "voicemail") vmEnter(); else vmTeardown();
  if (base === "about") aboutEnter(); else aboutTeardown();
}

export function go(hash) { if (location.hash === "#" + hash) route(); else location.hash = hash; }

searchInput.addEventListener("input", () => { if ((location.hash || "").startsWith("#search")) render(viewSearch(searchInput.value)); else go("search"); });
$("[data-back]").addEventListener("click", () => history.back());
$("[data-fwd]").addEventListener("click", () => history.forward());
