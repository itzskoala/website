// state.js
import { TRACKS } from "../data/tracks.js";

export const state = {
  queue: TRACKS.map((_, i) => i),
  cur: -1,
  shuffle: false,
  repeat: false,
  yt: null,
  ytReady: false,
  wantPlay: -1,
  isPlaying: false,
  seeking: false,
  raf: 0,
  poll: null,
  errCount: 0,
  curVizId: null,
  curViz: null,
};
