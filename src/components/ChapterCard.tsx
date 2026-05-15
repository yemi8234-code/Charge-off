import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR} from '../theme';

type Props = {
  cardStartFrame: number;
  cardDurationFrames: number;
  label: string;
  title: string;
};

export const ChapterCard: React.FC<Props> = ({
  cardStartFrame,
  cardDurationFrames,
  label,
  title,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - cardStartFrame;

  if (localFrame < 0 || localFrame > cardDurationFrames + 6) return null;

  // Gold line draw 0-22 frames
  const lineScale = spring({
    frame: localFrame,
    fps,
    config: {mass: 0.5, damping: 22, stiffness: 180},
    durationInFrames: 22,
  });

  // Label fade-in starts frame 12
  const labelOpacity = interpolate(
    localFrame,
    [12, 22],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Card overall fade out in final 20 frames
  const fadeStart = cardDurationFrames - 20;
  const overallOpacity = interpolate(
    localFrame,
    [fadeStart, cardDurationFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Stagger title words
  const titleWords = title.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: overallOpacity,
        zIndex: 50,
        backgroundColor: 'rgba(10,10,11,0.6)',
      }}
    >
      {/* Gold line top */}
      <div
        style={{
          width: '42%',
          height: 1,
          backgroundColor: COLOR.gold,
          marginBottom: 38,
          transform: `scaleX(${lineScale})`,
          transformOrigin: 'left center',
          boxShadow: '0 0 14px rgba(200,134,10,0.5)',
        }}
      />
      {/* Chapter label */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '0.42em',
          color: COLOR.dim,
          opacity: labelOpacity,
          marginBottom: 28,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      {/* Title with staggered words */}
      <div
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 92,
          color: COLOR.text,
          letterSpacing: '-0.025em',
          lineHeight: 1.0,
          display: 'flex',
          gap: '0.32em',
        }}
      >
        {titleWords.map((w, i) => {
          const wordTrigger = 18 + i * 5;
          const wordLocal = localFrame - wordTrigger;
          const wOpacity = interpolate(
            wordLocal,
            [0, 10],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          );
          const wSpring = spring({
            frame: wordLocal,
            fps,
            config: {mass: 0.4, damping: 28, stiffness: 180},
            durationInFrames: 24,
          });
          const wRise = (1 - wSpring) * 36;
          const wScale = 0.93 + wSpring * 0.07;
          return (
            <span
              key={w + i}
              style={{
                display: 'inline-block',
                opacity: wOpacity,
                transform: `translateY(${wRise}px) scale(${wScale})`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {/* Gold line bottom */}
      <div
        style={{
          width: '42%',
          height: 1,
          backgroundColor: COLOR.gold,
          marginTop: 38,
          transform: `scaleX(${lineScale})`,
          transformOrigin: 'right center',
          boxShadow: '0 0 14px rgba(200,134,10,0.5)',
        }}
      />
    </div>
  );
};
