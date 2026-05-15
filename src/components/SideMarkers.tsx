import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR} from '../theme';

type Props = {
  chapter: number;
  totalChapters: number;
};

// Cinematic side meta: chapter dot indicator + running timecode.
export const SideMarkers: React.FC<Props> = ({chapter, totalChapters}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalSec = frame / fps;
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(Math.floor(totalSec % 60)).padStart(2, '0');
  const ff = String(Math.floor((totalSec * fps) % fps)).padStart(2, '0');

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Right side: chapter dots */}
      <div
        style={{
          position: 'absolute',
          right: 64,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          opacity: fadeIn * 0.7,
        }}
      >
        {Array.from({length: totalChapters}).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === chapter ? 18 : 6,
              height: 1,
              backgroundColor: i === chapter ? COLOR.gold : COLOR.dim,
              transition: 'all 200ms',
            }}
          />
        ))}
      </div>

      {/* Bottom left: timecode */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          bottom: 56,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          letterSpacing: '0.18em',
          color: COLOR.dim,
          opacity: fadeIn,
        }}
      >
        {mm}:{ss}:{ff}
      </div>

      {/* Bottom right: brand */}
      <div
        style={{
          position: 'absolute',
          right: 64,
          bottom: 56,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.42em',
          color: COLOR.dim,
          opacity: fadeIn * 0.85,
        }}
      >
        CHARGE OFF
      </div>
    </>
  );
};
