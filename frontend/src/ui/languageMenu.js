// languageMenu.js
import { $ } from "../utils/dom.js";
import { applyLang } from "../i18n/translate.js";

const wrap = $("[data-lang-wrap]"), toggle = $("[data-lang-toggle]"), menu = $("[data-lang-menu]");

toggle.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
document.addEventListener("click", (e) => { if (!menu.hidden && !wrap.contains(e.target)) menu.hidden = true; });
menu.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = true; applyLang(b.dataset.lang); }));
