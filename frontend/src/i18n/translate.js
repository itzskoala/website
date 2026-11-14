// translate.js
import { I18N } from "./strings.js";

export let LANG = "en";

export function tstr(en) {
  if (LANG !== "es") return en;
  return I18N[en] || esPattern(en) || en;
}

function esPattern(key) {
  let m;
  if ((m = key.match(/^(\d+) songs$/))) return m[1] + " canciones";
  if ((m = key.match(/^(\d+) song$/))) return m[1] + " canción";
  if ((m = key.match(/^(\d+) playlists$/))) return m[1] + " listas";
  if ((m = key.match(/^(\d+) playlist$/))) return m[1] + " lista";
  if ((m = key.match(/^Playlist · (\d+) songs$/))) return "Lista · " + m[1] + " canciones";
  if ((m = key.match(/^(\d+) builds$/))) return m[1] + " proyectos";
  if ((m = key.match(/^(\d+) photos$/))) return m[1] + " fotos";
  if ((m = key.match(/^Results for "(.*)"$/))) return 'Resultados de "' + m[1] + '"';
  if ((m = key.match(/^Play (.+) by (.+)$/))) return "Reproducir " + m[1] + " de " + m[2];
  if ((m = key.match(/^Generation (\d+)$/))) return "Generación " + m[1];
  if ((m = key.match(/^Browse Gen (\d+) Pokémon$/))) return "Explorar Pokémon de la Gen " + m[1];
  return null;
}

export function translateEl(rootEl) {
  if (!rootEl) return;
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((n) => {
    if (n.__en === undefined) n.__en = n.nodeValue;
    const en = n.__en, key = en.trim();
    if (!key) return;
    if (LANG === "es") { const es = I18N[key] || esPattern(key); if (es != null) n.nodeValue = en.replace(key, es); }
    else if (n.nodeValue !== en) n.nodeValue = en;
  });
  rootEl.querySelectorAll("[placeholder]").forEach((el) => {
    if (el.__ph === undefined) el.__ph = el.getAttribute("placeholder");
    const es = I18N[el.__ph];
    el.setAttribute("placeholder", LANG === "es" && es ? es : el.__ph);
  });
}

export function applyLang(lang) {
  LANG = lang;
  document.querySelectorAll("[data-lang-code]").forEach((el) => (el.textContent = lang.toUpperCase()));
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
  translateEl(document.querySelector(".sp"));
}
