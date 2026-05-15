export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLOR = {
  bg: '#0a0a0b',
  text: '#eae8e2',
  gold: '#C8860A',
  dim: '#4a4845',
  vignette: 'rgba(10,10,11,0.82)',
} as const;

export const CHAPTER_HUE = {
  0: 18,   // Hook — amber
  1: 38,   // Rise — warm gold
  2: 210,  // Deal — cool blue grey
  3: 350,  // Spiral — dim red
  4: 220,  // Collapse — cold blue
  5: 30,   // Reckoning — ash amber
  6: 18,   // Outro — back to amber
} as const;

export const VOICEOVER_DURATION_SEC = 1148.66;
export const PART1_DURATION_SEC = 550.874875;
export const SILENCE_GAP_SEC = 0.6;
export const PART2_START_SEC = PART1_DURATION_SEC + SILENCE_GAP_SEC;
