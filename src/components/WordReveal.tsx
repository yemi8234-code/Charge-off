import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR} from '../theme';
import type {WordToken} from '../data/timing';

type Props = {
  words: WordToken[];
  startDelayFrames?: number;
};

const FINANCIAL_RE =
  /^\$?\d[\d,.]*(B|M|K|bn|m)?$|^\d{4}(s)?$|^\d{1,3}(,\d{3})+$/i;
const isYear = (raw: string) => /^\d{4}s?[,.]?$/.test(raw);
const isBigNumber = (raw: string) => {
  const stripped = raw.replace(/[,.?:;]$/g, '');
  return /^\$?\d[\d,]*(\.\d+)?$/.test(stripped) && stripped.replace(/[^0-9]/g, '').length >= 2;
};

const isAccent = (raw: string): boolean => {
  const stripped = raw.replace(/[,.?:;]$/g, '');
  if (isYear(stripped)) return true;
  if (FINANCIAL_RE.test(stripped)) return true;
  if (/^\$/.test(stripped)) return true;
  // Words that follow a number (billion, million, percent, dollars) – we accent the number,
  // not the unit. Keep accent contained.
  return false;
};

// Stagger relative to the word's own startFrame
const WORD_FADE_FRAMES = 10;
const WORD_RISE_PX = 28;

const Word: React.FC<{
  token: WordToken;
  startDelayFrames: number;
  staggerOffset: number;
}> = ({token, startDelayFrames, staggerOffset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const triggerFrame = token.startFrame + startDelayFrames + staggerOffset;
  const localFrame = frame - triggerFrame;

  const opacity = interpolate(
    localFrame,
    [0, WORD_FADE_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const rise = spring({
    frame: localFrame,
    fps,
    config: {mass: 0.4, damping: 28, stiffness: 180},
    durationInFrames: 24,
  });
  const translateY = (1 - rise) * WORD_RISE_PX;

  const scaleSpring = spring({
    frame: localFrame,
    fps,
    config: {mass: 0.4, damping: 28, stiffness: 180},
    durationInFrames: 24,
  });
  const scale = 0.91 + scaleSpring * 0.09;

  const accent = isAccent(token.raw);

  // Accent overshoot pulse for financial figures
  const overshoot = accent
    ? spring({
        frame: localFrame - 6,
        fps,
        config: {mass: 0.3, damping: 20, stiffness: 200},
        durationInFrames: 14,
      })
    : 0;
  const accentScale = accent ? 1.0 + Math.sin(overshoot * Math.PI) * 0.07 : 1.0;

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale * accentScale})`,
        color: accent ? COLOR.gold : COLOR.text,
        fontWeight: accent ? 800 : 500,
        fontSize: accent ? '1.0em' : '1em',
        marginRight: '0.32em',
        willChange: 'transform, opacity',
        letterSpacing: accent ? '-0.005em' : '-0.012em',
      }}
    >
      {token.raw}
    </span>
  );
};

export const WordReveal: React.FC<Props> = ({words, startDelayFrames = 0}) => {
  return (
    <>
      {words.map((w, i) => (
        <Word
          key={`${w.raw}-${i}-${w.startFrame}`}
          token={w}
          startDelayFrames={startDelayFrames}
          staggerOffset={0}
        />
      ))}
    </>
  );
};
