# CLAUDE.md

Guidance for working in this repo.

## What this is

Sri Kotala's personal portfolio, reimagined as a **Spotify-style single-page app**. Vanilla
HTML/CSS/JS — no framework, no build step, no dependencies. Deployed via **GitHub Pages** to the
custom domain **srikotala.com** (see `CNAME`). Remote: `github.com/itzskoala/website`.

## Files

- `index.html` — full page shell: sidebar, main pane, player bar, queue panel, lightbox. All markup
  for chrome lives here; view content is injected by JS.
- `app.js` — the whole app (one IIFE). Data, routing, rendering, player, i18n.
- `app.css` — all styles. Spotify-like dark theme with a light theme via `[data-theme]` on `<html>`.
- `assets/` — `covers/`, `docs/` (PDF thumbnails), `placeholders/` (project images), `photography/`,
  `music/`, `slideshow/`, plus headshots and logos.

## Architecture

Everything is in `app.js` inside one IIFE. Two things to understand before editing:

### 1. Data lives in top-of-file constants

All content is hardcoded arrays/objects near the top of `app.js`:
`PROFILE`, `EXPERIENCE`, `PROJECTS` (~line 53), `PHOTOS`, `LINKS`, `PLAYLISTS`, `SECTIONS`.
To add/edit content (e.g. a new project), edit the relevant constant — don't touch markup.
Each `PROJECTS` entry: `{ id, title, kind, url, img, c1, c2 (gradient), tags[], desc }`.

### 2. Hash routing + render

`route()` reads `location.hash` and picks a `viewX()` function that returns an HTML string;
`render()` swaps it into `[data-main]`. `go(hash)` navigates. Routes: `home`, `about`,
`projects`, `projects/<id>`, `experience`, `photos`, `connect`, `search`. After every render,
`translateEl()` re-applies the active language.

### Other subsystems

- **Player**: YouTube IFrame API drives a Spotify-style player bar (play/pause/seek/volume/
  shuffle/repeat) fed by `PLAYLISTS`. A `<canvas>` audio-style visualizer runs alongside.
- **Theme**: `[data-theme-toggle]` flips `html[data-theme]` between dark/light.
- **Lightbox**: click a photo to open; Escape or backdrop click closes.

## Internationalization (READ before adding user-facing text)

English/Spanish toggle. The site **always loads in English** — language is intentionally NOT
persisted across reloads (see `memory/lang-default-english.md`).

- `I18N` (~line 658) maps English source strings → Spanish. `tstr(en)` looks up the active language.
- **Any new user-facing English string must get a matching `I18N` entry**, or it won't translate.
- Proper nouns stay untranslated: names, company/product/song titles, and **tech tags**
  (e.g. `Python`, `CrewAI`, `NLP`) are left as-is in both languages by convention.
- Count strings like `"N builds"` / `"N photos"` are handled by pattern in `esPattern()`.
- Search matches both English and Spanish text so queries work in either language.

## Conventions

- No build/lint/test tooling. Edit the source and open `index.html` (or push to deploy).
- Vanilla JS only — do not introduce frameworks or a bundler.
- Keep the single-IIFE structure in `app.js`; match the existing terse style.
- Escape interpolated content with the existing `esc()` helper when building HTML strings.
