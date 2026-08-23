# KidSpace — frontend-only demo

A React demo that reimplements the feature set of [pandekdee.com](https://pandekdee.com/) — a Thai
parent–child "quality time" app — with a **pink pastel** theme.

**No backend, no database.** Every screen runs entirely in the browser; all state
(stars, progress, settings, favourites, feedback) lives in `localStorage`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run lint
npx prettier --write "src/**/*.{js,jsx}"
```

## Stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | react-router-dom 7 (lazy-loaded routes) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/index.css`) |
| Audio | Web Speech API (TTS + speech recognition), Web Audio for game sounds |
| Storage | `localStorage` via `src/lib/storage.js` |

## Deployment

Pushing to `main` builds the app and publishes it to GitHub Pages.

| Job | Runs on | Does |
|---|---|---|
| `build` | pushes to `main`, all PRs, manual | `npm ci` → format check → lint → build; on non-PR runs it also resolves the Pages base path and uploads the artifact |
| `deploy` | pushes to `main`, manual — only if `build` passed | publishes the artifact to GitHub Pages |

Both live in `.github/workflows/ci.yml`. Deployment is gated on the checks: a
push that fails formatting, lint, or the build never reaches Pages.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**. Then push to `main` (or run the deploy
workflow manually from the Actions tab). The site lands at
`https://<owner>.github.io/<repo>/`.

### How the base path works

A Pages project site is served from `/<repo>/`, not the domain root, so:

- `actions/configure-pages` reports the path, and the workflow passes it to the
  build as `VITE_BASE`; `vite.config.js` falls back to `/` for local dev and for
  user/org sites served from the root.
- `BrowserRouter` takes its `basename` from `import.meta.env.BASE_URL`, so routes
  resolve correctly under the subpath.
- Pages has no SPA rewrite rule, so a build-time plugin writes `dist/404.html` as a
  copy of `index.html`. A deep link like `/activities/peekaboo` is handed back to
  the app, which then routes it client-side. The plugin also drops a `.nojekyll`
  file.

To reproduce a Pages build locally:

```bash
VITE_BASE=/kidspace-web/ npm run build
VITE_BASE=/kidspace-web/ npm run preview   # http://localhost:4173/kidspace-web/
```

## Design

The app has its own identity rather than mirroring the reference site's.

**Layout.** A grouped sidebar on desktop and a five-slot tab bar on phones — real
app navigation, not a phone-shaped column inside a marketing page. Content is a
fluid multi-column canvas (`max-w-1060`); reading and form screens cap their own
measure, and game boards cap at 520px so a wide window never stretches them.

**Shape language.** Cut-paper cards: a 1.5px inked edge with a hard offset
shadow, no glassy blur. Icon chips use a signature asymmetric radius (`.petal`),
pinned cards get a strip of washi tape (`.tape`), and pressing a control sinks it
onto its own shadow. The page sits on warm cream with a faint dot grid.

**Type.** Mali (a handwritten Thai + Latin face) for display, IBM Plex Sans Thai
for body — chosen so headings feel handmade while long articles stay readable.
Letter-spacing is never applied to Thai, which breaks word grouping.

**Colour.** Pink pastel accent (`brand-50 … brand-900`, `brand-500 #ef6f96`) over
warm paper (`paper`, `cream`, `surface`, `edge`) and warm plum ink
(`ink-300 … ink-900`), with six craft pastels for categories — `clay · sage ·
sky · butter · lilac · blush`, each with a matching `-ink` text colour.

All of it lives as Tailwind v4 `@theme` tokens in `src/index.css`; components map
tint names through `TINTS` in `src/components/ui.jsx` and never hard-code a
colour, so retheming is a one-file change.

**Component vocabulary:** `Paper` · `Sticker` · `Chip` · `Shelf` ·
`SectionTitle` (with a hand-drawn swash) · `Tile` · `Badge` · `Progress` ·
`Stars`.

## Features

