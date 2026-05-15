// Chapter 4 visual — Caa2 rating → Chapter 11 filing → liquidation
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {
  localFrame: number;
  sceneDurationFrames: number;
  mode: 'rating' | 'filing' | 'liquidation';
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Credit rating scale: AAA → AA → A → BBB → BB → B → CCC → CC → C → D
const RATINGS = ['AAA','AA','A','BBB','BB','B','CCC','Caa2','CC','D'];
const RATING_COLORS: Record<string, string> = {
  AAA: '#2A7A3B', AA: '#2A7A3B', A: '#3a9e50', BBB: '#7aaa3a',
  BB: '#c8aa0a', B: '#c87a0a', CCC: '#c8570a', Caa2: '#C84B0A', CC: '#C84B0A', D: '#8b0000',
};

export const CollapseVisual: React.FC<Props> = ({localFrame, sceneDurationFrames, mode}) => {
  const {fps} = useVideoConfig();
  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 18});
  const exitStart = sceneDurationFrames - 12;
  const exitOp = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], clamp);
  const exitY = interpolate(localFrame, [exitStart, sceneDurationFrames], [0, 14], clamp);

  const wrap: React.CSSProperties = {
    opacity: entry * exitOp,
    transform: `translateY(${(1 - entry) * 28 + exitY}px)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  };

  if (mode === 'rating') {
    const BAR_H = 44;
    const barReveal = spring({frame: localFrame - 10, fps, config: SPRING.snappy, durationInFrames: 28});

    return (
      <div style={wrap}>
        <div style={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.4em', color: COLOR.muted}}>CREDIT RATING SCALE</div>
        <div style={{display: 'flex', gap: 0, height: BAR_H, borderRadius: 6, overflow: 'hidden', width: 700}}>
          {RATINGS.map((r, i) => {
            const isCurrent = r === 'Caa2';
            const revealW = barReveal * (700 / RATINGS.length);
            const w = i < Math.floor(barReveal * RATINGS.length + 0.5) ? (700 / RATINGS.length) : 0;
            return (
              <div key={r} style={{
                width: w,
                backgroundColor: RATING_COLORS[r],
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                outline: isCurrent ? `2px solid #fff` : 'none',
                transition: 'none',
                position: 'relative',
              }}>
                {w > 30 && (
                  <span style={{fontFamily: MONO, fontSize: 9, color: isCurrent ? '#fff' : 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', whiteSpace: 'nowrap'}}>
                    {r}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {/* Caa2 label */}
        <div style={{
          opacity: interpolate(localFrame, [50, 62], [0, 1], clamp),
          fontFamily: SYNE,
          fontSize: 64,
          fontWeight: 800,
          color: COLOR.red,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>Caa2</div>
        <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.35em', color: COLOR.muted}}>
          DEEP JUNK · 2 NOTCHES ABOVE DEFAULT
        </div>
      </div>
    );
  }

  if (mode === 'filing') {
    const stampSpring = spring({frame: localFrame - 18, fps, config: SPRING.playful, durationInFrames: 14});
    const stampOp = interpolate(localFrame, [18, 24], [0, 1], clamp);
    const stampScale = 0.5 + stampSpring * 0.5;
    const tilt = interpolate(stampSpring, [0, 1], [-8, -2]);

    const dateOp = interpolate(localFrame, [40, 52], [0, 1], clamp);
    const dateSpring = spring({frame: localFrame - 40, fps, config: SPRING.snappy, durationInFrames: 14});

    return (
      <div style={wrap}>
        {/* CHAPTER 11 stamp */}
        <div style={{
          border: `5px solid ${COLOR.red}`,
          borderRadius: 8,
          padding: '18px 52px',
          transform: `scale(${stampScale}) rotate(${tilt}deg)`,
          opacity: stampOp,
          boxShadow: `0 0 40px ${COLOR.red}44`,
        }}>
          <div style={{fontFamily: SYNE, fontSize: 72, fontWeight: 800, color: COLOR.red, letterSpacing: '-0.02em', lineHeight: 1}}>
            CHAPTER 11
          </div>
          <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: '0.35em', color: COLOR.muted, textAlign: 'center', marginTop: 8}}>
            BANKRUPTCY PROTECTION
          </div>
        </div>

        {/* Date */}
        <div style={{
          opacity: dateOp,
          transform: `translateY(${(1 - dateSpring) * 10}px)`,
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: '0.3em',
          color: COLOR.muted,
        }}>
          SEPTEMBER 18, 2017 · $5 BILLION DEBT
        </div>
      </div>
    );
  }

  // mode === 'liquidation'
  const storeCount = Math.round(interpolate(localFrame, [15, 180], [735, 0], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  }));

  const countOp = interpolate(localFrame, [10, 20], [0, 1], clamp);

  return (
    <div style={wrap}>
      <div style={{fontFamily: MONO, fontSize: 10, letterSpacing: '0.4em', color: COLOR.muted}}>STORES REMAINING</div>
      <div style={{
        fontFamily: SYNE,
        fontSize: 120,
        fontWeight: 800,
        color: storeCount === 0 ? COLOR.red : COLOR.text,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        opacity: countOp,
        fontVariantNumeric: 'tabular-nums',
        textShadow: storeCount === 0 ? `0 0 40px ${COLOR.red}66` : 'none',
      }}>
        {storeCount}
      </div>
      <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.35em', color: COLOR.muted}}>
        CHAPTER 7 · MARCH 15 2018
      </div>
    </div>
  );
};
