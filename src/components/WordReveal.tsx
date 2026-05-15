import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../theme';
import type {WordToken} from '../data/timing';

type Props = {
  words: WordToken[];
  startDelayFrames?: number;
};

const FINANCIAL_RE = /^\d{4}s?[,.]?$|^\d[\d,]*(\.\d+)?[BMK%]?[,.]?$/i;

const isAccent = (raw: string): boolean => {
  const s = raw.replace(/[,.?:;]$/g, '');
  return FINANCIAL_RE.test(s) || /^\$/.test(s);
};

// Wipe-up reveal: clip-path inset(100% → 0%) per word
const Word: React.FC<{token: WordToken; delayFrames: number}> = ({
  token,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const trigger = token.startFrame + delayFrames;
  const local = frame - trigger;

  // Clip-path wipe-up (inset from bottom shrinks to 0)
  const wipe = spring({
    frame: local,
    fps,
    config: SPRING.snappy,
    durationInFrames: 16,
  });
  const clipBottom = (1 - wipe) * 110; // overshoot slightly then settle

  // Subtle scale-in on top of the wipe
  const scl = spring({
    frame: local,
    fps,
    config: SPRING.default,
    durationInFrames: 18,
  });
  const scale = 0.94 + scl * 0.06;

  const accent = isAccent(token.raw);

  // Accent: gold + overshoot pop
  const pop = accent
    ? spring({frame: local - 4, fps, config: SPRING.playful, durationInFrames: 12})
    : 0;
  const popScale = accent ? 1 + Math.sin(pop * Math.PI) * 0.09 : 1;

  // [SFX: pop sound at trigger frame for gold accent words]

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        marginRight: '0.3em',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          clipPath: `inset(0 0 ${clipBottom}% 0 round 2px)`,
          transform: `scale(${scale * popScale})`,
          color: accent ? COLOR.gold : COLOR.text,
          fontWeight: accent ? 800 : 700,
          willChange: 'clip-path, transform',
        }}
      >
        {token.raw}
      </span>
    </span>
  );
};

export const WordReveal: React.FC<Props> = ({words, startDelayFrames = 0}) => (
  <>
    {words.map((w, i) => (
      <Word key={`${i}-${w.startFrame}`} token={w} delayFrames={startDelayFrames} />
    ))}
  </>
);
