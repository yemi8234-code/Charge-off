import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {P0Visual} from './visuals/P0Visual';
import {P1Visual} from './visuals/P1Visual';
import {P2Visual} from './visuals/P2Visual';
import {P3Visual} from './visuals/P3Visual';
import {P4Visual} from './visuals/P4Visual';
import {P5Visual} from './visuals/P5Visual';
import {DefaultVisual} from './visuals/DefaultVisual';
import {DebtVisual} from './visuals/DebtVisual';
import {CollapseVisual} from './visuals/CollapseVisual';

const KEY_FACTS: Record<number, {keyFact: string; keyLabel?: string}> = {
  6:  {keyFact: '$7.5M',   keyLabel: 'SOLD · STAYED AS CEO · 1966'},
  7:  {keyFact: '20%',     keyLabel: 'U.S. TOY MARKET SHARE · 1985'},
  8:  {keyFact: '$11B',    keyLabel: 'ANNUAL REVENUE · MID-1990s'},
  9:  {keyFact: '110K ft²',keyLabel: 'TIMES SQUARE FLAGSHIP · 2001'},
  10: {keyFact: '↓',       keyLabel: 'COMPETITIVE MOAT DISAPPEARING'},
  11: {keyFact: '#2',      keyLabel: 'U.S. TOY SELLER · 1996'},
  12: {keyFact: '$50M',    keyLabel: 'PAID FOR AMAZON EXCLUSIVITY'},
  13: {keyFact: '4 yrs',   keyLabel: 'STANDING STILL · NO PLATFORM'},
  17: {keyFact: 'ROI',     keyLabel: 'PRIMARY CONCERN: THE RETURN'},
  18: {keyFact: '$400M',   keyLabel: 'ANNUAL INTEREST · YEAR ONE'},
  19: {keyFact: '$470M',   keyLabel: 'FEES EXTRACTED 2005–2017'},
  20: {keyFact: '$470M',   keyLabel: 'OUT THE DOOR · NOT INVESTED'},
  21: {keyFact: '2012',    keyLabel: 'SAME-DAY DELIVERY BEGINS'},
  22: {keyFact: '$0',      keyLabel: 'ECOMMERCE INVESTMENT BUDGET'},
  23: {keyFact: '2010',    keyLabel: 'STORE TRAFFIC STARTS FALLING'},
  24: {keyFact: '$20M',    keyLabel: 'TIMES SQUARE RENT · PER YEAR'},
  27: {keyFact: '$200M',   keyLabel: 'HOLIDAY ORDERS PULLED'},
  29: {keyFact: '33K',     keyLabel: 'JOBS LOST · MARCH 2018'},
  30: {keyFact: '$0',      keyLabel: 'SEVERANCE PACKAGE PER WORKER'},
  31: {keyFact: '$470M',   keyLabel: 'FEES COLLECTED BY PE FIRMS'},
  32: {keyFact: '2×',      keyLabel: 'PE RETURN ON EQUITY'},
  33: {keyFact: '2019',    keyLabel: 'TRU KIDS BRANDS · REVIVAL'},
  34: {keyFact: '900+',    keyLabel: 'PE RETAIL BUYOUTS SINCE 2000'},
};

// Beat system: within a long scene, cut to a different visual sub-component
// beatFrame: localFrame where this beat starts
// beats are shown with a quick blur cut between them
type Beat = {startLocalFrame: number; el: React.ReactNode};

const BlurCut: React.FC<{localFrame: number; cutFrame: number; children: React.ReactNode}> = ({localFrame, cutFrame, children}) => {
  const f = localFrame - cutFrame;
  const blur = f < 0 ? 0
    : f < 4 ? interpolate(f, [0, 4], [12, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const scale = f < 0 ? 1
    : f < 4 ? interpolate(f, [0, 4], [1.04, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  return (
    <div style={{filter: `blur(${blur}px)`, transform: `scale(${scale})`, willChange: 'filter, transform'}}>
      {children}
    </div>
  );
};

const BeatSequence: React.FC<{beats: Beat[]; localFrame: number}> = ({beats, localFrame}) => {
  // Find active beat
  let activeI = 0;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (localFrame >= beats[i].startLocalFrame) {
      activeI = i;
      break;
    }
  }
  const beat = beats[activeI];
  return (
    <BlurCut localFrame={localFrame} cutFrame={beat.startLocalFrame}>
      {beat.el}
    </BlurCut>
  );
};

type Props = {
  paragraphIndex: number;
  localFrame: number;
  sceneDurationFrames: number;
  chapter: number;
};

export const SceneVisual: React.FC<Props> = ({
  paragraphIndex,
  localFrame,
  sceneDurationFrames,
  chapter,
}) => {
  const kf = KEY_FACTS[paragraphIndex];
  const half = Math.floor(sceneDurationFrames / 2);

  switch (paragraphIndex) {
    case 0:
      return <P0Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;
    case 1:
      return <P1Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;
    case 2:
      return <P2Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;
    case 3:
      return <P3Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;
    case 4:
      return <P4Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;
    case 5:
      return <P5Visual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} />;

    case 14:
      // Buyout — beat 1: equity/debt bar, beat 2: flow diagram
      return (
        <BeatSequence localFrame={localFrame} beats={[
          {startLocalFrame: 0,    el: <DebtVisual localFrame={localFrame} sceneDurationFrames={half} mode="split" />},
          {startLocalFrame: half, el: <DebtVisual localFrame={localFrame - half} sceneDurationFrames={sceneDurationFrames - half} mode="flow" />},
        ]} />
      );

    case 15:
      // Debt loaded — beat 1: flow diagram, beat 2: interest clock
      return (
        <BeatSequence localFrame={localFrame} beats={[
          {startLocalFrame: 0,    el: <DebtVisual localFrame={localFrame} sceneDurationFrames={half} mode="flow" />},
          {startLocalFrame: half, el: <DebtVisual localFrame={localFrame - half} sceneDurationFrames={sceneDurationFrames - half} mode="clock" />},
        ]} />
      );

    case 16:
      return <DebtVisual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} mode="clock" />;

    case 25:
      return <CollapseVisual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} mode="rating" />;

    case 26:
      return <CollapseVisual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} mode="filing" />;

    case 28:
      // Full liquidation — beat 1: filing stamp, beat 2: store counter to 0
      return (
        <BeatSequence localFrame={localFrame} beats={[
          {startLocalFrame: 0,    el: <CollapseVisual localFrame={localFrame} sceneDurationFrames={half} mode="filing" />},
          {startLocalFrame: half, el: <CollapseVisual localFrame={localFrame - half} sceneDurationFrames={sceneDurationFrames - half} mode="liquidation" />},
        ]} />
      );

    case 29:
      return <CollapseVisual localFrame={localFrame} sceneDurationFrames={sceneDurationFrames} mode="liquidation" />;

    default:
      return (
        <DefaultVisual
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          chapter={chapter}
          keyFact={kf?.keyFact}
          keyLabel={kf?.keyLabel}
        />
      );
  }
};
