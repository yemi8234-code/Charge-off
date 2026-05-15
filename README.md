# Charge-Off — Toys R Us Documentary

A cinematic motion-graphic documentary built with Remotion.

## What's in here

```
scripts/                  — voice scripts (cleaned for CapCut)
public/voiceover.mp3      — concatenated narration (Part 1 + 0.6s gap + Part 2, 19:08)
src/
  Composition.tsx         — main composition
  Root.tsx                — Remotion registration
  theme.ts                — palette, hues, audio constants
  data/
    script.ts             — narration paragraphs + chapter map
    timing.ts             — even-distribution word timings (best effort)
  components/
    SceneBackground.tsx   — drifting orb + grain + Ken Burns
    WordReveal.tsx        — per-word spring reveals + financial figure detection
    ChapterCard.tsx       — chapter intro overlay with gold line draw
    SceneAccentLine.tsx   — 1px gold accent line under text
    SideMarkers.tsx       — chapter dots + timecode + brand
    Vignette.tsx          — radial darkening
    FilmGrain.tsx         — animated SVG noise
```

## Rendering — runs locally, not in this remote environment

This remote container cannot render the final video because Chromium cannot be
installed (the network allowlist blocks Remotion's headless-shell download).
Render on your local machine:

```bash
git clone <this repo>
cd Charge-off
git checkout claude/charge-off-script-template-WFMb9
npm install

# Download the headless Chrome Remotion uses (one-time, ~150 MB):
npm run ensure-browser

# Render the full 19:08 video at 1920x1080:
npm run build

# Mix the voiceover audio onto the rendered MP4:
npm run mix
# Final file: output/chargeoff_final.mp4
```

For an interactive preview / scrubbing while you tweak:

```bash
npm run studio
```

For a half-resolution preview render (much faster):

```bash
npm run build-fast
```

## Motion design — what is happening on screen

- **Background:** Two drifting radial orbs, hue-shifted per chapter, slow Ken
  Burns scale (1.0 → 1.07), animated SVG film grain, radial vignette.
- **Word reveals:** Each word springs in (mass 0.4, damping 28, stiffness 180)
  with 28px translateY, opacity fade, scale 0.91 → 1.0.
- **Financial figures and years:** Detected automatically and rendered in
  warm gold (#C8860A) with a brief overshoot pulse to 1.07x scale.
- **Scene accent line:** 1px gold line, 38% width, drawn via scaleX spring.
- **Chapter cards:** Full-screen overlay with gold line draw, JetBrains Mono
  label, Syne Bold title with per-word stagger, fade-out in final 20 frames.
- **Side markers:** Chapter progress dots on the right edge, JetBrains Mono
  timecode on the bottom-left, "CHARGE OFF" brand on the bottom-right.

## Timing approximation

Without a Pexels API key or a word-level transcription pass, the word reveals
are timed by **even distribution across the audio duration**:

- Part 1 (1157 words → 550.87s): ≈ 0.476s per word + punctuation pauses
- Part 2 (1275 words → 596.79s): ≈ 0.468s per word + punctuation pauses

Punctuation slows the cadence:
- `.` and `?` → 220ms extra
- `:` and `;` → 140ms extra
- `,` → 70ms extra

This is best-effort sync. For frame-perfect alignment, run Whisper locally:

```bash
pip install openai-whisper
whisper public/voiceover.mp3 --model medium --word_timestamps True --output_format json
```

Then replace `src/data/timing.ts` with a parser that consumes the Whisper
output. The rest of the pipeline already expects the same `WordToken` shape.

## To change

- **Per-chapter colors:** edit `CHAPTER_HUE` in `src/theme.ts`
- **Font sizes / leading:** edit `Composition.tsx`, the narration block style
- **Card duration:** edit `cardDuration` in `src/data/timing.ts`
- **Add scene backgrounds (footage):** drop MP4s into `public/scenes/`, then
  read them from `SceneBackground.tsx` using `staticFile('scenes/scene_0.mp4')`
