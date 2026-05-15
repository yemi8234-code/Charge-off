// Scene 2 — Hook P3: Lazarus, 94 years old, 7 days
// Timeline bar 1923 → 2018, dot travels, "7 DAYS" appears
// [SFX: whoosh at timeline draw; impact at 2018 dot land]
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

const LINE_W = 900;

export const P2Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 22});
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Timeline line draws left to right
  const lineProgress = interpolate(localFrame, [8, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });

  // Dot travels along the line then "breaks" at 2018
  const dotProgress = interpolate(localFrame, [55, 120], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2,
  });
  const dotX = dotProgress * LINE_W;

  // Label fade-ins: 1923 early, 2018 when dot arrives
  const label1923Opacity = interpolate(localFrame, [52, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const label2018Opacity = interpolate(localFrame, [125, 135], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // "70 YEARS" builds first
  const yearsOpacity = interpolate(localFrame, [130, 142], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const yearsSpring = spring({frame: localFrame - 130, fps, config: SPRING.snappy, durationInFrames: 16});

  // "7 DAYS" slams in after the dot lands
  const sevenDelay = 150;
  const sevenSpring = spring({frame: localFrame - sevenDelay, fps, config: SPRING.playful, durationInFrames: 14});
  const sevenOpacity = interpolate(localFrame, [sevenDelay, sevenDelay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Dot impact scale pulse
  const impactSpring = spring({frame: localFrame - 122, fps, config: SPRING.playful, durationInFrames: 12});
  const dotScale = dotProgress >= 1 ? 1 + Math.sin(impactSpring * Math.PI) * 0.5 : 1;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 48,
      opacity: entry * exitOpacity,
      transform: `translateY(${(1 - entry) * 40}px)`,
    }}>
      {/* Timeline */}
      <div style={{position: 'relative', width: LINE_W, height: 48}}>
        {/* Track */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: 2,
          width: LINE_W * lineProgress,
          backgroundColor: COLOR.dim,
          transform: 'translateY(-50%)',
        }} />

        {/* Tick marks */}
        {lineProgress > 0.05 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: 2,
            height: 14,
            backgroundColor: COLOR.muted,
            transform: 'translateY(-50%)',
          }} />
        )}
        {lineProgress > 0.99 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            width: 2,
            height: 14,
            backgroundColor: COLOR.red,
            transform: 'translateY(-50%)',
          }} />
        )}

        {/* Traveling dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: dotX,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: dotProgress >= 0.99 ? COLOR.red : COLOR.text,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          boxShadow: dotProgress >= 0.99 ? `0 0 18px ${COLOR.red}` : 'none',
        }} />

        {/* Year labels */}
        <div style={{
          position: 'absolute',
          top: 28,
          left: -8,
          fontFamily: MONO,
          fontSize: 12,
          color: COLOR.muted,
          letterSpacing: '0.15em',
          opacity: label1923Opacity,
        }}>1923</div>
        <div style={{
          position: 'absolute',
          top: 28,
          right: -8,
          fontFamily: MONO,
          fontSize: 12,
          color: COLOR.red,
          letterSpacing: '0.15em',
          opacity: label2018Opacity,
        }}>2018</div>
      </div>

      {/* 70 years built */}
      <div style={{
        fontFamily: MONO,
        fontSize: 13,
        color: COLOR.muted,
        letterSpacing: '0.3em',
        opacity: yearsOpacity,
        transform: `translateY(${(1 - yearsSpring) * 12}px)`,
        textTransform: 'uppercase',
      }}>
        70 years building · 7 days left to see it end
      </div>

      {/* 7 DAYS */}
      <div style={{
        display: 'flex',
        gap: 20,
        opacity: sevenOpacity,
        transform: `scale(${0.6 + sevenSpring * 0.4})`,
      }}>
        {[1,2,3,4,5,6,7].map((d) => {
          const dotVisible = spring({
            frame: localFrame - sevenDelay - d * 4,
            fps,
            config: SPRING.snappy,
            durationInFrames: 10,
          });
          return (
            <div key={d} style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: d === 7 ? COLOR.dim : COLOR.text,
              opacity: dotVisible * (d === 7 ? 0.25 : 0.9),
              transform: `scale(${dotVisible})`,
            }} />
          );
        })}
      </div>
    </div>
  );
};
