// sound.js
let ctx = null;

function getContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip({ freq, duration, type = "sine", volume = 0.07, delay = 0 }) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const start = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playClick() {
  blip({ freq: 720, duration: 0.07, type: "sine", volume: 0.06 });
}

export function playToggle() {
  blip({ freq: 500, duration: 0.09, type: "triangle", volume: 0.055 });
}

export function playSuccess() {
  blip({ freq: 640, duration: 0.12, type: "sine", volume: 0.07 });
  blip({ freq: 880, duration: 0.18, type: "sine", volume: 0.07, delay: 0.09 });
}

export function playChime() {
  blip({ freq: 523.25, duration: 0.24, type: "sine", volume: 0.055 });
  blip({ freq: 659.25, duration: 0.26, type: "sine", volume: 0.05, delay: 0.05 });
  blip({ freq: 783.99, duration: 0.36, type: "sine", volume: 0.045, delay: 0.1 });
}
