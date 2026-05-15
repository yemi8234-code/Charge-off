// The LBO mechanics — equity vs debt split, debt attached to company
// Used for scenes 14 (buyout), 15 (debt loading), 16 (interest clock)
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';
import {AnimatedCounter} from '../AnimatedCounter';

type Props = {
  localFrame: number;
  sceneDurationFrames: number;
  mode: 'split' | 'flow' | 'clock'; // which beat to show
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const DebtVisual: React.FC<Props> = ({localFrame, sceneDurationFrames, mode}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 20});
  const exitStart = sceneDurationFrames - 12;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], clamp);
  const exitY = interpolate(localFrame, [exitStart, sceneDurationFrames], [0, 14], clamp);

  const wrapStyle = {
    opacity: entry * exitOpacity,
    transform: `translateY(${(1 - entry) * 30 + exitY}px)`,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: 20,
  };

  if (mode === 'split') {
    // Equity vs Debt bar — 1.3B / 5.3B
    const TOTAL = 6.6;
    const EQUITY = 1.3;
    const DEBT = 5.3;
    const equityPct = EQUITY / TOTAL;
    const debtPct = DEBT / TOTAL;
    const barW = 700;

    const barEntry = spring({frame: localFrame - 12, fps, config: SPRING.snappy, durationInFrames: 24});
    const equityW = barEntry * equityPct * barW;
    const debtW = barEntry * debtPct * barW;

    const labelSpring = spring({frame: localFrame - 36, fps, config: SPRING.snappy, durationInFrames: 14});
    const labelOp = interpolate(localFrame, [36, 46], [0, 1], clamp);

    return (
      <div style={wrapStyle}>
        <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.4em', color: COLOR.muted, marginBottom: 8}}>
          $6.6B BUYOUT STRUCTURE
        </div>

        {/* Stacked bar */}
        <div style={{display: 'flex', height: 72, borderRadius: 6, overflow: 'hidden', width: barW}}>
          {/* Equity — green */}
          <div style={{
            width: equityW,
            backgroundColor: COLOR.green,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {equityW > 80 && (
              <span style={{fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: '#fff'}}>$1.3B</span>
            )}
          </div>
          {/* Debt — red */}
          <div style={{
            width: debtW,
            backgroundColor: COLOR.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {debtW > 80 && (
              <span style={{fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: '#fff'}}>$5.3B DEBT</span>
            )}
          </div>
        </div>

        {/* Labels */}
        <div style={{display: 'flex', width: barW, justifyContent: 'space-between', opacity: labelOp, transform: `translateY(${(1 - labelSpring) * 8}px)`}}>
          <div style={{textAlign: 'center', width: `${equityPct * 100}%`}}>
            <div style={{fontFamily: MONO, fontSize: 10, color: COLOR.green, letterSpacing: '0.3em'}}>OWN MONEY</div>
            <div style={{fontFamily: MONO, fontSize: 10, color: COLOR.muted, letterSpacing: '0.2em'}}>20%</div>
          </div>
          <div style={{textAlign: 'center', width: `${debtPct * 100}%`}}>
            <div style={{fontFamily: MONO, fontSize: 10, color: COLOR.red, letterSpacing: '0.3em'}}>BORROWED · ATTACHED TO TRU</div>
            <div style={{fontFamily: MONO, fontSize: 10, color: COLOR.muted, letterSpacing: '0.2em'}}>80%</div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'flow') {
    // Money flows: PE firms → borrow → attach to TRU
    const arrowSpring = spring({frame: localFrame - 10, fps, config: SPRING.snappy, durationInFrames: 22});
    const arrow2Spring = spring({frame: localFrame - 40, fps, config: SPRING.snappy, durationInFrames: 22});
    const noteSpring = spring({frame: localFrame - 70, fps, config: SPRING.snappy, durationInFrames: 18});
    const noteOp = interpolate(localFrame, [70, 82], [0, 1], clamp);

    const boxStyle = (color: string): React.CSSProperties => ({
      border: `1.5px solid ${color}`,
      borderRadius: 8,
      padding: '12px 28px',
      fontFamily: SYNE,
      fontSize: 20,
      fontWeight: 800,
      color,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap' as const,
    });

    const arrowLen = 110;
    const arrowW1 = arrowSpring * arrowLen;
    const arrowW2 = arrow2Spring * arrowLen;

    return (
      <div style={wrapStyle}>
        <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
          {/* KKR/Bain/Vornado */}
          <div style={boxStyle(COLOR.gold)}>KKR · BAIN · VORNADO</div>

          {/* Arrow 1 */}
          <svg width={arrowLen} height={32} style={{flexShrink: 0}}>
            <line x1={0} y1={16} x2={arrowW1} y2={16} stroke={COLOR.dim} strokeWidth={2} strokeLinecap="round" />
            {arrowW1 > arrowLen - 4 && (
              <polyline points={`${arrowLen - 10},8 ${arrowLen},16 ${arrowLen - 10},24`} fill="none" stroke={COLOR.dim} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            )}
          </svg>

          {/* Lenders */}
          <div style={boxStyle(COLOR.muted)}>BANKS</div>

          {/* Arrow 2 */}
          <svg width={arrowLen} height={32} style={{flexShrink: 0}}>
            <line x1={0} y1={16} x2={arrowW2} y2={16} stroke={COLOR.red} strokeWidth={2.5} strokeLinecap="round" />
            {arrowW2 > arrowLen - 4 && (
              <polyline points={`${arrowLen - 10},8 ${arrowLen},16 ${arrowLen - 10},24`} fill="none" stroke={COLOR.red} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            )}
          </svg>

          {/* Toys R Us */}
          <div style={boxStyle(COLOR.red)}>TOYS R US</div>
        </div>

        {/* Note */}
        <div style={{
          opacity: noteOp,
          transform: `translateY(${(1 - noteSpring) * 10}px)`,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.3em',
          color: COLOR.muted,
          textAlign: 'center',
        }}>
          DEBT LEGALLY TRANSFERRED TO TOYS R US
        </div>
      </div>
    );
  }

  // mode === 'clock' — $400M interest clock ticking up per second
  const secProgress = interpolate(localFrame, [10, sceneDurationFrames - 20], [0, 1], clamp);
  const annualInterest = 400_000_000;
  const secondsPerYear = 365.25 * 24 * 3600;
  const perSecond = annualInterest / secondsPerYear;
  const secondsElapsed = secProgress * 60; // show 60 simulated seconds
  const amountPaid = Math.round(secondsElapsed * perSecond);

  const clockOp = interpolate(localFrame, [8, 18], [0, 1], clamp);

  return (
    <div style={{...wrapStyle, gap: 16}}>
      <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.4em', color: COLOR.muted}}>
        INTEREST METER · EVERY SECOND
      </div>
      <div style={{
        fontFamily: SYNE,
        fontSize: 80,
        fontWeight: 800,
        color: COLOR.red,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        opacity: clockOp,
        fontVariantNumeric: 'tabular-nums',
      }}>
        ${amountPaid.toLocaleString()}
      </div>
      <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: '0.3em', color: COLOR.muted}}>
        $400,000,000 / YEAR · INTEREST ONLY
      </div>
    </div>
  );
};
