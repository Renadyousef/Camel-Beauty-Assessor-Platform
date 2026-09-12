# منصة التحكيم الذكية للإبل (بالذكاء الاصطناعي) — Frontend Prototype

A frontend-only React + Vite prototype demonstrating the full judging flow:
**Competition Setup → Upload Images → Processing → Results**.

There is no backend, no database, and no authentication. All data (team
names, uploaded images, results) lives only in React state for the current
browser session and is lost on reload — by design, per the approved scope.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build    # production build, output in dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  main.jsx                 entry point
  App.jsx                  screen routing + all shared state (step, teams, images)
  App.css / index.css      layout shell + global design tokens (colors, fonts, resets)
  config.js                DEMO_IMAGE_ERROR and other frontend-only demo switches
  icons.jsx                shared inline SVG icons (no emoji/icon fonts)
  data/mockResults.js      mock trait scores + the buildResults() function — the seam
                            where a real AI/API response will plug in later
  components/
    AppHeader/              top bar (logo, "مقارنة جديدة" on Results)
    StepIndicator/          the 3-step progress bar (Setup → Upload → Results)
    CompetitionSetup/       Screen 1
    ImageUpload/            Screen 2 (composes TeamUploadPanel × 2)
    TeamUploadPanel/        one team's "X / 20 صورة" header + grid
    ImageSlot/               a single numbered upload slot (filled / empty only)
    Processing/             the loading screen + its simulated progress + error demo
    Results/                Screen 3 (composes the pieces below)
    TeamResultCard/          one team's score + independent expand/collapse explanation
    TraitComparison/        the 8-trait table with bars
    TopCamels/               "Top 3" lists per team
    Button/                 shared button (primary / secondary / ghost)
```

## Where things live (for connecting the real backend later)

- **Mock results & explanation text** — `src/data/mockResults.js`. The
  `buildResults()` function takes team names (and optionally real per-trait
  scores) and returns everything the Results screen renders: the 8 trait
  rows, overall scores, the winner, and the two accordion explanations. Swap
  the `MOCK_TRAIT_SCORES` / `MOCK_TOP_CAMELS` constants — or the values
  passed into `buildResults()` — for a real API response; the function's
  shape doesn't need to change.
- **Simulated processing/loading** — `src/components/Processing/Processing.jsx`.
  A single `useEffect` drives `stageIndex` and `imagesAnalyzed` off elapsed
  time (`SIMULATED_DURATION_MS`). Replace that effect with real progress
  events (polling / WebSocket / SSE) from the analysis API when it exists;
  the rest of the component (stage list, progress bar, error UI) can stay as
  is.
- **Processing error demo** — `src/config.js` exports `DEMO_IMAGE_ERROR`
  (and `DEMO_ERROR_TEAM` / `DEMO_ERROR_CAMEL_NUMBER`). Set
  `DEMO_IMAGE_ERROR = true`, run the app, complete an upload and click
  "تحليل المنافسة" — Processing stops partway through and shows the
  "تعذر تحليل الصورة رقم …" message with a button back to Upload, which
  highlights that exact slot. This is **not** image validation — there is
  intentionally none in this app — it only simulates a failure the real CV
  pipeline could report mid-analysis.
- **Uploaded images** — kept only in React state in `App.jsx` as
  `URL.createObjectURL(file)` previews (no localStorage, nothing uploaded
  anywhere). Object URLs are revoked when an image is replaced or when
  "مقارنة جديدة" resets the app.

## Notes

- The interface is RTL end-to-end (`<html dir="rtl" lang="ar">` in
  `index.html`); components don't set `dir` individually.
- Design tokens (colors, radii, shadows) live in `src/index.css` as CSS
  custom properties and match the approved UI sketch exactly — components
  reference them via `var(--...)`, never hardcoded colors.
- `prefers-reduced-motion` is respected globally (`index.css`) and the
  Processing simulation also shortens itself when it's set.
