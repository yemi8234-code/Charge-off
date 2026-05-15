import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadSyne} from '@remotion/google-fonts/Syne';
import {loadFont as loadJetBrains} from '@remotion/google-fonts/JetBrainsMono';
import {COLOR, FPS} from './theme';
import {
  PARAGRAPH_TIMINGS,
  CHAPTER_CARD_TIMINGS,
  CHAPTER_CARD_WORD_DELAY_SEC,
} from './data/timing';
import {CHAPTERS} from './data/script';
import {SceneBackground} from './components/SceneBackground';
import {SceneAccentLine} from './components/SceneAccentLine';
import {WordReveal} from './components/WordReveal';
import {ChapterCard} from './components/ChapterCard';
import {SideMarkers} from './components/SideMarkers';

const {fontFamily: syneFamily} = loadSyne();
const {fontFamily: monoFamily} = loadJetBrains();

const totalChapters = CHAPTERS.filter((c) => c.showCard).length;

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Find active paragraph (the one whose time window contains current frame)
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

  const wordDelayFrames = active.hasChapterCard
    ? Math.round(CHAPTER_CARD_WORD_DELAY_SEC * FPS)
    : 0;

  // Active chapter card (if any) playing
  const activeCard = CHAPTER_CARD_TIMINGS.find(
    (c) =>
      frame >= c.startFrame && frame < c.startFrame + c.durationFrames + 6,
  );

  // Which chapter index for side markers (skip hook chapter 0)
  const visibleChapterIdx = Math.max(0, active.chapter - 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR.bg,
        fontFamily: syneFamily,
      }}
    >
      <SceneBackground
        chapter={active.chapter}
        sceneStartFrame={active.startFrame}
        sceneDurationFrames={sceneDuration}
      />

      <SceneAccentLine
        sceneStartFrame={active.startFrame}
        sceneDurationFrames={sceneDuration}
      />

      {/* Narration text block */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 220px',
        }}
      >
        <div
          style={{
            maxWidth: 1480,
            color: COLOR.text,
            fontFamily: syneFamily,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.32,
            letterSpacing: '-0.018em',
            textAlign: 'center',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          <WordReveal
            words={active.words}
            startDelayFrames={wordDelayFrames}
          />
        </div>
      </AbsoluteFill>

      <SideMarkers
        chapter={visibleChapterIdx}
        totalChapters={totalChapters}
      />

      {/* Chapter card overlay */}
      {activeCard && (
        <ChapterCard
          cardStartFrame={activeCard.startFrame}
          cardDurationFrames={activeCard.durationFrames}
          label={CHAPTERS[activeCard.chapter].label}
          title={CHAPTERS[activeCard.chapter].title}
        />
      )}

      <Audio src={staticFile('voiceover.mp3')} volume={1.0} />

      {/* Hidden monospace preloader */}
      <span style={{fontFamily: monoFamily, opacity: 0, position: 'absolute'}}>
        .
      </span>
    </AbsoluteFill>
  );
};
