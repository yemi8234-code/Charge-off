// Scene 0 — Hook P1: 735 stores counting down; 33,000 jobs as dot grid
// [SFX: whoosh at frame 0; tick every 10 frames during counter; pop at frame landing on 0]
import React from 'react';
import {Easing, interpolate, spring, useVideoConfig} from 'remotion';
import {AnimatedCounter} from '../AnimatedCounter';
import {COLOR} from '../../theme';
import {MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

const COLS = 33;
const ROWS = 10;
const TOTAL_DOTS = COLS * ROWS; // 330 dots ≈ 100 people each

export const P0Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const countFrames = Math.round(sceneDurationFrames * 0.75);

  // Entry
  const entry = spring({frame: localFrame, fps, config: {damping: 18, stiffness: 120, mass: 0.6}, durationInFrames: 24});
  const entryY = (1 - entry) * 40;

  // Exit
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitY = interpolate(localFrame, [exitStart, sceneDurationFrames], [0, 18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // How many dots are "off" — blink out sequentially over scene
  const offCount = Math.floor(
    interpolate(localFrame, [0, countFrames], [0, TOTAL_DOTS], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.in(Easing.quad),
    }),
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        transform: `translateY(${entryY + exitY}px)`,
        opacity: entry * exitOpacity,
      }}
    >
      {/* Counter */}
      <AnimatedCounter
        from={735}
        to={0}
        localFrame={localFrame}
        countDurationFrames={countFrames}
        suffix=" stores"
        size={88}
        color={COLOR.red}
        direction="down"
      />

      {/* Dot grid — each dot = 100 people */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
        {Array.from({length: ROWS}).map((_, r) => (
          <div key={r} style={{display: 'flex', gap: 5}}>
            {Array.from({length: COLS}).map((_, c) => {
              const idx = r * COLS + c;
              const isOff = idx < offCount;
              const dotEntry = spring({
                frame: localFrame - idx * 0.4,
                fps,
                config: {damping: 22, stiffness: 200, mass: 0.3},
                durationInFrames: 10,
              });
              return (
                <div
                  key={c}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: isOff ? COLOR.dim : COLOR.text,
                    opacity: isOff ? 0.18 : dotEntry * 0.85,
                    transition: 'background-color 80ms',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{fontFamily: MONO, fontSize: 13, color: COLOR.muted, letterSpacing: '0.2em'}}>
        EACH DOT = 100 EMPLOYEES · 33,000 JOBS LOST
      </div>
    </div>
  );
};