### Content
| Route | What it does |
|---|---|
| `/` | Home — picks a mood for the current time of day, an inline minute-picker, a taped "today's pick", and editorial shelves |
| `/play` | A live mixer: three always-visible segmented controls, results re-mix in place — no wizard, no confirm step |
| `/activities`, `/activities/:id` | 24 activities, category filters, step checklist, live countdown timer, "why it works" |
| `/articles`, `/articles/:id` | 16 parenting articles, 7 categories, search, bold-aware renderer, save-for-later |
| `/stories`, `/stories/:id` | 6 bedtime stories with a paged reader and talk-about-it prompts |
| `/reading`, `/reading/:id` | 9 comprehension passages across 3 levels, with quizzes and Thai read-aloud |

### English
| Route | What it does |
|---|---|
| `/speak`, `/speak/:id` | 7 lessons × 4 levels (repeat → read → fill the gap → say it yourself), TTS + **mic scoring** via `SpeechRecognition` |
| `/words`, `/words/:id` | 5 word sets × 8 words, three modes: listen · drag-and-drop match · read |
| `/talk/daily`, `/talk/daily/:id` | 26 everyday scenes across 4 times of day, ~6 phrases each, tap-to-hear + slow playback |

### Games — all playable
- **`/games`** (8): มากกว่า–น้อยกว่า · ลิงบวกลบ · นับแล้วหา · รถไฟแพตเทิร์น · ลูกแก้วผลรวม · จรวดเส้นจำนวน · โรงงานมัดสิบ · ตกปลาพยัญชนะ
- **`/brain`** (6): ตารางดาว (Schulte, timed, personal best) · เม่นห้ามแตะ (go/no-go) · เส้นพันกัน (SVG line tracing) · ไซมอนสัตว์ (with real tones) · อะไรหายไป · เหมือนเดิมไหม (1-back)
- **`/versus`** (6): XO หมากเดิน · XO โอเอกซ์ (with a **minimax** AI) · จับคู่ภาพ · หาตัวที่ต่าง (split-screen) · บันไดงูคำศัพท์ · ใครเอ่ย? (deduction over 24 characters)

### Tools
| Route | What it does |
|---|---|
| `/coding` | Bolt the robot — 3 worlds × 12 procedurally generated, always-solvable grid levels; arrow programming, a repeat block, crash debugging, collectible stars |
| `/draw` | Canvas drawing room — 6 brushes (crayon/neon/rainbow/glitter/stickers/eraser), 10 colours, 4 sizes, undo, free-draw and dotted **tracing** for shapes · numbers · ก.ไก่ · A–Z, random prompts |
| `/classroom` | Teaching aids: listen-to-numbers quiz, an 8-key **melodica** with follow-the-light songs, flashcards |
| `/quiz/parent-type` | 32-question parenting-style quiz scored on two axes (warmth × structure) into 4 result types, after Baumrind / Maccoby & Martin |
| `/settings` | Master sound toggle, 4 speech speeds, device voice picker with previews, TH/EN, star count, reset-all |
| `/feedback` | Topic, star rating, free text — stored locally |

### Cross-cutting
- **TH / EN toggle** on the app shell (`t(th, en)` from `useApp()`)
- **Sound toggle** and **speech-rate** setting applied globally
- **Stars** earned from finishing anything; progress marks completed items across the app
- Sidebar navigation on desktop, tab bar on phones; the same screens serve both
- `prefers-reduced-motion` honoured; every Web Speech / Web Audio call degrades silently when unsupported

## Layout

```
src/
  components/   Shell (layout + headers), GameShell, ui.jsx, Icon.jsx
  store/        AppContext — lang, sound, rate, voice, stars, progress, favourites
  lib/          storage · speech (TTS + blips) · scroll
  data/         activities · articles · stories · words · speak · talk
                reading · quiz · coding · catalog
  pages/        one file per screen
  games/        8 logic games
  brain/        6 brain-gym games
  versus/       6 two-player games
```

## Known limits of the demo

- Nothing is persisted beyond this browser — clearing site data resets everything.
- The TH/EN toggle translates the app shell and UI copy; article and story bodies stay in Thai.
- Speech synthesis and recognition depend on the browser; Safari and Chrome differ in available voices, and recognition is Chrome-only.
- Drawings are not saved to disk.
- Content is original writing modelled on the reference site's structure, not copied from it.
