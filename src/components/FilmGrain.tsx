import React from 'react';
import {useCurrentFrame} from 'remotion';

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const frame = useCurrentFrame();
  // Animate the noise seed for moving grain
  const seed = (frame * 17) % 1000;
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix
          values="0 0 0 0 0.92
                  0 0 0 0 0.91
                  0 0 0 0 0.88
                  0 0 0 0.7 0"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};
