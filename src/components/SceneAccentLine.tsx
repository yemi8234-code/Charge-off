import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR} from '../theme';

type Props = {
  sceneStartFrame: number;
  sceneDurationFrames: number;
};

export const SceneAccentLine: React.FC<Props> = ({
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - sceneStartFrame;

  const scaleX = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: {mass: 0.5, damping: 22, stiffness: 180},
    durationInFrames: 30,
  });

  const fadeOutStart = sceneDurationFrames - 20;
  const fadeOpacity = interpolate(
    localFrame,
    [fadeOutStart, sceneDurationFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '58%',
        left: '50%',
        width: '38%',
        height: 1,
        transform: `translateX(-50%) scaleX(${scaleX})`,
        transformOrigin: 'left center',
        backgroundColor: COLOR.gold,
        opacity: fadeOpacity * 0.85,
        boxShadow: '0 0 12px rgba(200,134,10,0.4)',
      }}
    />
  );
};
