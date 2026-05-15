// Floating peripheral data labels — ambient "information atmosphere"
// Small stats, dates, and labels drift at screen edges: low opacity, non-intrusive
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, CHAPTER_HUE} from '../theme';
import {MONO} from '../fonts';

type DataPoint = {
  label: string;
  x: number;   // % from left
  y: number;   // % from top
  delay: number;
  duration: number;
  dir: 1 | -1; // drift direction
};

const SCENE_DATA: Record<number, DataPoint[]> = {
  0:  [
    {label: '735 STORES', x:8, y:62, delay:20, duration:120, dir:1},
    {label: 'MAR 15 2018', x:84, y:55, delay:40, duration:100, dir:-1},
    {label: 'CHAPTER 7', x:6, y:80, delay:60, duration:100, dir:1},
  ],
  1:  [
    {label: '$0 SEVERANCE', x:80, y:68, delay:30, duration:120, dir:-1},
    {label: '33,000 WORKERS', x:7, y:72, delay:50, duration:110, dir:1},
  ],
  2:  [
    {label: 'AGE 94', x:82, y:60, delay:20, duration:100, dir:-1},
    {label: 'MARCH 22 2018', x:7, y:76, delay:45, duration:110, dir:1},
  ],
  4:  [
    {label: 'WASHINGTON D.C.', x:6, y:65, delay:30, duration:120, dir:1},
    {label: '1948', x:82, y:60, delay:50, duration:100, dir:-1},
  ],
  5:  [
    {label: '1957', x:82, y:75, delay:60, duration:120, dir:-1},
    {label: 'REPEAT CUSTOMERS', x:6, y:62, delay:25, duration:110, dir:1},
  ],
  6:  [
    {label: '$7.5M EXIT · 1966', x:7, y:68, delay:30, duration:120, dir:1},
    {label: 'IPO 1978 · NYSE', x:80, y:58, delay:55, duration:110, dir:-1},
  ],
  7:  [
    {label: 'U.S. MARKET SHARE', x:6, y:65, delay:25, duration:130, dir:1},
    {label: 'MATTEL · HASBRO', x:80, y:72, delay:50, duration:110, dir:-1},
  ],
  8:  [
    {label: 'JAPAN · GERMANY', x:6, y:62, delay:20, duration:110, dir:1},
    {label: 'FRANCE · UK · AU', x:80, y:72, delay:45, duration:110, dir:-1},
  ],
  9:  [
    {label: 'TIMES SQUARE NYC', x:6, y:65, delay:20, duration:120, dir:1},
    {label: '60FT FERRIS WHEEL', x:80, y:58, delay:45, duration:110, dir:-1},
    {label: 'NOV 2001', x:40, y:85, delay:70, duration:90, dir:1},
  ],
  11: [
    {label: 'WALMART', x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'CROSS-SUBSIDY', x:80, y:72, delay:45, duration:110, dir:-1},
  ],
  12: [
    {label: 'AMAZON · 2000', x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'EXCLUSIVITY DEAL', x:80, y:62, delay:40, duration:110, dir:-1},
  ],
  13: [
    {label: 'SUED 2004', x:6, y:65, delay:20, duration:110, dir:1},
    {label: 'RULING 2006', x:80, y:72, delay:45, duration:110, dir:-1},
    {label: '4 YRS LOST', x:40, y:82, delay:65, duration:90, dir:1},
  ],
  14: [
    {label: 'KKR · BAIN · VORNADO', x:5, y:60, delay:15, duration:130, dir:1},
    {label: '$1.3B EQUITY', x:78, y:55, delay:35, duration:120, dir:-1},
    {label: '$5.3B DEBT', x:78, y:68, delay:55, duration:120, dir:-1},
  ],
  15: [
    {label: '400M / YEAR', x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'ANCHORED TO TRU', x:80, y:72, delay:45, duration:110, dir:-1},
  ],
  16: [
    {label: 'JUL 2005', x:6, y:65, delay:20, duration:110, dir:1},
    {label: 'PROFITABLE AT SALE', x:78, y:58, delay:40, duration:120, dir:-1},
  ],
  19: [
    {label: '2005–2017', x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'MGMT FEES', x:80, y:72, delay:45, duration:110, dir:-1},
  ],
  25: [
    {label: "MOODY'S Caa2", x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'DEEP JUNK', x:80, y:60, delay:40, duration:110, dir:-1},
    {label: 'HOLIDAY 2017', x:40, y:82, delay:65, duration:90, dir:1},
  ],
  26: [
    {label: 'SEP 18 2017', x:6, y:65, delay:20, duration:120, dir:1},
    {label: 'CHAPTER 11', x:80, y:60, delay:40, duration:110, dir:-1},
    {label: '$5B DEBT LOAD', x:40, y:82, delay:65, duration:90, dir:1},
  ],
  30: [
    {label: 'NO NOTICE', x:6, y:65, delay:20, duration:110, dir:1},
    {label: '$0 SEVERANCE', x:80, y:60, delay:40, duration:120, dir:-1},
  ],
};

type Props = {paragraphIndex: number; chapter: number};

export const AmbientData: React.FC<Props> = ({paragraphIndex, chapter}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const hue = CHAPTER_HUE[chapter as keyof typeof CHAPTER_HUE] ?? 30;
  const points = SCENE_DATA[paragraphIndex] ?? [];

  return (
    <>
      {points.map((pt, i) => {
        const localF = frame;
        const fadeIn = interpolate(localF, [pt.delay, pt.delay + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const fadeOut = interpolate(localF, [pt.delay + pt.duration - 16, pt.delay + pt.duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const opacity = Math.min(fadeIn, fadeOut) * 0.28;
        const drift = interpolate(localF, [pt.delay, pt.delay + pt.duration], [0, pt.dir * 18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              transform: `translateX(${drift}px)`,
              opacity,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.38em',
              color: `hsla(${hue}, 40%, 68%, 1)`,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {pt.label}
          </div>
        );
      })}
    </>
  );
};
