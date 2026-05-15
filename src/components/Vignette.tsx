import React from 'react';

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.85}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at center, rgba(10,10,11,0) 30%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.95) 100%)',
        opacity: strength,
        pointerEvents: 'none',
      }}
    />
  );
};
