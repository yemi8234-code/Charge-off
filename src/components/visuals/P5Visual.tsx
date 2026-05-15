// Scene 5 — Rise P2: toy customers return forever, 1957
// Circular loop arrow draws, visit counter → ∞, 1957 badge
// [SFX: whoosh at loop arrow draw; pop at infinity symbol]
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

const R = 80;
const CX = 100;
const CY = 100;
const CIRC = 2 * Math.PI * R;

export const P5Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 22});
  const exitStart = sceneDurationFrames - 14;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Circle draws in (stroke-dashoffset)
  const circleProgress = interpolate(localFrame, [8, 52], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1-t, 2),
  });
  const dashOffset = CIRC * (1 - circleProgress);

  // Arrow head appears when circle is ~80% drawn
  const arrowOpacity = interpolate(localFrame, [40, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // "visits" counter goes 1 → ∞ (we animate 1 → 999 then show ∞)
  const countProgress = interpolate(localFrame, [55, 140], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1-t, 3),
  });
  const visitCount = Math.floor(countProgress * 999);
  const showInfinity = countProgress > 0.95;

  // Infinity symbol springs in
  const infSpring = spring({frame: localFrame - 140, fps, config: SPRING.playful, durationInFrames: 14});

  // 1957 badge
  const badgeDelay = 160;
  const badgeSpring = spring({frame: localFrame - badgeDelay, fps, config: SPRING.snappy, durationInFrames: 16});
  const badgeOpacity = interpolate(localFrame, [badgeDelay, badgeDelay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 80,
      opacity: entry * exitOpacity,
      transform: `translateY(${(1 - entry) * 40}px)`,
    }}>
      {/* Loop arrow SVG */}
      <svg width={200} height={200} viewBox="0 0 200 200">
        {/* Circle arc */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke={COLOR.text}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        {/* Arrow head at top */}
        <g opacity={arrowOpacity}>
          <polyline
            points={`${CX - 12},${CY - R - 14} ${CX},${CY - R} ${CX + 12},${CY - R - 14}`}
            fill="none"
            stroke={COLOR.text}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
        {/* Center label */}
        <text
          x={CX} y={CY + 6}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={13}
          fill={COLOR.muted}
          letterSpacing={2}
        >
          REPEAT
        </text>
      </svg>

      {/* Right side: counter + year */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
        {/* Visit counter */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontFamily: MONO, fontSize: 11, color: COLOR.muted, letterSpacing: '0.35em'}}>CUSTOMER VISITS</div>
          <div style={{
            fontFamily: SYNE,
            fontSize: 80,
            fontWeight: 800,
            color: showInfinity ? COLOR.gold : COLOR.text,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            transform: showInfinity ? `scale(${0.8 + infSpring * 0.2})` : 'scale(1)',
          }}>
            {showInfinity ? '∞' : visitCount}
          </div>
        </div>

        {/* 1957 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: badgeOpacity,
          transform: `translateX(${(1 - badgeSpring) * -20}px)`,
        }}>
          <div style={{width: 3, height: 36, backgroundColor: COLOR.gold}} />
          <div>
            <div style={{fontFamily: MONO, fontSize: 11, color: COLOR.muted, letterSpacing: '0.3em'}}>CONVERTS TO TOYS</div>
            <div style={{fontFamily: SYNE, fontSize: 36, fontWeight: 800, color: COLOR.text, letterSpacing: '-0.02em'}}>1957</div>
          </div>
        </div>
      </div>
    </div>
  );
};
