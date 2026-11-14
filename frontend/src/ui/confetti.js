// confetti.js
import { $ } from "../utils/dom.js";
import { playChime } from "./sound.js";

const brand = $(".brand");

const COLORS = ["#ffc72c", "#ffd75e", "#7a0019", "#93122f", "#ffffff"];
const COUNT = 60;
const LIFETIME = 1.6;
const DRAG = 0.5;
const GRAVITY = 1400;

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePieces(seed, speedScale) {
  const rand = mulberry32(seed);
  const pieces = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = (-160 + rand() * 140) * (Math.PI / 180);
    const speed = (500 + rand() * 700) * speedScale;
    const isStreamer = rand() < 0.08;
    const isCircle = !isStreamer && rand() < 0.15;
    pieces.push({
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: isStreamer ? 4 + rand() : 7 + rand() * 8,
      h: isStreamer ? 24 + rand() * 18 : 10 + rand() * 11,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      shape: isStreamer ? "streamer" : isCircle ? "circle" : "rect",
      rotSpeed: (rand() < 0.5 ? -1 : 1) * (400 + rand() * 900),
      tumbleSpeed: 4 + rand() * 6,
      tumblePhase: rand() * Math.PI * 2,
      delay: rand() * 0.08,
    });
  }
  return pieces;
}

let canvas = null, cctx = null, bursts = [], raf = null, seedSeq = 0;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  cctx = canvas.getContext("2d");
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  window.addEventListener("resize", resize);
}

function drawPiece(piece, dx, dy, rot, flip, alpha) {
  cctx.save();
  cctx.globalAlpha = alpha;
  cctx.translate(dx, dy);
  cctx.rotate(rot * (Math.PI / 180));
  cctx.scale(1, flip);
  cctx.fillStyle = piece.color;
  if (piece.shape === "circle") {
    cctx.beginPath();
    cctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2);
    cctx.fill();
  } else {
    cctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
  }
  cctx.restore();
}

function tick() {
  cctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = performance.now();
  bursts = bursts.filter((b) => now - b.startedAt < (LIFETIME + 0.08) * 1000 + 50);
  bursts.forEach((b) => {
    b.pieces.forEach((piece) => {
      const ts = Math.max(0, (now - b.startedAt) / 1000 - piece.delay);
      if (ts >= LIFETIME) return;
      const dx = (piece.vx / DRAG) * (1 - Math.exp(-ts * DRAG));
      const dy = (piece.vy / DRAG) * (1 - Math.exp(-ts * DRAG)) + 0.5 * b.gravity * ts * ts;
      const rot = piece.rotSpeed * ts;
      const flip = Math.cos(ts * piece.tumbleSpeed + piece.tumblePhase);
      const fadeStart = LIFETIME * 0.75;
      let alpha = 1;
      if (ts > fadeStart) { const progress = (ts - fadeStart) / (LIFETIME - fadeStart); alpha = 1 - progress * progress; }
      drawPiece(piece, b.originX + dx, b.originY + dy, rot, flip, alpha);
    });
  });
  raf = bursts.length ? requestAnimationFrame(tick) : null;
}

function spawn() {
  ensureCanvas();
  if (localStorage.getItem("uiSound") !== "off") playChime();
  const logo = brand.querySelector("img") || brand;
  const r = logo.getBoundingClientRect();
  const zoomFactor = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  const speedScale = 1 / zoomFactor;
  bursts.push({
    originX: r.left + r.width / 2,
    originY: r.top + r.height / 2,
    startedAt: performance.now(),
    gravity: GRAVITY * speedScale,
    pieces: makePieces(++seedSeq, speedScale),
  });
  if (!raf) tick();
}

if (brand) {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) brand.addEventListener("click", spawn);
}
