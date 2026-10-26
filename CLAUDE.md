# CLAUDE.md

Guidance for working in this repo.

## What this is

Sri Kotala's personal portfolio, reimagined as a **Spotify-style single-page app**. The frontend
is vanilla HTML/CSS/JS — no framework, no build step, no frontend dependencies. It's gaining a
**minimal `/api` backend** (Node.js Vercel Functions) for the Voicemail feature only; see
"Backend (Voicemail)" below. Custom domain **srikotala.com** (see `CNAME`); currently on GitHub
Pages, migrating to Vercel so the API routes have somewhere to run. Remote: `github.com/itzskoala/website`.

## Files

- `index.html` — full page shell: sidebar, main pane, player bar, queue panel, lightbox. All markup
  for chrome lives here; view content is injected by JS.
- `app.js` — the whole frontend app (one IIFE). Data, routing, rendering, player, i18n, and the
  voicemail recorder (`vm*` functions near the bottom).
- `app.css` — all styles. Spotify-like dark theme with a light theme via `[data-theme]` on `<html>`.
- `assets/` — `covers/`, `docs/` (PDF thumbnails), `placeholders/` (project images), `photography/`,
  `music/`, `slideshow/`, plus headshots and logos.
- `api/voicemail.js` — the one backend route. Plain Node.js Vercel Function (no framework) —
  receives `{name, email, phone, mimeType, durationSeconds, audioBase64}` as JSON, uploads the
  audio to Vercel Blob, inserts a `voicemails` row (transcript/summary null), and **responds
  immediately** — then keeps running via `waitUntil()` (`@vercel/functions`) to transcribe
  (open-weight Whisper), summarize (open-weight instruct model — both through the official
  `@huggingface/inference` SDK's `InferenceClient`, no OpenAI anywhere), write those back, and
  email a notification through Resend, all in `finishInBackground()`. This split exists so the
  client's "Sent!" isn't stuck waiting on however long the AI calls take — it only waits on the
  blob upload + one DB insert. Every background step stays independently best-effort (wrapped so
  one failure, e.g. summary, doesn't skip the ones after it, like email). Model + provider for
  each HF call are separately configurable (`HF_WHISPER_MODEL`/`HF_WHISPER_PROVIDER`,
  `HF_SUMMARY_MODEL`/`HF_SUMMARY_PROVIDER`) — not every Inference Providers partner hosts every
  model, so picking the right (model, provider) pair matters more than either alone; verify a
  pairing before trusting it: `curl -s "https://huggingface.co/api/models/<id>?expand[]=inferenceProviderMapping"`.
  The summary call doubles as a **moderation gate**: `SUMMARY_SYSTEM_PROMPT` asks the model for
  one JSON object (`summary`, `category`, `worth_emailing`, `confidence`), parsed defensively by
  `extractJsonObject()` (strips markdown fences / stray prose, falls back to "not worth emailing"
  on anything unparseable — the safe default for an ambiguous case). Every message is still
  transcribed, summarized, and stored regardless of category; only ones marked `worth_emailing`
  *and* at/above `MIN_CONFIDENCE_TO_EMAIL` actually trigger the Resend email. `category` and
  `confidence` are both persisted columns, so "why wasn't this emailed" is always answerable from
  the DB.
- `db/schema.sql` — the `voicemails` table. Run it once against `DATABASE_URL`. Re-running it is
  safe (the `alter table ... add column if not exists` lines make it idempotent as the schema
  grows — that's how `category`/`confidence` got added to the already-live table).
- `package.json` — backend-only deps (`@huggingface/inference`, `@neondatabase/serverless`,
  `@vercel/blob`, `@vercel/functions`, `resend`). The frontend still has zero dependencies and
  no build step.
- `.env.example` — required env vars for the backend; see that file for what each one does.

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
  shuffle/repeat) fed by `PLAYLISTS`. A `<canvas>` visualizer runs alongside, driven by real
  per-track frequency data in `assets/viz/<videoId>.json` (one file per track, keyed by the
  YouTube video id `ytId()` already extracts) — a tiny derived numeric envelope (log-spaced band
  energies sampled over time), *not* the audio itself. The YouTube iframe's audio is cross-origin
  and never reachable by the page's Web Audio API, so these files are precomputed offline once
  (download track audio → FFT → keep only the resulting band-energy numbers → discard the audio)
  rather than analyzed live. `loadTrack()` kicks off `loadViz(id)` (fetched + cached in
  `vizCache`), and `draw()` indexes into it frame-by-frame using `yt.getCurrentTime()` so the bars
  track the actual song; any track missing a data file (or still loading) falls back to the old
  decorative sine-wave motion, so this degrades gracefully rather than breaking. Thumbnails
  (`nowArt`, playlist/track `queue-art`) start on `ytThumb()`'s `hqdefault.jpg` and get
  opportunistically swapped to `maxresdefault.jpg` by `upgradeThumb()` when that higher-res
  version actually exists (YouTube returns a small gray placeholder instead of a 404 for missing
  maxres thumbs, so `upgradeThumb` feature-detects via `naturalWidth` rather than trusting the
  request to fail).
- **Theme**: `[data-theme-toggle]` flips `html[data-theme]` between dark/light.
- **Lightbox**: click a photo to open; Escape or backdrop click closes.
- **Voicemail recorder**: `vmEnter()`/`vmTeardown()` are called from `route()` on entering/leaving
  the `voicemail` route — `vmEnter()` just resets the UI (mic button enabled/green); it does
  **not** call `getUserMedia`. The permission prompt only fires from `vmStartRecording()`, i.e.
  the moment someone actually taps the mic, never on page load. Records via `MediaRecorder`
  (format picked dynamically — `vmPickMimeType()`), previews locally (`vmClearPreview()` pauses
  and discards any prior recording's `<audio>` before a new one starts, so old/new playback can't
  overlap), then `vmSend()` POSTs base64 audio + fields to `/api/voicemail` — no client-side
  download; persistence is the backend's job. The mic is only ever opened for the duration of an
  actual permission check or recording — never left running idle.

## Backend (Voicemail)

The only backend surface in this repo. One route, one table, three third-party calls — Blob
(storage), Hugging Face (open-weight Whisper transcription + open-weight instruct-model summary),
Resend (email). No OpenAI anywhere in this flow — intentionally all open models, per project
preference. See `api/voicemail.js` for the full flow and `db/schema.sql` for the schema. `sender_key`
(normalized email, or digits-only phone as fallback) links a visitor's messages together across
submissions — that's what `is_repeat_sender` is derived from. There's no separate "date left"
column; format `created_at` as MM/DD/YYYY at display time instead of storing a redundant string.

`voice-message.py` / `email_notification.py` in the repo root are the original Colab prototypes
this backend is based on (Whisper transcription + local-Llama summary + raw `smtplib`) — they
don't run as-is in a serverless function (Colab-only imports, multi-GB local model weights, a
plaintext credential) and aren't wired into the site. Treat them as reference only.

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

- No build/lint/test tooling for the **frontend** — edit the source and open `index.html` (or
  push to deploy). The **backend** (`api/`) needs `npm install` once and `vercel dev` to test
  locally (plain `index.html` can't reach `/api/*`).
- Vanilla JS only on the frontend — do not introduce frameworks or a bundler there. Keep new
  backend dependencies in `api/` minimal and justified (see `package.json`'s existing four).
- Keep the single-IIFE structure in `app.js`; match the existing terse style.
- Escape interpolated content with the existing `esc()` helper when building HTML strings.
- Never hardcode secrets (API keys, passwords, tokens) in source — they go in env vars
  (`.env.example` documents the names; real values live in `.env.local` or the Vercel dashboard,
  never in a committed file).
