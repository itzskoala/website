# CLAUDE.md

Guidance for working in this repo.

## What this is

Sri Kotala's personal portfolio, reimagined as a **Spotify-style single-page app**. The frontend
is vanilla JS using native ES modules (`<script type="module">`) — no bundler, no framework — plus
a minimal `/api` backend (Node.js Vercel Functions) for the Voicemail feature only; see
"Backend (Voicemail)" below. Custom domain **srikotala.com** (see `CNAME`), deployed on Vercel
(`vercel.json` points its static build at `frontend/`). Remote: `github.com/itzskoala/website`.

Because the frontend uses ES modules and `import ... with { type: "json" }` for the per-project
data files, `frontend/index.html` must be served over `http(s)://` (e.g. `vercel dev`, or any
static file server) — opening it directly via `file://` will not load the module graph.

## Layout

```
frontend/            static site, served as the Vercel "outputDirectory"
  index.html         page shell: sidebar, main pane, player bar, queue panel, lightbox
  404.html
  favicon.png/.svg, robots.txt, sitemap.xml
  styles/            app.css split one file per UI area (base, sidebar, header, home, hero, …)
  assets/             covers/, docs/ (PDF thumbnails), placeholders/, photography/, music/,
                      slideshow/, viz/ (per-track visualizer data), plus headshots/logos
  src/
    main.js           entry point — wires up every subsystem below, then calls route()
    data/             content constants: profile.js, experience.js, photos.js, links.js,
                      playlists.js, tracks.js (derives TRACKS from playlists.js), sections.js,
                      pokedex.js, and projects/ — one JSON file per project + index.js that
                      imports them (via `with { type: "json" }`) into a PROJECTS array
    i18n/             strings.js (the English→Spanish I18N map) + translate.js (tstr/translateEl/
                      applyLang — English is always the language on load, never persisted)
    utils/            dom.js ($/esc/grad), icons.js (shared inline svg strings), youtube.js
                      (ytId/ytThumb/upgradeThumb)
    router/           router.js (route()/go()/render()), reveals.js (scroll-reveal
                      IntersectionObserver), titles.js (per-route <title>)
    views/            one file per route (home/about/projects/experience/photos/connect/
                      voicemail/search) + cards.js for the shared project/photo/tile card markup
    voicemail/        recorder.js — the whole in-browser recorder (mic permission, MediaRecorder,
                      validation, preview, POST to /api/voicemail)
    player/           state.js (shared mutable player state), youtubeApi.js (YT IFrame API +
                      play/pause state machine), visualizer.js (canvas bars + viz data loading),
                      controls.js (transport buttons, volume, loadTrack), queuePanel.js
                      (library/queue popover), mobileAudioUnlock.js
    ui/               theme.js, languageMenu.js, mobileNav.js, lightbox.js, fabMenu.js,
                      clickDelegation.js (the one global click handler), sound.js (synthesized
                      UI tones), uiSounds.js (hover/click/toggle wiring), confetti.js
                      (logo-click burst), selectionColor.js
    pokemon/          pokemonWidget.js — the sidebar roaming-pet easter egg
api/
  voicemail.js        thin Vercel Function entry point — required to live here (Vercel only
                      auto-detects functions under /api at the repo root); just forwards to
                      backend/src/voicemailHandler.js
backend/
  src/                voicemailHandler.js (the request handler) plus one focused module per
                      concern: blobStorage.js, transcribe.js, summarize.js, db.js, emailNotify.js,
                      finishInBackground.js, config.js, jsonExtract.js, logHfError.js
  database/
    schema.sql        the `voicemails` table — run once against DATABASE_URL, safe to re-run
package.json           backend deps (`@huggingface/inference`, `@neondatabase/serverless`,
                       `@vercel/blob`, `@vercel/functions`, `resend`) — stays at the repo root;
                       npm/Vercel both require it there. The frontend has zero dependencies.
.env.example           required env var names — see the file for what each one does
vercel.json            `{ "outputDirectory": "frontend" }` so the static site serves from the
                       repo root while /api keeps working from its required location
```

A one-line header comment names every source file (`// filename.js`, `/* filename.css */`,
`<!-- filename.html -->`); beyond that, this codebase intentionally carries no inline comments —
the "why" behind non-obvious decisions (model/provider pairing, the moderation gate, the
background-job split, zoom compensation, etc.) lives in this document instead. Keep it updated
when those decisions change.

## Architecture

### 1. Data lives in `frontend/src/data/`

Each constant (`PROFILE`, `EXPERIENCE`, `PHOTOS`, `LINKS`, `PLAYLISTS`, `SECTIONS`, `POKEDEX_BY_GEN`)
is its own module. `PROJECTS` is the exception: it's assembled in `data/projects/index.js` from
one JSON file per project (`data/projects/<id>.json`), each shaped
`{ id, title, kind, url, img, c1, c2, tags[], desc, site? }`. To add a project, add a new JSON
file and one import line in `projects/index.js`; to edit one, edit its JSON file directly.

### 2. Hash routing + render

