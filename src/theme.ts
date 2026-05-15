export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLOR = {
  bg: '#08080a',
  text: '#ebebeb',
  gold: '#C8860A',
  dim: '#3e3c3a',
  red: '#C84B0A',
  green: '#2A7A3B',
  muted: '#888580',
} as const;

export const CHAPTER_HUE = {
  0: 18,
  1: 38,
  2: 210,
  3: 350,
  4: 220,
  5: 30,
  6: 18,
} as const;

export const VOICEOVER_DURATION_SEC = 1148.66;
export const PART1_DURATION_SEC = 550.874875;
export const SILENCE_GAP_SEC = 0.6;
export const PART2_START_SEC = PART1_DURATION_SEC + SILENCE_GAP_SEC;

// Standard spring configs
export const SPRING = {
  text:    {damping: 200, stiffness: 120, mass: 0.6},  // no overshoot
  snappy:  {damping: 22,  stiffness: 180, mass: 0.5},  // UI
  playful: {damping: 14,  stiffness: 140, mass: 0.7},  // accent bounce
  default: {damping: 18,  stiffness: 120, mass: 0.6},  // standard
} as const;
