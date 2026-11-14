// controls.js
import { $, grad } from "../utils/dom.js";
import { ytId, ytThumb, upgradeThumb } from "../utils/youtube.js";
import { TRACKS } from "../data/tracks.js";
import { state } from "./state.js";
import { loadViz } from "./visualizer.js";
import { syncQueue } from "./queuePanel.js";

const nowArt = $("[data-now-art]"), nowTitle = $("[data-now-title]"), nowArtist = $("[data-now-artist]");
const seekEl = $("[data-seek]"), curEl = $("[data-cur]"), durEl = $("[data-dur]"), volEl = $("[data-volume]");
const btnShuffle = $("[data-shuffle]"), btnRepeat = $("[data-repeat]");

export function fmt(s) { return isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00"; }

export function startPoll() {
  if (state.poll) return;
  state.poll = setInterval(() => {
    if (!state.ytReady || state.seeking || !state.isPlaying) return;
    const d = state.yt.getDuration() || 0, c = state.yt.getCurrentTime() || 0;
    if (d) { seekEl.value = (c / d) * 1000; seekEl.style.setProperty("--f", (c / d) * 100 + "%"); }
    curEl.textContent = fmt(c); durEl.textContent = fmt(d);
  }, 250);
}

export function loadTrack(idx, autoplay) {
  const t = TRACKS[idx], id = ytId(t.yt);
  nowArt.textContent = "";
  nowArt.style.background = id ? `#000 center/cover no-repeat url(${ytThumb(id)})` : grad("#7a0019", "#ffc72c");
  if (id) upgradeThumb(nowArt, id);
  nowTitle.textContent = t.title; nowArtist.textContent = t.artist;
  curEl.textContent = "0:00"; durEl.textContent = "0:00"; seekEl.value = 0; seekEl.style.setProperty("--f", "0%");
  state.curVizId = id; state.curViz = null;
  loadViz(id).then((v) => { if (state.curVizId === id) state.curViz = v; });
  syncQueue();
  if (!state.ytReady) { state.wantPlay = autoplay ? idx : -1; return; }
  if (autoplay) state.yt.loadVideoById(id); else state.yt.cueVideoById(id);
}

export function play() { if (state.ytReady) state.yt.playVideo(); }
export function pause() { if (state.ytReady) state.yt.pauseVideo(); }
export function playPos(pos) { state.cur = (pos + state.queue.length) % state.queue.length; loadTrack(state.queue[state.cur], true); }
export function playTrack(idx) {
  let pos = state.queue.indexOf(idx);
  if (pos === -1) { state.queue = TRACKS.map((_, i) => i); pos = idx; }
  playPos(pos);
}

export function setNowArtistUnavailable(text) { nowArtist.textContent = text; }

$("[data-playpause]").addEventListener("click", () => { if (state.cur === -1) return playRandomTrack(); state.isPlaying ? pause() : play(); });
$("[data-next]").addEventListener("click", () => { if (state.cur === -1) return playRandomTrack(); playPos(state.cur + 1); });
$("[data-prev]").addEventListener("click", () => { if (state.cur === -1) return playRandomTrack(); if (state.ytReady && state.yt.getCurrentTime() > 3) state.yt.seekTo(0, true); else playPos(state.cur - 1); });
btnShuffle.addEventListener("click", () => {
  state.shuffle = !state.shuffle; btnShuffle.classList.toggle("on", state.shuffle);
  const cTrack = state.cur > -1 ? state.queue[state.cur] : null;
  if (state.shuffle) for (let i = state.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]]; }
  else state.queue.sort((a, b) => a - b);
  if (cTrack !== null) state.cur = state.queue.indexOf(cTrack);
});
btnRepeat.addEventListener("click", () => { state.repeat = !state.repeat; btnRepeat.classList.toggle("on", state.repeat); });
seekEl.addEventListener("input", () => { state.seeking = true; if (state.ytReady) { const d = state.yt.getDuration() || 0; curEl.textContent = fmt((seekEl.value / 1000) * d); } seekEl.style.setProperty("--f", (seekEl.value / 10) + "%"); });
seekEl.addEventListener("change", () => { if (state.ytReady) { const d = state.yt.getDuration() || 0; state.yt.seekTo((seekEl.value / 1000) * d, true); } state.seeking = false; });

const btnMute = $("[data-mute]"), volOn = $("[data-vol-on]"), volOff = $("[data-vol-off]");
let lastVol = +volEl.value || 75;
function applyVol(v) {
  v = Math.max(0, Math.min(100, v));
  if (state.ytReady) state.yt.setVolume(v);
  volEl.value = v; volEl.style.setProperty("--f", v + "%");
  const isMuted = v <= 0;
  volOn.style.display = isMuted ? "none" : "";
  volOff.style.display = isMuted ? "" : "none";
  btnMute.classList.toggle("on", isMuted);
  btnMute.title = isMuted ? "Unmute" : "Mute";
}
volEl.addEventListener("input", () => { const v = +volEl.value; if (v > 0) lastVol = v; applyVol(v); });
btnMute.addEventListener("click", () => { if (+volEl.value > 0) { lastVol = +volEl.value; applyVol(0); } else { applyVol(lastVol || 75); } });
applyVol(+volEl.value);

function playRandomTrack() {
  state.queue = TRACKS.map((_, i) => i);
  playPos(Math.floor(Math.random() * state.queue.length));
}
export { playRandomTrack as playRandom };