`router/router.js`'s `route()` reads `location.hash` and picks a `view*()` function (one per file
under `views/`) that returns `{ tint, html }`; `render()` swaps `html` into `[data-main]`. `go(hash)`
navigates. Routes: `home`, `about`, `projects`, `projects/<id>`, `experience`, `photos`, `connect`,
`search`, `voicemail`. After every render, `translateEl()` (from `i18n/translate.js`) re-applies
the active language.

### Other subsystems

- **Player** (`src/player/`): YouTube IFrame API drives a Spotify-style player bar (play/pause/
  seek/volume/shuffle/repeat) fed by `data/playlists.js`. A `<canvas>` visualizer
  (`player/visualizer.js`) runs alongside, driven by real per-track frequency data in
  `assets/viz/<videoId>.json` (one file per track, keyed by the YouTube video id `ytId()`
  extracts) — a tiny derived numeric envelope (log-spaced band energies sampled over time), *not*
  the audio itself. The YouTube iframe's audio is cross-origin and never reachable by the page's
  Web Audio API, so these files are precomputed offline once (download track audio → FFT → keep
  only the resulting band-energy numbers → discard the audio) rather than analyzed live.
  `controls.js`'s `loadTrack()` kicks off `loadViz(id)` (fetched + cached in `visualizer.js`'s
  `vizCache`), and `draw()` indexes into it frame-by-frame using `yt.getCurrentTime()` so the bars
  track the actual song; any track missing a data file (or still loading) falls back to the old
  decorative sine-wave motion, so this degrades gracefully rather than breaking. Thumbnails
  (`nowArt`, playlist/track `queue-art`) start on `ytThumb()`'s `hqdefault.jpg` and get
  opportunistically swapped to `maxresdefault.jpg` by `upgradeThumb()` (in `utils/youtube.js`)
  when that higher-res version actually exists (YouTube returns a small gray placeholder instead
  of a 404 for missing maxres thumbs, so `upgradeThumb` feature-detects via `naturalWidth` rather
  than trusting the request to fail). `controls.js` and `player/queuePanel.js` import each other
  (`playPos` / `syncQueue`) — that's a real mutual dependency (the transport needs to refresh the
  queue highlight, the queue needs to be able to start playback), not an accident; both usages are
  inside function bodies, so the circular ES module import resolves fine.
- **Theme** (`ui/theme.js`): defaults to the OS's `prefers-color-scheme` (falling back to light
  if that can't be detected) unless a theme was already saved to `localStorage`;
  `[data-theme-toggle]` flips `html[data-theme]` between dark/light afterward.
- **Lightbox** (`ui/lightbox.js`): click a photo to open; Escape or backdrop click closes.
- **Voicemail recorder** (`voicemail/recorder.js`): `vmEnter()`/`vmTeardown()` are called from
  `route()` on entering/leaving the `voicemail` route — `vmEnter()` just resets the UI (mic button
  enabled/green); it does **not** call `getUserMedia`. The permission prompt only fires from
  `vmStartRecording()`, i.e. the moment someone actually taps the mic, never on page load.
  Records via `MediaRecorder` (format picked dynamically — `vmPickMimeType()`), previews locally
  (`vmClearPreview()` pauses and discards any prior recording's `<audio>` before a new one starts,
  so old/new playback can't overlap), then `vmSend()` POSTs base64 audio + fields to
  `/api/voicemail` — no client-side download; persistence is the backend's job. The mic is only
  ever opened for the duration of an actual permission check or recording — never left running
  idle.
- **Sound + confetti** (`ui/sound.js`, `ui/uiSounds.js`, `ui/confetti.js`): `sound.js` is a small
  set of synthesized Web Audio blips (`playClick`/`playToggle`/`playSuccess`/`playChime` — no
  audio files to load or license), ported from the `quotable_site` project's `lib/sound.ts`.
  `uiSounds.js` wires those tones to hover/click/toggle events sitewide, gated by the
  `[data-sound-toggle]` mute state in `localStorage`. The logo/brand click triggers both
  `playChime()` and a confetti burst (`confetti.js`): a canvas re-implementation of
  `quotable_site`'s `confetti-burst.tsx` physics — closed-form exponential-drag + gravity motion
  (not frame-by-frame Euler integration, which is why it stays smooth regardless of frame rate),
  per-piece tumble (a cosine-driven `scaleY` flip), and a quadratic ease-out fade near the end of
  each piece's 1.6s lifetime. Colors use this site's own gold/maroon palette rather than
  `quotable_site`'s pink, and speed/gravity are scaled by the inverse of `html{zoom:90%}` (see
  `app.css`'s zoom quirk) so the burst doesn't look slower than it should at that fixed zoom.
- **Pokémon widget** (`pokemon/pokemonWidget.js`): a VS Code Pokémon-style roaming pet, docked as
  a third sidebar panel below the library list — https://github.com/jakobhoeg/vscode-pokemon.
  Sprites are hotlinked straight from that project's public repo (idle/walk gifs per species, 5
  gens) rather than vendored here, so there's nothing to keep in sync. Markup lives in
  `<aside class="side">` in `index.html`, outside the router's `[data-main]`, so it survives every
  route change; state is session-only — a refresh resets to one fresh random Pokémon. Folder
  names in `data/pokedex.js` mirror jakobhoeg/vscode-pokemon's `media/` directory exactly (used
  verbatim to build each sprite's raw.githubusercontent.com URL) — don't "fix" any odd spelling
  there.

