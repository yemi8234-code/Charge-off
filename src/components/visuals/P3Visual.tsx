// Scene 3 — Hook P4: "How does it end up here?"
// Large HOW? clip-path wipe-up → arrow drawing right
// [SFX: whoosh at HOW? reveal; click at arrow tip]
import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {COLOR, SPRING} from '../../theme';
import {SYNE, MONO} from '../../fonts';

type Props = {localFrame: number; sceneDurationFrames: number};

export const P3Visual: React.FC<Props> = ({localFrame, sceneDurationFrames}) => {
  const {fps} = useVideoConfig();

  const entry = spring({frame: localFrame, fps, config: SPRING.default, durationInFrames: 20});
  const exitStart = sceneDurationFrames - 12;
  const exitOpacity = interpolate(localFrame, [exitStart, sceneDurationFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitY = interpolate(localFrame, [exitStart, sceneDurationFrames], [0, 20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // HOW? wipe up — per character with stagger
  const chars = ['H', 'O', 'W', '?'];
  const charStagger = 5;

  // Arrow draws in after HOW?
  const arrowDelay = chars.length * charStagger + 18;
  const arrowProgress = interpolate(localFrame, [arrowDelay, arrowDelay + 28], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const arrowW = 320;

  // Sub-label
  const subOpacity = interpolate(localFrame, [arrowDelay + 30, arrowDelay + 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subSpring = spring({frame: localFrame - arrowDelay - 30, fps, config: SPRING.snappy, durationInFrames: 16});

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 36,
      opacity: exitOpacity,
      transform: `translateY(${(1 - entry) * 40 + exitY}px)`,
    }}>
      {/* HOW? — character by character clip-path wipe */}
      <div style={{display: 'flex', gap: 0}}>
        {chars.map((ch, i) => {
          const chDelay = i * charStagger;
          const chLocal = localFrame - chDelay;
          const wipe = spring({
            frame: chLocal,
            fps,
            config: SPRING.snappy,
            durationInFrames: 18,
          });
          const clipBottom = (1 - wipe) * 110;
          const scale = 0.9 + wipe * 0.1;

          return (
            <div key={i} style={{overflow: 'hidden', display: 'inline-block'}}>
              <span style={{
                display: 'inline-block',
                fontFamily: SYNE,
                fontSize: 144,
                fontWeight: 800,
                color: i === 3 ? COLOR.gold : COLOR.text,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                clipPath: `inset(0 0 ${clipBottom}% 0 round 3px)`,
                transform: `scale(${scale})`,
                transformOrigin: 'bottom center',
              }}>
                {ch}
              </span>
            </div>
          );
        })}
      </div>

      {/* Arrow */}
      <svg width={arrowW + 24} height={48} viewBox={`0 0 ${arrowW + 24} 48`} overflow="visible">
        <line
          x1={0} y1={24}
          x2={arrowW * arrowProgress} y2={24}
          stroke={COLOR.gold}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {arrowProgress > 0.95 && (
          <polyline
            points={`${arrowW - 14},10 ${arrowW},24 ${arrowW - 14},38`}
            fill="none"
            stroke={COLOR.gold}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={interpolate(arrowProgress, [0.95, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          />
        )}
      </svg>

      {/* Sub-label */}
      <div style={{
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: '0.4em',
        color: COLOR.muted,
        textTransform: 'uppercase',
        opacity: subOpacity,
        transform: `translateY(${(1 - subSpring) * 10}px)`,
      }}>
        The full story
      </div>
    </div>
  );
};
