// about.js
import { $, esc } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { INTERESTS } from "../data/interests.js";
import { TRACKS } from "../data/tracks.js";
import { playSvg } from "../utils/icons.js";
import { ytId, ytThumb } from "../utils/youtube.js";
import { playTrack, playPos } from "../player/controls.js";
import { state } from "../player/state.js";

const ABOUT_EMOJIS = ["🏊", "✈️", "💻", "🏖️"];

// Favorite tracks live in their normal language playlist (data/playlists.js) — this just
// points at which ones, by yt URL, so the About page can feature them without a separate playlist.
const FAVORITE_YT_IDS = [
  "https://www.youtube.com/watch?v=gKwqu74RD_k", // House Of Balloons / Glass Table Girls — The Weeknd
  "https://www.youtube.com/watch?v=F8dKVbP1Nzo", // Something Stupid — Lola Marsh
  "https://www.youtube.com/watch?v=ttjfRtuAhp4", // BbY WOW — KAROL G, Judeline & rusowsky
  "https://www.youtube.com/watch?v=hfmxO-HQ5rU", // Down Under — Men At Work
  "https://www.youtube.com/watch?v=MX7FSAnRPug", // Loser — Tame Impala
  "https://www.youtube.com/watch?v=l8ubuRRqSaM", // El Chico Del Apartamento 512 — Selena
  "https://www.youtube.com/watch?v=GQeCiGJYoU0", // God Save the Queen — Sex Pistols
  "https://www.youtube.com/watch?v=mEhYtnHQAUw", // Say So — Doja Cat
  "https://www.youtube.com/watch?v=rTNAIm6h1xo", // Inkem Inkem Inkem Kaavaale — Sid Sriram
  "https://www.youtube.com/watch?v=oh_aCp_XLoE", // ¿Porqué Te Vas? — Jeanette
];
const FAVORITES_VISIBLE = 5;
const favoriteGlobalIndexes = FAVORITE_YT_IDS.map((yt) => TRACKS.findIndex((t) => t.yt === yt));

function favoriteTrackRow(globalIdx, i) {
  const track = TRACKS[globalIdx];
  const cover = track.cover || ytThumb(ytId(track.yt));
  return `
    <div class="track-row link has-art" data-favorite-play="${globalIdx}">
      <span class="track-idx">
        <span class="track-num">${i + 1}</span>
        <span class="track-play-ico">${playSvg}</span>
      </span>
      <div class="track-tooltip">Play ${esc(track.title)} by ${esc(track.artist)}</div>
      <img class="track-art" src="${cover}" alt="">
      <div class="track-main"><div class="track-name">${esc(track.title)}</div><div class="track-sub">${esc(track.artist)}</div></div>
      <span class="track-meta">${esc([track.album, track.year].filter(Boolean).join(" • "))}</span>
    </div>`;
}

export function viewAbout() {
  const visibleFavorites = favoriteGlobalIndexes.slice(0, FAVORITES_VISIBLE).map(favoriteTrackRow).join("");
  const extraIndexes = favoriteGlobalIndexes.slice(FAVORITES_VISIBLE);
  const extraFavorites = extraIndexes.map((gi, i) => favoriteTrackRow(gi, i + FAVORITES_VISIBLE)).join("");
  const emojis = ABOUT_EMOJIS.map((e) => `<span class="about-emoji" aria-hidden="true">${e}</span>`).join("");
  const interests = INTERESTS.map((i) => `
    <div class="interest-card">
      <img class="interest-thumb" src="${i.img}" alt="" ${i.fit ? `style="object-fit:${i.fit}"` : ""}>
      <span class="interest-label">${esc(i.label)}</span>
    </div>`).join("");
  return { tint: "#7a001933", hero: "#5a0013", html: `
    <div class="hero" style="--hero-c:#5a0013">
      <div class="hero-cover round"><img src="${PROFILE.headshot}" alt="Sri Kotala"></div>
      <div>
        <h1 class="hero-title">${esc(PROFILE.name)}</h1>
        <div class="hero-meta">${esc(PROFILE.tagline)}</div>
      </div>
    </div>
    <div class="action-bar">
      <button class="play-big" data-play-favorites aria-label="Play">${playSvg}</button>
      <button class="ghost-btn" data-route="connect">Follow</button>
    </div>
    <div class="view-pad">
      <div class="about-card">
        <div class="about-emoji-rail">${emojis}</div>
        <img src="./assets/headshot.jpg" alt="Sri Kotala" loading="lazy">
        <div><h2 class="about-lead">${PROFILE.intro}</h2>${PROFILE.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </div>
      <div class="section-label">Favorite Songs</div>
      <div class="tracklist">${visibleFavorites}</div>
      ${extraFavorites ? `
      <div class="tracklist" data-favorites-extra hidden>${extraFavorites}</div>
      <button type="button" class="show-all" data-favorites-toggle>See more</button>
      ` : ""}
      <div class="section-label">What I'm into <span class="section-label-soft">right now</span></div>
      <div class="interest-grid">${interests}</div>
    </div>
  ` };
}

export function aboutEnter() {
  document.querySelectorAll("[data-favorite-play]").forEach((btn) => {
    btn.addEventListener("click", () => playTrack(+btn.dataset.favoritePlay));
  });
  const toggleBtn = $("[data-favorites-toggle]");
  const extraList = $("[data-favorites-extra]");
  if (toggleBtn && extraList) {
    toggleBtn.addEventListener("click", () => {
      const willShow = extraList.hidden;
      extraList.hidden = !willShow;
      toggleBtn.textContent = willShow ? "Show less" : "See more";
    });
  }
  const playFirst = $("[data-play-favorites]");
  if (playFirst) playFirst.addEventListener("click", () => {
    const expanded = !extraList || !extraList.hidden;
    const idxs = expanded ? favoriteGlobalIndexes : favoriteGlobalIndexes.slice(0, FAVORITES_VISIBLE);
    state.queue = idxs.slice();
    playPos(0);
  });
}

export function aboutTeardown() {}
