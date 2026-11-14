// theme.js
import { $ } from "../utils/dom.js";

const root = document.documentElement;

function applyTheme(t) { root.dataset.theme = t; localStorage.setItem("theme", t); }

const saved = localStorage.getItem("theme");
applyTheme(saved || "light");

$("[data-theme-toggle]").addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark"));
