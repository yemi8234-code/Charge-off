// Scene 1 — Hook P2: $0 severance; nobody got a call
// Three empty notification rings, then $0 slams in
// [SFX: ring draw sound at frames 0, 20, 40; slam pop at ~frame 60]
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

const RING_R = 48;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const STAGGER = 22; // frames between rings

const Ring: React.FC<{label: string; delay: number; localFrame: number}> = ({label, delay, localFrame}) => {
  const {fps} = useVideoConfig();
  const lf = localFrame - delay;

  const drawProgress = interpolate(lf, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const dashOffset = CIRCUMFERENCE * (1 - drawProgress);

  const labelEntry = spring({frame: lf - 18, fps, config: SPRING.snappy, durationInFrames: 14});
  const labelOpacity = interpolate(lf, [18, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
      <svg width={RING_R * 2 + 8} height={RING_R * 2 + 8} viewBox={`0 0 ${RING_R * 2 + 8} ${RING_R * 2 + 8}`}>
        {/* Background ring */}
        <circle cx={RING_R + 4} cy={RING_R + 4} r={RING_R} fill="none" stroke={COLOR.dim} strokeWidth={2} opacity={0.3} />
        {/* Animated ring draw */}
        <circle
          cx={RING_R + 4} cy={RING_R + 4} r={RING_R}
          fill="none"
          stroke={COLOR.text}
          strokeWidth={2.5}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${RING_R + 4} ${RING_R + 4})`}
        />
        {/* X inside ring */}
        {drawProgress > 0.8 && (
          <g opacity={interpolate(drawProgress, [0.8, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
            <line x1={RING_R - 12} y1={RING_R - 12} x2={RING_R + 16} y2={RING_R + 16} stroke={COLOR.dim} strokeWidth={2} transform={`translate(4,4)`}/>
            <line x1={RING_R + 16} y1={RING_R - 12} x2={RING_R - 12} y2={RING_R + 16} stroke={COLOR.dim} strokeWidth={2} transform={`translate(4,4)`}/>
          </g>
        )}
      </svg>
      <div style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '0.3em',
        color: COLOR.muted,
        textTransform: 'uppercase',
        opacity: labelOpacity,
        transform: `translateY(${(1 - labelEntry) * 10}px)`,
      }}>
        {label}
      </div>
    </div>
  );
};

export const P1Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 20});
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // $0 slams in after all three rings
  const zeroDelay = STAGGER * 2 + 40;
  const zeroSpring = spring({frame: localFrame - zeroDelay, fps, config: SPRING.playful, durationInFrames: 16});
  const zeroScale = 0.5 + zeroSpring * 0.5;
  const zeroOpacity = interpolate(localFrame, [zeroDelay, zeroDelay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 40,
      opacity: entry * exitOpacity,
      transform: `translateY(${(1 - entry) * 36}px)`,
    }}>
      {/* Three rings */}
      <div style={{display: 'flex', gap: 56, alignItems: 'flex-end'}}>
        <Ring label="No phone call" delay={0} localFrame={localFrame} />
        <Ring label="No meeting" delay={STAGGER} localFrame={localFrame} />
        <Ring label="No notice" delay={STAGGER * 2} localFrame={localFrame} />
      </div>

      {/* $0 severance */}
      <div style={{
        fontFamily: SYNE,
        fontSize: 72,
        fontWeight: 800,
        color: COLOR.red,
        letterSpacing: '-0.04em',
        transform: `scale(${zeroScale})`,
        opacity: zeroOpacity,
      }}>
        $0 severance
      </div>
    </div>
  );
};
