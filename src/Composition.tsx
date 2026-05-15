import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SYNE, MONO} from './fonts';
import {COLOR, FPS, SPRING, CHAPTER_HUE} from './theme';
import {
  PARAGRAPH_TIMINGS,
  CHAPTER_CARD_TIMINGS,
  CHAPTER_CARD_WORD_DELAY_SEC,
} from './data/timing';
import {CHAPTERS} from './data/script';
import {AmbientGrid} from './components/AmbientGrid';
import {SceneBackground} from './components/SceneBackground';
import {WordReveal} from './components/WordReveal';
import {ChapterCard} from './components/ChapterCard';
import {SceneVisual} from './components/SceneVisual';

const totalChapters = CHAPTERS.filter((c) => c.showCard).length;

// Per-scene cross-fade transition
const TRANSITION_FRAMES = 10;

const SceneTransitionWrapper: React.FC<{
  startFrame: number;
  endFrame: number;
  children: React.ReactNode;
}> = ({startFrame, endFrame, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entryOpacity = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING.default,
    durationInFrames: TRANSITION_FRAMES,
  });
  const exitOpacity = interpolate(
    frame,
    [endFrame - TRANSITION_FRAMES, endFrame],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div style={{opacity: Math.min(entryOpacity, exitOpacity)}}>
      {children}
    </div>
  );
};

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const activeParaIdx = PARAGRAPH_TIMINGS.findIndex(
    (p, i) =>
      frame >= p.startFrame &&
      (i === PARAGRAPH_TIMINGS.length - 1 ||
        frame < PARAGRAPH_TIMINGS[i + 1].startFrame),
  );
  const activeIdx = activeParaIdx === -1 ? 0 : activeParaIdx;
  const active = PARAGRAPH_TIMINGS[activeIdx];
  const next = PARAGRAPH_TIMINGS[activeIdx + 1];
  const sceneDuration =
    (next ? next.startFrame : active.endFrame + 30) - active.startFrame;
  const localFrame = frame - active.startFrame;

  const wordDelayFrames = active.hasChapterCard
    ? Math.round(CHAPTER_CARD_WORD_DELAY_SEC * FPS)
    : 0;

  const activeCard = CHAPTER_CARD_TIMINGS.find(
    (c) =>
      frame >= c.startFrame && frame < c.startFrame + c.durationFrames + 6,
  );

  const hue = CHAPTER_HUE[active.chapter as keyof typeof CHAPTER_HUE] ?? 30;

  // Chapter label top-left
  const chapterLabelOpacity = active.chapter > 0
    ? interpolate(localFrame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLOR.bg, fontFamily: SYNE}}>
      {/* Layer 0: ambient dot grid */}
      <AmbientGrid />

      {/* Layer 1: scene radial gradient background */}
      <SceneBackground
        chapter={active.chapter}
        sceneStartFrame={active.startFrame}
        sceneDurationFrames={sceneDuration}
      />

      {/* Layer 2: chapter label — top left */}
      {active.chapter > 0 && (
        <div style={{
          position: 'absolute',
          top: 52,
          left: 80,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.42em',
          color: `hsla(${hue}, 55%, 60%, ${chapterLabelOpacity * 0.7})`,
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          {CHAPTERS[active.chapter]?.label || ''}
        </div>
      )}

      {/* Layer 2b: progress bar — top right */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 3,
        height: `${(activeIdx / (PARAGRAPH_TIMINGS.length - 1)) * 100}%`,
        backgroundColor: `hsla(${hue}, 60%, 55%, 0.35)`,
        transition: 'none',
      }} />

      {/* Layer 3: TEXT ZONE — upper ~47% of frame */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '47%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
      }}>
        <div style={{
          maxWidth: 1480,
          color: COLOR.text,
          fontFamily: SYNE,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.34,
          letterSpacing: '-0.018em',
          textAlign: 'center',
        }}>
          <SceneTransitionWrapper
            startFrame={active.startFrame}
            endFrame={next ? next.startFrame : active.endFrame + 30}
          >
            <WordReveal words={active.words} startDelayFrames={wordDelayFrames} />
          </SceneTransitionWrapper>
        </div>
      </div>

      {/* Divider line */}
      <div style={{
        position: 'absolute',
        top: '47%',
        left: 120,
        right: 120,
        height: 1,
        backgroundColor: `hsla(${hue}, 40%, 50%, 0.12)`,
      }} />

      {/* Layer 4: VISUAL ZONE — lower ~53% of frame */}
      <div style={{
        position: 'absolute',
        top: '47%',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <SceneTransitionWrapper
          startFrame={active.startFrame}
          endFrame={next ? next.startFrame : active.endFrame + 30}
        >
          <SceneVisual
            paragraphIndex={activeIdx}
            localFrame={localFrame}
            sceneDurationFrames={sceneDuration}
            chapter={active.chapter}
          />
        </SceneTransitionWrapper>
      </div>

      {/* Layer 5: vignette */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse 130% 90% at 50% 50%, transparent 55%, rgba(8,8,10,0.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Layer 6: chapter card overlay */}
      {activeCard && (
        <ChapterCard
          cardStartFrame={activeCard.startFrame}
          cardDurationFrames={activeCard.durationFrames}
          label={CHAPTERS[activeCard.chapter].label}
          title={CHAPTERS[activeCard.chapter].title}
        />
      )}

      <Audio src={staticFile('voiceover.mp3')} volume={1.0} />

      {/* Font preload */}
      <span style={{fontFamily: MONO, opacity: 0, position: 'absolute', fontSize: 1}}>.</span>
    </AbsoluteFill>
  );
};
