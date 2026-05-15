// Perspective grid floor — gives scenes a 3D spatial depth feel
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, CHAPTER_HUE} from '../theme';

type Props = {chapter: number};

export const PerspectiveGrid: React.FC<Props> = ({chapter}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;

  // Vanishing point sits at 32% down from top (top of visual zone)
  const vpX = width / 2;
  const vpY = height * 0.32;
  const groundY = height; // bottom of frame

  // Scroll: grid flows upward (camera moving forward through space)
  const TILE_HEIGHT = height * 0.14;
  const scroll = (frame * 0.55) % TILE_HEIGHT;

  const lineColor = `hsla(${hue}, 25%, 48%,`;
  const COLS = 13;
  const ROWS = 9;

  // Generate evenly spaced horizontal y-positions with perspective depth
  const rows: Array<{y: number; opacity: number; sw: number}> = [];
  for (let r = 0; r <= ROWS; r++) {
    const t = ((r / ROWS) + scroll / (height - vpY));
    const tClamped = ((t % 1) + 1) % 1;
    // Perspective: t=0 near horizon, t=1 at ground — exponential spacing
    const perspT = Math.pow(tClamped, 2.6);
    const y = vpY + (groundY - vpY) * perspT;
    if (y < vpY || y > groundY + 2) continue;
    const depth = tClamped; // 0=far, 1=close
    rows.push({y, opacity: depth * 0.075, sw: depth * 1.2});
  }

  // Vertical lines from bottom edge converging to vanishing point
  const cols: Array<{bx: number}> = [];
  for (let c = 0; c <= COLS; c++) {
    cols.push({bx: (c / COLS) * width});
  }

  return (
    <svg
      style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      width={width}
      height={height}
    >
      {/* Vertical converging lines */}
      {cols.map(({bx}, i) => (
        <line
          key={`v${i}`}
          x1={bx} y1={groundY}
          x2={vpX} y2={vpY}
          stroke={`${lineColor}${(0.055).toFixed(3)})`}
          strokeWidth={0.7}
        />
      ))}

      {/* Horizontal parallels with perspective depth */}
      {rows.map(({y, opacity, sw}, i) => {
        // Clip horizontal line to the cone of vertical lines
        const frac = (y - vpY) / (groundY - vpY);
        const x1 = vpX - (vpX) * frac;
        const x2 = vpX + (width - vpX) * frac;
        return (
          <line
            key={`h${i}`}
            x1={x1} y1={y}
            x2={x2} y2={y}
            stroke={`${lineColor}${opacity.toFixed(3)})`}
            strokeWidth={sw}
          />
        );
      })}

      {/* Horizon glow */}
      <ellipse
        cx={vpX} cy={vpY}
        rx={320} ry={18}
        fill={`hsla(${hue}, 45%, 38%, 0.06)`}
      />
    </svg>
  );
};
