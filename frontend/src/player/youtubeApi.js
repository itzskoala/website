// youtubeApi.js
import { $ } from "../utils/dom.js";
import { tstr } from "../i18n/translate.js";
import { state } from "./state.js";
import { draw } from "./visualizer.js";
import { startPoll, playPos } from "./controls.js";
import { syncQueue } from "./queuePanel.js";

const sp = $(".sp");
const iconPlay = $("[data-icon-play]"), iconPause = $("[data-icon-pause]");
const nowArtist = $("[data-now-artist]"), volEl = $("[data-volume]");

function reflectPlay() {
  sp.classList.toggle("playing", state.isPlaying);
  iconPlay.style.display = state.isPlaying ? "none" : "";
  iconPause.style.display = state.isPlaying ? "" : "none";
}

function onYtError() {
  state.errCount++;
  if (state.errCount >= state.queue.length) { state.errCount = 0; state.isPlaying = false; reflectPlay(); nowArtist.textContent = tstr("Unavailable — try another song"); return; }
  playPos(state.cur + 1);
}

function onYtState(e) {
  const S = YT.PlayerState;
  if (e.data === S.PLAYING) { state.isPlaying = true; state.errCount = 0; reflectPlay(); startPoll(); if (!state.raf) draw(); }
  else if (e.data === S.PAUSED) { state.isPlaying = false; reflectPlay(); }
  else if (e.data === S.ENDED) {
    state.isPlaying = false; reflectPlay();
    if (state.repeat) { state.yt.seekTo(0, true); state.yt.playVideo(); return; }
    if (((state.yt.getCurrentTime && state.yt.getCurrentTime()) || 0) < 1) return onYtError();
    state.errCount = 0; playPos(state.cur + 1);
  }
  syncQueue();
}

window.onYouTubeIframeAPIReady = function () {
  state.yt = new YT.Player("yt-host", {
    height: "1", width: "1",
    playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, origin: location.origin },
    events: {
      onReady: () => { state.ytReady = true; state.yt.setVolume(+volEl.value); if (state.wantPlay > -1) { const i = state.wantPlay; state.wantPlay = -1; playPos(i); } },
      onStateChange: onYtState,
      onError: onYtError,
    },
  });
};

(function loadYtApi() { const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); })();
