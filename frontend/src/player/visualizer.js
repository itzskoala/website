// visualizer.js
import { $ } from "../utils/dom.js";
import { state } from "./state.js";

const canvas = $("[data-viz]"), ctx2d = canvas.getContext("2d");
const vizCache = new Map();

export function loadViz(id) {
  if (!id) return Promise.resolve(null);
  if (vizCache.has(id)) return Promise.resolve(vizCache.get(id));
  return fetch(`./assets/viz/${id}.json`)
    .then((r) => { if (!r.ok) throw 0; return r.json(); })
    .then((d) => {
      const bytes = Uint8Array.from(atob(d.data), (c) => c.charCodeAt(0));
      const v = { fps: d.fps, bands: d.bands, frames: d.frames, bytes };
      vizCache.set(id, v);
      return v;
    })
    .catch(() => { vizCache.set(id, null); return null; });
}

export function resizeCanvas() {
  const d = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * d;
  canvas.height = canvas.clientHeight * d;
  ctx2d.setTransform(d, 0, 0, d, 0, 0);
}
window.addEventListener("resize", resizeCanvas);

const NB = 48, bars = new Array(NB).fill(0);

export function draw() {
  state.raf = requestAnimationFrame(draw);
  const w = canvas.clientWidth, h = canvas.clientHeight; ctx2d.clearRect(0, 0, w, h);
  const t = performance.now() / 1000, bw = w / NB;
  let frame = null, frameBase = 0, frameBands = 0;
  if (state.isPlaying && state.curViz && state.ytReady) {
    const ct = state.yt.getCurrentTime() || 0;
    const fi = Math.min(state.curViz.frames - 1, Math.max(0, Math.floor(ct * state.curViz.fps)));
    frame = state.curViz.bytes; frameBase = fi * state.curViz.bands; frameBands = state.curViz.bands;
  }
  for (let i = 0; i < NB; i++) {
    let target;
    if (frame) {
      const bi = Math.min(frameBands - 1, Math.floor((i / NB) * frameBands));
      target = 0.05 + (frame[frameBase + bi] / 255) * 0.95;
    } else {
      target = state.isPlaying
        ? (0.28 + 0.72 * Math.abs(Math.sin(i * 0.5 + t * 3.1) * Math.sin(i * 0.13 + t * 1.7))) * (0.55 + Math.random() * 0.45)
        : 0.02;
    }
    bars[i] += (target - bars[i]) * 0.25;
    const bh = bars[i] * h * 0.95, x = i * bw;
    const g = ctx2d.createLinearGradient(0, h, 0, h - bh);
    g.addColorStop(0, "rgba(122,0,25,.95)"); g.addColorStop(1, "rgba(255,199,44,.55)");
    ctx2d.fillStyle = g; ctx2d.fillRect(x + bw * 0.15, h - bh, bw * 0.7, bh);
  }
  if (!state.isPlaying && bars.every((b) => b < 0.03)) { cancelAnimationFrame(state.raf); state.raf = 0; ctx2d.clearRect(0, 0, w, h); }
}
