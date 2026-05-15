import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHAPTER_HUE, COLOR} from '../theme';
import {FilmGrain} from './FilmGrain';
import {Vignette} from './Vignette';

type Props = {
  chapter: number;
  sceneStartFrame: number;
  sceneDurationFrames: number;
};

// A drifting radial orb that takes the chapter hue.
// Slow Ken Burns scale 1.0 -> 1.07 across scene.
export const SceneBackground: React.FC<Props> = ({
  chapter,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - sceneStartFrame;
  const t = Math.max(0, Math.min(1, localFrame / sceneDurationFrames));

  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;
  const orbScale = interpolate(t, [0, 1], [1.0, 1.07], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const orbDriftX = Math.sin(localFrame / fps / 18) * 60;
  const orbDriftY = Math.cos(localFrame / fps / 22) * 36;

  const fadeIn = spring({
    frame: localFrame,
    fps,
    config: {mass: 0.8, damping: 35, stiffness: 120},
    durationInFrames: 28,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLOR.bg,
        overflow: 'hidden',
        opacity: fadeIn,
      }}
    >
      {/* Hue orb */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          width: 1800,
          height: 1800,
          transform: `translate(-50%, -50%) translate(${orbDriftX}px, ${orbDriftY}px) scale(${orbScale})`,
          background: `radial-gradient(circle, hsla(${hue}, 38%, 32%, 0.32) 0%, hsla(${hue}, 30%, 18%, 0.18) 30%, hsla(${hue}, 20%, 8%, 0.0) 60%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Distant smaller secondary orb */}
      <div
        style={{
          position: 'absolute',
          left: '78%',
          top: '22%',
          width: 700,
          height: 700,
          transform: `translate(-50%, -50%) translate(${-orbDriftX * 0.6}px, ${
            orbDriftY * 0.4
          }px) scale(${orbScale * 0.9})`,
          background: `radial-gradient(circle, hsla(${hue}, 25%, 14%, 0.28) 0%, hsla(${hue}, 12%, 6%, 0.0) 70%)`,
          filter: 'blur(50px)',
        }}
      />

      <FilmGrain opacity={0.07} />
      <Vignette strength={0.92} />
    </div>
  );
};
