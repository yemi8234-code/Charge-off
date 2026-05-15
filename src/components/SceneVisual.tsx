import React from 'react';
import {P0Visual} from './visuals/P0Visual';
import {P1Visual} from './visuals/P1Visual';
import {P2Visual} from './visuals/P2Visual';
import {P3Visual} from './visuals/P3Visual';
import {P4Visual} from './visuals/P4Visual';
import {P5Visual} from './visuals/P5Visual';
import {DefaultVisual} from './visuals/DefaultVisual';

// Key facts for DefaultVisual scenes (paragraphIndex → keyFact/keyLabel)
const KEY_FACTS: Record<number, {keyFact: string; keyLabel?: string}> = {
  // Chapter 1: The Rise
  6:  {keyFact: '$7.5M',   keyLabel: 'SOLD TO INTERSTATE · 1966'},
  7:  {keyFact: '20%',     keyLabel: 'U.S. TOY MARKET SHARE · 1985'},
  8:  {keyFact: '$11B',    keyLabel: 'ANNUAL REVENUE · MID 1990s'},
  9:  {keyFact: '110K ft²', keyLabel: 'TIMES SQUARE FLAGSHIP · 2001'},
  10: {keyFact: '→ 0',     keyLabel: 'COMPETITIVE MOAT'},
  // Chapter 2: The Deal
  11: {keyFact: '#2',      keyLabel: 'U.S. TOY SELLER · 1996'},
  12: {keyFact: '$50M',    keyLabel: 'AMAZON DEAL · 2000'},
  13: {keyFact: '4 yrs',   keyLabel: 'STANDING STILL WHILE AMAZON GREW'},
  14: {keyFact: '$6.6B',   keyLabel: 'BUYOUT PRICE · 2005'},
  15: {keyFact: '$5.3B',   keyLabel: 'DEBT LOADED ONTO TOYS R US'},
  16: {keyFact: '$400M',   keyLabel: 'ANNUAL INTEREST PAYMENT'},
  17: {keyFact: '→ %',     keyLabel: 'PRIMARY CONCERN: THE RETURN'},
  // Chapter 3: The Spiral
  18: {keyFact: '$400M',   keyLabel: 'ANNUAL INTEREST · YEAR ONE'},
  19: {keyFact: '$470M',   keyLabel: 'FEES EXTRACTED 2005–2017'},
  20: {keyFact: '$470M',   keyLabel: 'PAID OUT · NOT INVESTED'},
  21: {keyFact: '2012',    keyLabel: 'SAME-DAY DELIVERY BEGINS'},
  22: {keyFact: '0',       keyLabel: 'ECOMMERCE BUDGET'},
  23: {keyFact: '2010',    keyLabel: 'STORE TRAFFIC STARTS FALLING'},
  24: {keyFact: '$20M',    keyLabel: 'TIMES SQUARE RENT · PER YEAR'},
  // Chapter 4: The Collapse
  25: {keyFact: 'Caa2',    keyLabel: "MOODY'S RATING · 2017"},
  26: {keyFact: 'Ch.11',   keyLabel: 'BANKRUPTCY FILED · SEP 18 2017'},
  27: {keyFact: '$200M',   keyLabel: 'HOLIDAY ORDERS CANCELLED'},
  28: {keyFact: 'Ch.7',    keyLabel: 'LIQUIDATION · MAR 15 2018'},
  29: {keyFact: '33K',     keyLabel: 'JOBS LOST'},
  // Chapter 5: The Reckoning
  30: {keyFact: '$0',      keyLabel: 'WORKER SEVERANCE PACKAGE'},
  31: {keyFact: '$470M',   keyLabel: 'FEES COLLECTED BY PE FIRMS'},
  32: {keyFact: '2x',      keyLabel: 'PE RETURN ON EQUITY'},
  33: {keyFact: '2019',    keyLabel: 'TRU KIDS BRANDS REVIVAL'},
  // Outro
  34: {keyFact: '900+',    keyLabel: 'PE BUYOUTS SINCE 2000'},
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
