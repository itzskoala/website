// fabMenu.js
export function closeAllFabMenus() {
  document.querySelectorAll("[data-fabwrap].is-open").forEach((w) => {
    w.classList.remove("is-open");
    const m = w.querySelector("[data-fab-menu]"); if (m) m.hidden = true;
    const t = w.querySelector("[data-fab-toggle]"); if (t) t.setAttribute("aria-expanded", "false");
  });
}

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllFabMenus(); });
