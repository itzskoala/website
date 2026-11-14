// theme.js
import { $ } from "../utils/dom.js";

const root = document.documentElement;

function systemPrefersDark() {
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function applyTheme(t) { root.dataset.theme = t; localStorage.setItem("theme", t); }

const saved = localStorage.getItem("theme");
applyTheme(saved || (systemPrefersDark() ? "dark" : "light"));

$("[data-theme-toggle]").addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark"));
