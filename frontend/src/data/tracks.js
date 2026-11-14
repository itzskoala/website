// tracks.js
import { PLAYLISTS } from "./playlists.js";

export const TRACKS = [];
PLAYLISTS.forEach((p) => {
  p.trackIdx = p.tracks.map((t) => {
    TRACKS.push(t);
    return TRACKS.length - 1;
  });
});
