import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR} from '../theme';

// Felt-not-seen drifting dot grid. Runs the whole video independently.
export const AmbientGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const cols = 14;
  const rows = 7;
  const dotSize = 2;

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const phase = (i * 0.41) % (Math.PI * 2);
      const driftX = Math.sin(t / 12 + phase) * 6;
      const driftY = Math.cos(t / 16 + phase * 0.7) * 4;
      const xPct = (c + 0.5) / cols * 100;
      const yPct = (r + 0.5) / rows * 100;
      dots.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(${xPct}% + ${driftX}px)`,
            top: `calc(${yPct}% + ${driftY}px)`,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: COLOR.muted,
            transform: 'translate(-50%, -50%)',
            opacity: 0.08,
          }}
        />,
      );
    }
  }

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {dots}
    </div>
  );
};
