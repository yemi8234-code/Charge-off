import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CHAPTER_HUE, COLOR} from '../theme';
import {Vignette} from './Vignette';

type Props = {chapter: number; sceneStartFrame: number};

export const SceneBackground: React.FC<Props> = ({chapter, sceneStartFrame}) => {
  const frame = useCurrentFrame();
  const local = frame - sceneStartFrame;
  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;
  const sat = chapter === 4 ? 14 : chapter === 3 ? 28 : 38;

  // Slow breathing
  const pulse = Math.sin(local / 30 / 6) * 0.04 + 0.96;

  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: COLOR.bg, overflow: 'hidden'}}>
      {/* Single clean radial — not fussy */}
      <div
        style={{
          position: 'absolute',
          left: '22%',
          top: '48%',
          width: 1400,
          height: 1400,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          background: `radial-gradient(circle,
            hsla(${hue}, ${sat}%, 30%, 0.38) 0%,
            hsla(${hue}, ${sat - 8}%, 16%, 0.18) 45%,
            transparent 70%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <Vignette strength={0.82} />
    </div>
  );
};
