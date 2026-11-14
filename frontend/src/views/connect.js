// connect.js
import { esc, grad } from "../utils/dom.js";
import { LINKS } from "../data/links.js";

export function viewConnect() {
  return { tint: "#0d4d3f", hero: "#0f6b56", html: `
    <div class="hero" style="--hero-c:#0f6b56;padding-top:48px">
      <div class="hero-cover"><img src="./assets/covers/connect.jpg" alt=""></div>
      <div>
        <div class="hero-kind">Playlist</div>
        <h1 class="hero-title">Let's Connect</h1>
        <div class="hero-meta">Let's be friends 😄</div>
      </div>
    </div>
    <div class="view-pad">
      <div class="connect-grid">${LINKS.map((l) => `
        <a class="connect-card" href="${esc(l.url)}" target="_blank" rel="noreferrer" data-tick>
          <div class="ico" style="background:${grad(l.c1, l.c2)}"><svg viewBox="0 0 24 24">${l.icon}</svg></div>
          <h3>${esc(l.title)}</h3><span>${esc(l.sub)}</span>
        </a>`).join("")}</div>
    </div>
  ` };
}
