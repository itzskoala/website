// mobileNav.js
import { $ } from "../utils/dom.js";

const sideEl = $(".side"), burger = $("[data-nav-burger]"), backdrop = $("[data-side-backdrop]");

if (sideEl && burger && backdrop) {
  const closeSide = () => { sideEl.classList.remove("is-open"); backdrop.classList.remove("show"); burger.setAttribute("aria-expanded", "false"); };
  const openSide = () => { sideEl.classList.add("is-open"); backdrop.classList.add("show"); burger.setAttribute("aria-expanded", "true"); };
  burger.addEventListener("click", (e) => { e.stopPropagation(); sideEl.classList.contains("is-open") ? closeSide() : openSide(); });
  backdrop.addEventListener("click", closeSide);
  sideEl.addEventListener("click", (e) => { if (e.target.closest("[data-route],[data-nav],[data-lib]")) closeSide(); });
  window.addEventListener("hashchange", closeSide);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSide(); });
}