## Backend (Voicemail)

The only backend surface in this repo. One route, one table, three third-party calls — Blob
(storage), Hugging Face (open-weight Whisper transcription + open-weight instruct-model summary),
Resend (email). No OpenAI anywhere in this flow — intentionally all open models, per project
preference.

`api/voicemail.js` is a thin Vercel Function entry point (it has to live under `/api` at the repo
root — that's Vercel's zero-config convention for detecting functions, independent of
`vercel.json`'s `outputDirectory`) that forwards to `backend/src/voicemailHandler.js`. That handler
uploads the recorded audio to Vercel Blob (`backend/src/blobStorage.js`), inserts a `voicemails`
row (`backend/src/db.js`; transcript/summary start null), and **responds immediately** — then
keeps running via `waitUntil()` (`@vercel/functions`) to transcribe (`backend/src/transcribe.js`),
summarize (`backend/src/summarize.js`), write those back, and email a notification
(`backend/src/emailNotify.js`), all orchestrated by `backend/src/finishInBackground.js`. This split
exists so the client's "Sent!" isn't stuck waiting on however long the AI calls take — it only
waits on the blob upload + one DB insert. Every background step stays independently best-effort
(wrapped so one failure, e.g. summary, doesn't skip the ones after it, like email). Model +
provider for each HF call are separately configurable (`HF_WHISPER_MODEL`/`HF_WHISPER_PROVIDER`,
`HF_SUMMARY_MODEL`/`HF_SUMMARY_PROVIDER` in `backend/src/config.js`) — not every Inference
Providers partner hosts every model, so picking the right (model, provider) pair matters more than
either alone; verify a pairing before trusting it:
`curl -s "https://huggingface.co/api/models/<id>?expand[]=inferenceProviderMapping"`.

The summary call (`backend/src/summarize.js`) doubles as a **moderation gate**: its system prompt
asks the model for one JSON object (`summary`, `category`, `worth_emailing`, `confidence`), parsed
defensively by `extractJsonObject()` (`backend/src/jsonExtract.js` — strips markdown fences/stray
prose, falls back to "not worth emailing" on anything unparseable — the safe default for an
ambiguous case). Every message is still transcribed, summarized, and stored regardless of
category; only ones marked `worth_emailing` *and* at/above `MIN_CONFIDENCE_TO_EMAIL` (in
`config.js`) actually trigger the Resend email. `category` and `confidence` are both persisted
columns, so "why wasn't this emailed" is always answerable from the DB.

`backend/database/schema.sql` is the `voicemails` table. Run it once against `DATABASE_URL`.
Re-running it is safe (the `alter table ... add column if not exists` lines make it idempotent as
the schema grows — that's how `category`/`confidence` got added to the already-live table).
`sender_key` (normalized email, or digits-only phone as fallback — `senderKeyFor()` in
`backend/src/db.js`) links a visitor's messages together across submissions — that's what
`is_repeat_sender` is derived from. There's no separate "date left" column; format `created_at`
as MM/DD/YYYY at display time instead of storing a redundant string.

## Internationalization (READ before adding user-facing text)

English/Spanish toggle. The site **always loads in English** — language is intentionally NOT
persisted across reloads.

- `frontend/src/i18n/strings.js` maps English source strings → Spanish. `tstr(en)` (in
  `translate.js`) looks up the active language.
- **Any new user-facing English string must get a matching entry in `strings.js`**, or it won't
  translate.
- Proper nouns stay untranslated: names, company/product/song titles, and **tech tags**
  (e.g. `Python`, `CrewAI`, `NLP`) are left as-is in both languages by convention.
- Count strings like `"N builds"` / `"N photos"` are handled by pattern in `esPattern()`
  (`translate.js`).
- Search matches both English and Spanish text so queries work in either language.

## Conventions

- No build/lint/test tooling for the **frontend** — edit the source and serve `frontend/` over
  `http(s)://` (`vercel dev`, or any static file server — not `file://`, since ES modules and JSON
  module imports require a real origin). The **backend** (`api/`, `backend/`) needs `npm install`
  once and `vercel dev` to test locally.
- Vanilla JS only on the frontend — ES modules are fine (native browser feature, zero build step),
  but do not introduce a framework or a bundler there. Keep new backend dependencies in
  `package.json` minimal and justified (see its existing five).
- Keep each module focused on one concern — that's the whole point of this file layout. A new
  feature gets its own file(s) rather than growing an existing one past a screenful or two.
- Escape interpolated content with `utils/dom.js`'s `esc()` helper when building HTML strings.
- Never hardcode secrets (API keys, passwords, tokens) in source — they go in env vars
  (`.env.example` documents the names; real values live in `.env.local` or the Vercel dashboard,
  never in a committed file).
- Comments: this codebase intentionally has none beyond the one-line file-name header at the top
  of each file. If you need to explain a non-obvious decision, put it here in `CLAUDE.md` instead
  of in the code.
