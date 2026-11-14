// queuePanel.js
import { $, esc, grad } from "../utils/dom.js";
import { playSvg } from "../utils/icons.js";
import { ytId, ytThumb, upgradeThumb } from "../utils/youtube.js";
import { PLAYLISTS } from "../data/playlists.js";
import { TRACKS } from "../data/tracks.js";
import { state } from "./state.js";
import { playPos } from "./controls.js";
import { translateEl } from "../i18n/translate.js";

const qPanel = $("[data-queue-panel]"), qBtn = $("[data-queue-toggle]");
let libView = null;

const artBg = (t) => {
  if (t && t.cover) return `#000 center/cover no-repeat url(${t.cover})`;
  const id = ytId(t && t.yt); return id ? `#000 center/cover no-repeat url(${ytThumb(id)})` : grad("#7a0019", "#ffc72c");
};
const artAttr = (t) => { const id = !t?.cover && ytId(t && t.yt); return id ? `data-yt="${id}"` : ""; };
const chevR = '<svg class="queue-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
const chevL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';

function renderPanel() {
  if (!libView) {
    qPanel.innerHTML =
      `<div class="queue-head"><span>Your Library</span><span class="queue-count">${PLAYLISTS.length} playlist${PLAYLISTS.length === 1 ? "" : "s"}</span></div>` +
      `<div class="queue-list">${PLAYLISTS.map((p, pi) => `
        <div class="queue-item" data-pl="${pi}">
          <div class="queue-art" style="background:${artBg(p.tracks[0])}" ${artAttr(p.tracks[0])}></div>
          <div class="queue-info"><div class="queue-title">${esc(p.name)}</div><div class="queue-artist">Playlist · ${p.tracks.length} songs</div></div>
          <button class="queue-playbtn" data-play-pl="${pi}" aria-label="Play ${esc(p.name)}" title="Play playlist">${playSvg}</button>
          ${chevR}
        </div>`).join("")}</div>`;
    qPanel.querySelectorAll("[data-pl]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); libView = PLAYLISTS[+el.dataset.pl]; renderPanel(); }));
    qPanel.querySelectorAll("[data-play-pl]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); playPlaylist(PLAYLISTS[+el.dataset.playPl]); syncQueue(); }));
  } else {
    const p = libView;
    qPanel.innerHTML =
      `<div class="queue-head"><button class="queue-back" data-back-lib aria-label="Back to library">${chevL}</button><span>${esc(p.name)}</span><span class="queue-count">${p.tracks.length} songs</span><button class="queue-playbtn head-play" data-play-pl-cur aria-label="Play ${esc(p.name)}" title="Play playlist">${playSvg}</button></div>` +
      `<div class="queue-list">${p.trackIdx.map((gi) => { const t = TRACKS[gi]; return `
        <div class="queue-item" data-qi="${gi}">
          <div class="queue-art" style="background:${artBg(t)}" ${artAttr(t)}></div>
          <div class="queue-info"><div class="queue-title">${esc(t.title)}</div><div class="queue-artist">${esc(t.artist)}</div></div>
          <div class="queue-eq" aria-hidden="true"><span></span><span></span><span></span></div>
        </div>`; }).join("")}</div>`;
    qPanel.querySelector("[data-back-lib]").addEventListener("click", (e) => { e.stopPropagation(); libView = null; renderPanel(); });
    qPanel.querySelector("[data-play-pl-cur]").addEventListener("click", (e) => { e.stopPropagation(); playPlaylist(p); syncQueue(); });
    qPanel.querySelectorAll("[data-qi]").forEach((el) => el.addEventListener("click", (e) => { e.stopPropagation(); playFromPlaylist(p, +el.dataset.qi); }));
    syncQueue();
  }
  qPanel.querySelectorAll("[data-yt]").forEach((el) => upgradeThumb(el, el.dataset.yt));
  translateEl(qPanel);
}

export function playFromPlaylist(p, gi) {
  state.queue = p.trackIdx.slice();
  if (state.shuffle) for (let i = state.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]]; }
  playPos(state.queue.indexOf(gi));
}

export function playPlaylist(p) {
  state.queue = p.trackIdx.slice();
  if (state.shuffle) for (let i = state.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]]; }
  playPos(0);
}

export function syncQueue() {
  const active = state.cur > -1 ? state.queue[state.cur] : -1;
  qPanel.querySelectorAll("[data-qi]").forEach((el) => {
    const on = +el.dataset.qi === active;
    el.classList.toggle("is-current", on);
    el.classList.toggle("is-playing", on && state.isPlaying);
    if (on && !qPanel.hidden) el.scrollIntoView({ block: "nearest" });
  });
  qBtn.classList.toggle("on", !qPanel.hidden);
}

qBtn.addEventListener("click", (e) => { e.stopPropagation(); qPanel.hidden = !qPanel.hidden; if (!qPanel.hidden) { libView = null; renderPanel(); } syncQueue(); });
document.addEventListener("click", (e) => {
  if (qPanel.hidden) return;
  if (qPanel.contains(e.target) || qBtn.contains(e.target) || (e.target.closest && e.target.closest(".player"))) return;
  qPanel.hidden = true; qBtn.classList.remove("on");
});
