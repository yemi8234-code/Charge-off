// Default visual — extracts key number from paragraph + gold accent line
// Used for all scenes beyond index 5
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING, CHAPTER_HUE} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {
  localFrame: number;
  sceneDurationFrames: number;
  chapter: number;
  keyFact?: string;  // manually provided key stat for this paragraph
  keyLabel?: string;
};

export const DefaultVisual: React.FC<Props> = ({
  localFrame,
  sceneDurationFrames,
  chapter,
  keyFact,
  keyLabel,
}) => {
  const {fps} = useVideoConfig();
  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 22});
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitY = interpolate(localFrame, [exitStart, sceneDurationFrames], [0, 16], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Gold line draws
  const lineScale = spring({frame: localFrame - 8, fps, config: {damping: 22, stiffness: 180, mass: 0.5}, durationInFrames: 24});

  // Key fact wipe up
  const factSpring = spring({frame: localFrame - 18, fps, config: SPRING.snappy, durationInFrames: 20});
  const factClip = (1 - factSpring) * 105;
  const factOpacity = interpolate(localFrame, [18, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Label
  const labelSpring = spring({frame: localFrame - 30, fps, config: SPRING.snappy, durationInFrames: 16});
  const labelOpacity = interpolate(localFrame, [30, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (!keyFact) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      opacity: entry * exitOpacity,
      transform: `translateY(${(1 - entry) * 36 + exitY}px)`,
    }}>
      {/* Gold line */}
      <div style={{
        width: 280,
        height: 1.5,
        backgroundColor: COLOR.gold,
        transform: `scaleX(${lineScale})`,
        transformOrigin: 'left center',
        boxShadow: `0 0 10px hsla(${hue}, 70%, 50%, 0.4)`,
      }} />

      {/* Key fact */}
      <div style={{overflow: 'hidden'}}>
        <div style={{
          fontFamily: SYNE,
          fontSize: 88,
          fontWeight: 800,
          color: COLOR.gold,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          clipPath: `inset(0 0 ${factClip}% 0 round 2px)`,
          opacity: factOpacity,
        }}>
          {keyFact}
        </div>
      </div>

      {/* Label */}
      {keyLabel && (
        <div style={{
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: '0.35em',
          color: COLOR.muted,
          textTransform: 'uppercase',
          opacity: labelOpacity,
          transform: `translateY(${(1 - labelSpring) * 10}px)`,
        }}>
          {keyLabel}
        </div>
      )}
    </div>
  );
};
