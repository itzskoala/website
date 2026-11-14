// pokemonWidget.js
import { $, esc } from "../utils/dom.js";
import { tstr } from "../i18n/translate.js";
import { POKEDEX_BY_GEN } from "../data/pokedex.js";

const widget = $("[data-poke-widget]");

if (widget) {
  const stage = $("[data-poke-stage]", widget);
  const collapseBtn = $("[data-poke-collapse]", widget);
  const addBtn = $("[data-poke-add]", widget);
  const shuffleBtn = $("[data-poke-shuffle]", widget);
  const clearBtn = $("[data-poke-clear]", widget);
  const resizeHandle = $("[data-poke-resize]", widget);
  const picker = $("[data-poke-picker]");
  const pickerInput = $("[data-poke-picker-input]", picker);
  const pickerList = $("[data-poke-picker-list]", picker);

  const SPRITE_BASE = "https://raw.githubusercontent.com/jakobhoeg/vscode-pokemon/main/media";
  const BUBBLE_ICONS = [`${SPRITE_BASE}/happy.png`, `${SPRITE_BASE}/heart.png`];
  const SPRITE_SIZE = 84;
  const MAX_ACTIVE = 3;
  const BALL_OPEN_MS = 450, SPAWN_POP_MS = 170, FADE_OUT_MS = 220, BALL_CLOSE_MS = 600;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pokeList = Object.keys(POKEDEX_BY_GEN).flatMap((g) => POKEDEX_BY_GEN[g].split(" ").map((name) => ({ gen: +g, name })));

  let active = [];
  let idSeq = 0;
  let pendingAnim = 0;
  let pickerMode = "root";
  let pickerGen = null;

  const spriteUrl = (entry, variant) => `${SPRITE_BASE}/gen${entry.gen}/${entry.name}/default_${variant}_8fps.gif`;
  const displayName = (name) => name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const randomEntry = (excludeName) => {
    let e;
    do { e = pokeList[(Math.random() * pokeList.length) | 0]; } while (pokeList.length > 1 && excludeName && e.name === excludeName);
    return e;
  };

  function renderEmpty() {
    if (active.length || pendingAnim) return;
    stage.innerHTML = `<div class="poke-empty">${esc(tstr("No Pokémon yet — click + to add one."))}</div>`;
  }

  function clearTimer(p) { if (p.timer) { clearTimeout(p.timer); p.timer = null; } }

  function despawn(p) {
    clearTimer(p);
    pendingAnim++;
    const x = p.x;
    p.el.classList.add("is-fading");
    setTimeout(() => {
      p.el.remove();
      const ball = document.createElement("div");
      ball.className = "poke-ball is-closing";
      ball.style.left = x + "px";
      stage.appendChild(ball);
      setTimeout(() => { ball.remove(); pendingAnim--; renderEmpty(); }, BALL_CLOSE_MS);
    }, FADE_OUT_MS);
  }

  function removePokemon(id) {
    const i = active.findIndex((p) => p.id === id);
    if (i === -1) return;
    const [p] = active.splice(i, 1);
    despawn(p);
  }

  function clearAll() {
    const toRemove = active.slice();
    active = [];
    if (!toRemove.length) { renderEmpty(); return; }
    toRemove.forEach(despawn);
  }

  function scheduleIdle(p) {
    p.el.src = spriteUrl(p.entry, "idle");
    if (reduceMotion) return;
    clearTimer(p);
    p.timer = setTimeout(() => walkToRandom(p), 1400 + Math.random() * 2600);
  }

  function walkToRandom(p) {
    if (!active.includes(p)) return;
    const stageW = stage.clientWidth || 220, spriteW = SPRITE_SIZE;
    const maxX = Math.max(2, stageW - spriteW - 2);
    let targetX = Math.random() * maxX;
    if (Math.abs(targetX - p.x) < 24) targetX = targetX > p.x ? Math.min(maxX, p.x + 40) : Math.max(0, p.x - 40);
    const dir = targetX > p.x ? 1 : -1;
    const dur = Math.max(400, (Math.abs(targetX - p.x) / 46) * 1000);
    p.el.classList.toggle("is-flip", dir === 1);
    p.el.src = spriteUrl(p.entry, "walk");
    p.el.style.transitionDuration = dur + "ms";
    requestAnimationFrame(() => { p.el.style.left = targetX + "px"; });
    p.x = targetX;
    clearTimer(p);
    p.timer = setTimeout(() => scheduleIdle(p), dur);
  }

  function spawnBubble(p) {
    const bubble = document.createElement("img");
    bubble.className = "poke-bubble";
    bubble.src = BUBBLE_ICONS[(Math.random() * BUBBLE_ICONS.length) | 0];
    bubble.alt = ""; bubble.setAttribute("aria-hidden", "true");
    bubble.style.left = (p.x + SPRITE_SIZE / 2 - 12) + "px";
    stage.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add("is-in"));
    setTimeout(() => {
      bubble.classList.remove("is-in");
      setTimeout(() => bubble.remove(), 200);
    }, 850);
  }
  stage.addEventListener("click", (e) => {
    const el = e.target.closest(".poke-sprite");
    if (!el) return;
    const p = active.find((x) => x.el === el);
    if (p) spawnBubble(p);
  });

  function spawn(entry) {
    if (active.length >= MAX_ACTIVE) removePokemon(active[0].id);
    const emptyEl = stage.querySelector(".poke-empty");
    if (emptyEl) emptyEl.remove();
    const id = ++idSeq;
    const startX = Math.max(2, Math.random() * ((stage.clientWidth || 220) - SPRITE_SIZE - 6));
    pendingAnim++;
    const ball = document.createElement("div");
    ball.className = "poke-ball is-opening";
    ball.style.left = startX + "px";
    stage.appendChild(ball);
    const p = { id, entry, el: null, x: startX, timer: null };
    active.push(p);
    setTimeout(() => {
      ball.remove();
      const img = document.createElement("img");
      img.className = "poke-sprite is-spawning";
      img.alt = ""; img.setAttribute("aria-hidden", "true");
      img.onerror = () => removePokemon(id);
      img.src = spriteUrl(entry, "idle");
      img.style.left = startX + "px";
      stage.appendChild(img);
      p.el = img;
      scheduleIdle(p);
      setTimeout(() => { img.classList.remove("is-spawning"); pendingAnim--; }, SPAWN_POP_MS);
    }, BALL_OPEN_MS);
    return p;
  }

  function shuffle() {
    const last = active.length ? active[active.length - 1].entry.name : null;
    clearAll();
    spawn(randomEntry(last));
  }

  const folderSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>';
  const ballSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>';
  const backChevSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
  const rowGenHtml = (g) => `<div class="poke-picker-row" data-poke-gen="${g}"><span class="poke-picker-icon">${folderSvg}</span><span class="poke-picker-name">${esc(tstr("Generation " + g))}</span><span class="poke-picker-sub">${esc(tstr("Browse Gen " + g + " Pokémon"))}</span></div>`;
  const rowBackHtml = () => `<div class="poke-picker-row" data-poke-back><span class="poke-picker-icon">${backChevSvg}</span><span class="poke-picker-name">${esc(tstr("All generations"))}</span></div>`;
  const rowPokemonHtml = (entry) => `<div class="poke-picker-row" data-poke-pick="${entry.gen}|${esc(entry.name)}"><span class="poke-picker-icon">${ballSvg}</span><span class="poke-picker-name">${esc(displayName(entry.name))}</span><span class="poke-picker-sub">Gen ${entry.gen}</span></div>`;

  function renderPicker(query) {
    if (pickerMode === "root") {
      pickerList.innerHTML = [1, 2, 3, 4, 5].map(rowGenHtml).join("");
    } else if (pickerMode === "gen") {
      pickerList.innerHTML = rowBackHtml() + POKEDEX_BY_GEN[pickerGen].split(" ").map((name) => rowPokemonHtml({ gen: pickerGen, name })).join("");
    } else {
      const q = (query || "").toLowerCase();
      const matches = pokeList.filter((e) => displayName(e.name).toLowerCase().includes(q)).slice(0, 60);
      pickerList.innerHTML = matches.length ? matches.map(rowPokemonHtml).join("") : `<div class="poke-picker-empty">${esc(tstr("No Pokémon found."))}</div>`;
    }
  }

  function openPicker() {
    picker.hidden = false;
    pickerInput.value = "";
    pickerMode = "root"; pickerGen = null;
    renderPicker();
    requestAnimationFrame(() => pickerInput.focus());
  }
  function closePicker() { picker.hidden = true; }

  addBtn.addEventListener("click", openPicker);
  picker.addEventListener("pointerdown", (e) => { if (e.target === picker) closePicker(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !picker.hidden) closePicker(); });
  pickerInput.addEventListener("input", () => {
    const q = pickerInput.value.trim().toLowerCase();
    pickerMode = q ? "search" : "root";
    if (!q) pickerGen = null;
    renderPicker(q);
  });
  pickerList.addEventListener("click", (e) => {
    const row = e.target.closest(".poke-picker-row");
    if (!row) return;
    if (row.dataset.pokeGen) { pickerMode = "gen"; pickerGen = +row.dataset.pokeGen; pickerInput.value = ""; renderPicker(); pickerInput.focus(); return; }
    if (row.dataset.pokeBack !== undefined) { pickerMode = "root"; pickerGen = null; renderPicker(); return; }
    if (row.dataset.pokePick) {
      const [gen, name] = row.dataset.pokePick.split("|");
      spawn({ gen: +gen, name });
      closePicker();
    }
  });

  collapseBtn.addEventListener("click", () => {
    const collapsed = widget.classList.toggle("is-collapsed");
    collapseBtn.setAttribute("aria-expanded", String(!collapsed));
  });
  shuffleBtn.addEventListener("click", shuffle);
  clearBtn.addEventListener("click", clearAll);

  const STAGE_MIN_H = 100;
  resizeHandle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const startY = e.clientY, startH = stage.offsetHeight;
    const maxH = Math.max(STAGE_MIN_H, Math.min(460, window.innerHeight - 260));
    resizeHandle.classList.add("is-dragging");
    resizeHandle.setPointerCapture(e.pointerId);
    const onMove = (ev) => {
      const h = Math.min(maxH, Math.max(STAGE_MIN_H, startH + (startY - ev.clientY)));
      stage.style.height = h + "px";
    };
    const onUp = () => {
      resizeHandle.classList.remove("is-dragging");
      resizeHandle.removeEventListener("pointermove", onMove);
      resizeHandle.removeEventListener("pointerup", onUp);
    };
    resizeHandle.addEventListener("pointermove", onMove);
    resizeHandle.addEventListener("pointerup", onUp);
  });

  spawn(randomEntry());
}
