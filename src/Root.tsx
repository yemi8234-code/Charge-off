import React from 'react';
import {Composition} from 'remotion';
import {MainComposition} from './Composition';
import {FPS, WIDTH, HEIGHT} from './theme';
import {TOTAL_DURATION_FRAMES} from './data/timing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
