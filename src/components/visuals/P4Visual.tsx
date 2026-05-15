// Scene 4 — Rise P1: 1948, Army veteran, opens first store
// Timeline track + 1948 dot appears + store SVG draws in
// [SFX: tick at 1948 dot appear; draw sound at store outline]
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

const STORE_PATH = `M 0 60 L 0 28 L 50 4 L 100 28 L 100 60 Z`; // simple house/store shape
const DOOR_PATH = `M 38 60 L 38 40 L 62 40 L 62 60`; // door

export const P4Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 24});
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Track line draws left to right
  const lineProgress = interpolate(localFrame, [10, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1-t,2)});

  // 1948 dot pops
  const dotSpring = spring({frame: localFrame - 48, fps, config: SPRING.playful, durationInFrames: 14});
  const dotScale = 0.2 + dotSpring * 0.8;
  const dotOpacity = interpolate(localFrame, [48, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Year label
  const yearOpacity = interpolate(localFrame, [55, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const yearSpring = spring({frame: localFrame - 55, fps, config: SPRING.snappy, durationInFrames: 14});

  // Store outline draws in
  const storeProgress = interpolate(localFrame, [70, 130], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1-t,3),
  });
  const storeDashArray = 400;
  const storeDashOffset = storeDashArray * (1 - storeProgress);

  // "CHILDRENS BARGAIN TOWN" label
  const storeLabel = spring({frame: localFrame - 135, fps, config: SPRING.snappy, durationInFrames: 16});
  const storeLabelOpacity = interpolate(localFrame, [135, 145], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 44,
      opacity: entry * exitOpacity,
      transform: `translateY(${(1 - entry) * 40}px)`,
    }}>
      {/* Timeline row */}
      <div style={{position: 'relative', width: 700, height: 40}}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          height: 1.5,
          width: 700 * lineProgress,
          backgroundColor: COLOR.dim,
          transform: 'translateY(-50%)',
        }} />

        {/* 1948 dot at 20% of track */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '20%',
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: COLOR.gold,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          opacity: dotOpacity,
          boxShadow: `0 0 16px ${COLOR.gold}66`,
        }} />

        {/* 1948 label */}
        <div style={{
          position: 'absolute',
          top: 26,
          left: 'calc(20% - 16px)',
          fontFamily: MONO,
          fontSize: 13,
          color: COLOR.gold,
          letterSpacing: '0.15em',
          opacity: yearOpacity,
          transform: `translateY(${(1 - yearSpring) * 8}px)`,
        }}>
          1948
        </div>
      </div>

      {/* Store SVG */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
        <svg width={100} height={64} viewBox="0 0 100 64" fill="none">
          <path
            d={STORE_PATH}
            stroke={COLOR.text}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={storeDashArray}
            strokeDashoffset={storeDashOffset}
            fill="none"
          />
          {storeProgress > 0.7 && (
            <path
              d={DOOR_PATH}
              stroke={COLOR.dim}
              strokeWidth={2}
              strokeLinejoin="round"
              fill="none"
              opacity={interpolate(storeProgress, [0.7, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
            />
          )}
        </svg>

        <div style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.4em',
          color: COLOR.muted,
          textTransform: 'uppercase',
          opacity: storeLabelOpacity,
          transform: `translateY(${(1 - storeLabel) * 10}px)`,
        }}>
          Washington D.C. · Baby furniture
        </div>
      </div>
    </div>
  );
};
