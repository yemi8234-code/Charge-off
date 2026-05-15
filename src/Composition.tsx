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
import {PerspectiveGrid} from './components/PerspectiveGrid';
import {SceneBackground} from './components/SceneBackground';
import {WordReveal} from './components/WordReveal';
import {ChapterCard} from './components/ChapterCard';
import {SceneVisual} from './components/SceneVisual';
import {AmbientData} from './components/AmbientData';

const totalChapters = CHAPTERS.filter((c) => c.showCard).length;

// Blur + scale transition on entry and exit of each zone
const T_ENTRY = 10; // frames
const T_EXIT  = 8;

const useZoneTransition = (localFrame: number, sceneDuration: number) => {
  const {fps} = useVideoConfig();

  // Entry: blur from 14px → 0, scale from 1.04 → 1
  const entryP = spring({frame: localFrame, fps, config: SPRING.snappy, durationInFrames: T_ENTRY});
  const entryBlur = (1 - entryP) * 14;
  const entryScale = 1 + (1 - entryP) * 0.04;

  // Exit: blur 0 → 14px, scale 1 → 0.95
  const exitStart = sceneDuration - T_EXIT;
  const exitP = interpolate(localFrame, [exitStart, sceneDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitBlur = exitP * 14;
  const exitScale = 1 - exitP * 0.05;
  const exitOpacity = 1 - exitP * 0.6;

  const blur = Math.max(entryBlur, exitBlur);
  const scale = Math.min(entryScale, exitScale);
  const opacity = Math.min(1, exitOpacity);

  return {blur, scale, opacity};
};

// Brief dark flash on scene cut — peaks at frame 1 of a new scene
const useFlash = (localFrame: number) => {
  const amt = interpolate(localFrame, [0, 1, 4], [0.35, 0.35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return amt;
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

  // Transition effects
  const textTrans = useZoneTransition(localFrame, sceneDuration);
  const visualTrans = useZoneTransition(localFrame, sceneDuration);
  const flashAmt = useFlash(localFrame);

  // Chapter label opacity
  const chapterLabelOp = active.chapter > 0
    ? interpolate(localFrame, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  // Progress marker (right edge bar)
  const progressH = (activeIdx / Math.max(PARAGRAPH_TIMINGS.length - 1, 1)) * 100;

  return (
    <AbsoluteFill style={{backgroundColor: COLOR.bg, fontFamily: SYNE, overflow: 'hidden'}}>

      {/* === LAYER 0: Ambient dot grid === */}
      <AmbientGrid />

      {/* === LAYER 1: Perspective floor grid (visual zone only — bottom 65%) === */}
      <div style={{position: 'absolute', top: '35%', left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
        <PerspectiveGrid chapter={active.chapter} />
      </div>

      {/* === LAYER 2: Scene radial gradient === */}
      <SceneBackground
        chapter={active.chapter}
        sceneStartFrame={active.startFrame}
        sceneDurationFrames={sceneDuration}
      />

      {/* === LAYER 3: Chapter label — top left === */}
      {active.chapter > 0 && (
        <div style={{
          position: 'absolute',
          top: 48,
          left: 72,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: '0.44em',
          color: `hsla(${hue}, 50%, 62%, ${chapterLabelOp * 0.65})`,
          textTransform: 'uppercase',
          userSelect: 'none',
          zIndex: 10,
        }}>
          {CHAPTERS[active.chapter]?.label ?? ''}
        </div>
      )}

      {/* === LAYER 3b: Scene index dots — top right === */}
      <div style={{
        position: 'absolute',
        top: 44,
        right: 72,
        display: 'flex',
        gap: 5,
        opacity: 0.35,
        zIndex: 10,
      }}>
        {PARAGRAPH_TIMINGS.slice(0, Math.min(PARAGRAPH_TIMINGS.length, 35)).map((_, i) => (
          <div key={i} style={{
            width: i === activeIdx ? 16 : 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: i === activeIdx
              ? `hsl(${hue}, 60%, 60%)`
              : i < activeIdx ? `hsl(${hue}, 30%, 40%)` : COLOR.dim,
            transition: 'none',
          }} />
        ))}
      </div>

      {/* === LAYER 4: TEXT ZONE — top 35% === */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '35%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 180px 0',
        zIndex: 5,
      }}>
        <div style={{
          maxWidth: 1400,
          color: COLOR.text,
          fontFamily: SYNE,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.36,
          letterSpacing: '-0.018em',
          textAlign: 'center',
          filter: `blur(${textTrans.blur}px)`,
          transform: `scale(${textTrans.scale})`,
          opacity: textTrans.opacity,
          willChange: 'filter, transform, opacity',
        }}>
          <WordReveal words={active.words} startDelayFrames={wordDelayFrames} />
        </div>
      </div>

      {/* === DIVIDER === */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: 100,
        right: 100,
        height: 1,
        background: `linear-gradient(90deg, transparent, hsla(${hue}, 40%, 50%, 0.18) 20%, hsla(${hue}, 40%, 50%, 0.18) 80%, transparent)`,
        zIndex: 6,
      }} />

      {/* === LAYER 5: VISUAL ZONE — bottom 65% === */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 5,
      }}>
        <div style={{
          filter: `blur(${visualTrans.blur}px)`,
          transform: `scale(${visualTrans.scale})`,
          opacity: visualTrans.opacity,
          willChange: 'filter, transform, opacity',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <SceneVisual
            paragraphIndex={activeIdx}
            localFrame={localFrame}
            sceneDurationFrames={sceneDuration}
            chapter={active.chapter}
          />
        </div>
      </div>

      {/* === LAYER 6: Floating ambient data labels === */}
      <AmbientData paragraphIndex={activeIdx} chapter={active.chapter} />

      {/* === LAYER 7: Vignette === */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse 140% 95% at 50% 50%, transparent 48%, rgba(8,8,10,0.65) 100%)',
        pointerEvents: 'none',
        zIndex: 8,
      }} />

      {/* === LAYER 8: Scene cut flash === */}
      {flashAmt > 0.001 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(8,8,10,${flashAmt})`,
          pointerEvents: 'none',
          zIndex: 9,
        }} />
      )}

      {/* === LAYER 9: Chapter card overlay === */}
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
