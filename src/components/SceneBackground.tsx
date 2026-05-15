import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHAPTER_HUE, COLOR} from '../theme';
import {FilmGrain} from './FilmGrain';
import {Vignette} from './Vignette';

type Props = {
  chapter: number;
  sceneStartFrame: number;
  sceneDurationFrames: number;
};

export const SceneBackground: React.FC<Props> = ({
  chapter,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const t = Math.max(0, Math.min(1, localFrame / Math.max(1, sceneDurationFrames)));

  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;
  const sat = chapter === 4 ? 18 : chapter === 5 ? 22 : 45; // Collapse is cold

  // Ken Burns drift
  const kbScale = interpolate(t, [0, 1], [1.0, 1.06], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const driftX = Math.sin(localFrame / fps / 20) * 28;
  const driftY = Math.cos(localFrame / fps / 26) * 16;

  // Slow breathing pulse on the primary orb
  const pulse = Math.sin(localFrame / fps / 4) * 0.06 + 0.94;

  // Horizontal scan line drift speed — each line at different rate
  const line1Y = 22 + Math.sin(localFrame / fps / 14) * 4;
  const line2Y = 48 + Math.cos(localFrame / fps / 18) * 3;
  const line3Y = 73 + Math.sin(localFrame / fps / 22) * 5;
  const line4Y = 85 + Math.cos(localFrame / fps / 11) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLOR.bg,
        overflow: 'hidden',
      }}
    >
      {/* === LAYER 1: Base directional sweep === */}
      {/* A dramatic off-centre colour sweep — not centred orb */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            128deg,
            hsla(${hue}, ${sat}%, 8%, 0.0) 0%,
            hsla(${hue}, ${sat}%, 22%, 0.55) 38%,
            hsla(${hue}, ${sat - 5}%, 14%, 0.35) 65%,
            hsla(${hue}, ${sat}%, 6%, 0.0) 100%
          )`,
          transform: `translate(${driftX}px, ${driftY}px) scale(${kbScale})`,
        }}
      />

      {/* === LAYER 2: Bright accent orb — left-of-centre, clearly visible === */}
      <div
        style={{
          position: 'absolute',
          left: '28%',
          top: '55%',
          width: 1100,
          height: 1100,
          transform: `translate(-50%, -50%) translate(${driftX * 0.6}px, ${driftY * 0.5}px) scale(${pulse})`,
          background: `radial-gradient(
            circle,
            hsla(${hue}, ${sat + 20}%, 52%, 0.42) 0%,
            hsla(${hue}, ${sat + 10}%, 32%, 0.28) 35%,
            hsla(${hue}, ${sat}%, 14%, 0.0) 70%
          )`,
          filter: 'blur(60px)',
        }}
      />

      {/* === LAYER 3: Smaller sharper secondary orb right side === */}
      <div
        style={{
          position: 'absolute',
          right: '12%',
          top: '28%',
          width: 520,
          height: 520,
          transform: `translate(50%, -50%) translate(${-driftX * 0.4}px, ${driftY * 0.3}px)`,
          background: `radial-gradient(
            circle,
            hsla(${hue + 20}, ${sat + 10}%, 40%, 0.3) 0%,
            hsla(${hue}, ${sat}%, 18%, 0.0) 70%
          )`,
          filter: 'blur(35px)',
        }}
      />

      {/* === LAYER 4: Abstract horizontal data lines === */}
      {/* These suggest financial charts / seismic data without being literal */}
      {[
        {yPct: line1Y, opacity: 0.06, width: '100%', left: '0%'},
        {yPct: line2Y, opacity: 0.04, width: '72%', left: '14%'},
        {yPct: line3Y, opacity: 0.07, width: '100%', left: '0%'},
        {yPct: line4Y, opacity: 0.03, width: '50%', left: '25%'},
      ].map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${l.yPct}%`,
            left: l.left,
            width: l.width,
            height: 1,
            backgroundColor: `hsla(${hue}, 60%, 72%, 1)`,
            opacity: l.opacity,
          }}
        />
      ))}

      {/* === LAYER 5: Left edge vertical accent line === */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: '18%',
          width: 1,
          height: '64%',
          background: `linear-gradient(
            to bottom,
            transparent,
            hsla(${hue}, 70%, 65%, 0.18) 30%,
            hsla(${hue}, 70%, 65%, 0.12) 70%,
            transparent
          )`,
        }}
      />

      <FilmGrain opacity={0.055} />
      <Vignette strength={0.78} />

      {/* === LAYER 6: Central text-area subtle glow === */}
      {/* Lifts the text off the background so it reads cleanly */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1200,
          height: 500,
          background: `radial-gradient(ellipse, rgba(10,10,11,0.0) 0%, rgba(10,10,11,0.45) 100%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};
