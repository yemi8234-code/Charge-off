import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../theme';
import {spring} from 'remotion';
import {MONO} from '../fonts';

type Props = {
  from?: number;
  to: number;
  localFrame: number;
  countDurationFrames: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: number;
  color?: string;
  direction?: 'up' | 'down';
};

export const AnimatedCounter: React.FC<Props> = ({
  from = 0,
  to,
  localFrame,
  countDurationFrames,
  prefix = '',
  suffix = '',
  decimals = 0,
  size = 96,
  color = COLOR.gold,
  direction = 'up',
}) => {
  const {fps} = useVideoConfig();

  const easing = direction === 'down'
    ? Easing.in(Easing.cubic)
    : Easing.out(Easing.cubic);

  const raw = interpolate(
    localFrame,
    [0, countDurationFrames],
    [from, to],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing},
  );

  const entrySpring = spring({
    frame: localFrame,
    fps,
    config: SPRING.snappy,
    durationInFrames: 18,
  });
  const entryY = (1 - entrySpring) * 24;
  const entryOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Comma format
  const formatted = raw.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // SFX hook: tick sound every 10 frames while counting
  // [SFX: tick at every 10th frame between 0 and countDurationFrames]

  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: size,
        fontWeight: 700,
        color,
        letterSpacing: '-0.04em',
        transform: `translateY(${entryY}px)`,
        opacity: entryOpacity,
        lineHeight: 1,
      }}
    >
      {prefix}{formatted}{suffix}
    </div>
  );
};
