// about.js
import { $, esc } from "../utils/dom.js";
import { PROFILE } from "../data/profile.js";
import { INTERESTS } from "../data/interests.js";
import { PLAYLISTS } from "../data/playlists.js";
import "../data/tracks.js";
import { playSvg } from "../utils/icons.js";
import { ytId, ytThumb } from "../utils/youtube.js";
import { playTrack } from "../player/controls.js";

const starSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 15.09 8.76 22 9.76 17 14.63 18.18 21.52 12 18.26 5.82 21.52 7 14.63 2 9.76 8.91 8.76 12 2.5"/></svg>';
const plusSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

const favoritesPlaylist = PLAYLISTS.find((p) => p.name === "Favorites");

function favoriteTrackCard(track, globalIdx) {
  const cover = track.cover || ytThumb(ytId(track.yt));
  const meta = [track.artist, track.album, track.year].filter(Boolean).join(" • ");
  return `
    <div class="favorite-track">
      <img class="favorite-track-cover" src="${cover}" alt="">
      <div class="favorite-track-info">
        <div class="favorite-track-title">${esc(track.title)}</div>
        <div class="favorite-track-meta">${esc(meta)}</div>
      </div>
      <button type="button" class="favorite-track-play" data-favorite-play="${globalIdx}" aria-label="Play ${esc(track.title)}">${playSvg}</button>
    </div>`;
}

export function viewAbout() {
  const headline = PROFILE.headline.map((line) => esc(line)).join("<br>");
  const bio = PROFILE.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  const interestCards = INTERESTS.map((i) => `
    <div class="interest-card">
      <img class="interest-thumb" src="${i.img}" alt="">
      <span class="interest-label">${esc(i.label)}</span>
    </div>`).join("");
  const favoriteTracks = favoritesPlaylist.tracks.map((t, i) => favoriteTrackCard(t, favoritesPlaylist.trackIdx[i])).join("");
  return { tint: "#ff2d87", html: `
    <div class="artist-page">
      <div class="artist-tabs" data-artist-tabs>
        <button class="artist-tab is-active" data-artist-tab="about">About</button>
        <button class="artist-tab" data-artist-tab="favorites">My Favorites</button>
      </div>
      <div class="artist-panel-content">
        <div class="artist-panel" data-artist-panel="about">
          <p class="artist-headline">${headline}</p>
          <div class="artist-bio">${bio}</div>
          <div class="artist-section-label"><span class="artist-section-strong">What I'm into</span> <span class="artist-section-soft">right now</span></div>
          <div class="interest-grid">${interestCards}</div>
        </div>
        <div class="artist-panel" data-artist-panel="favorites" hidden>
          <div class="favorite-track-list">${favoriteTracks}</div>
        </div>
      </div>
      <div class="artist-page-foot">
        <h1 class="artist-name">${esc(PROFILE.name)}</h1>
        <div class="artist-icon-row">
          <button type="button" class="artist-icon-btn" data-star-btn aria-label="Favorite" aria-pressed="false">${starSvg}</button>
          <button type="button" class="artist-icon-btn" data-route="connect" aria-label="Contact">${plusSvg}</button>
        </div>
        <div class="artist-related">
          <div class="artist-related-label">Related Artists</div>
          <div class="artist-related-avatars">
            <span class="artist-avatar-placeholder" aria-hidden="true"></span>
            <span class="artist-avatar-placeholder" aria-hidden="true"></span>
            <span class="artist-avatar-placeholder" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </div>
  ` };
}

export function aboutEnter() {
  const tabs = $("[data-artist-tabs]");
  if (tabs) tabs.addEventListener("click", onTabClick);
  const star = $("[data-star-btn]");
  if (star) star.addEventListener("click", onStarClick);
  document.querySelectorAll("[data-favorite-play]").forEach((btn) => {
    btn.addEventListener("click", () => playTrack(+btn.dataset.favoritePlay));
  });
}

export function aboutTeardown() {}

function onTabClick(e) {
  const btn = e.target.closest("[data-artist-tab]");
  if (!btn) return;
  const tabs = $("[data-artist-tabs]");
  tabs.querySelectorAll("[data-artist-tab]").forEach((b) => b.classList.toggle("is-active", b === btn));
  document.querySelectorAll("[data-artist-panel]").forEach((p) => { p.hidden = p.dataset.artistPanel !== btn.dataset.artistTab; });
}

function onStarClick() {
  const star = $("[data-star-btn]");
  const filled = star.classList.toggle("is-filled");
  star.setAttribute("aria-pressed", String(filled));
}
