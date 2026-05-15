import {PARAGRAPHS, CHAPTERS} from './script';
import {
  FPS,
  PART1_DURATION_SEC,
  PART2_START_SEC,
  VOICEOVER_DURATION_SEC,
} from '../theme';

const PART2_DURATION_SEC = VOICEOVER_DURATION_SEC - PART2_START_SEC;

const tokenize = (text: string) => text.trim().split(/\s+/);

const punctuationPause = (token: string): number => {
  const last = token.slice(-1);
  if (last === '.' || last === '?') return 0.22;
  if (last === ':' || last === ';') return 0.14;
  if (last === ',') return 0.07;
  return 0;
};

export type WordToken = {
  raw: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
};

export type ParagraphTiming = {
  index: number;
  chapter: number;
  text: string;
  words: WordToken[];
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  hasChapterCard: boolean;
};

export type ChapterCardTiming = {
  chapter: number;
  startSec: number;
  durationSec: number;
  startFrame: number;
  durationFrames: number;
};

const buildPartTimings = (
  paragraphsOfPart: Array<{p: typeof PARAGRAPHS[number]; idx: number}>,
  partStartSec: number,
  partDurationSec: number,
) => {
  const tokensPerPara = paragraphsOfPart.map(({p}) => tokenize(p.text));
  const totalWords = tokensPerPara.reduce((a, t) => a + t.length, 0);

  // Sum of all punctuation pauses across the part
  const totalPunctPause = tokensPerPara
    .flat()
    .reduce((a, t) => a + punctuationPause(t), 0);

  // Time available for actual word reading
  const wordTime = partDurationSec - totalPunctPause;
  const secPerWord = wordTime / totalWords;

  const result: Array<{
    startSec: number;
    endSec: number;
    words: WordToken[];
    paragraphRef: typeof paragraphsOfPart[number];
  }> = [];

  let cursor = partStartSec;
  tokensPerPara.forEach((tokens, paraI) => {
    const paraStart = cursor;
    const words: WordToken[] = [];
    tokens.forEach((tok) => {
      const wStart = cursor;
      const wEnd = cursor + secPerWord;
      words.push({
        raw: tok,
        startSec: wStart,
        endSec: wEnd,
        startFrame: Math.round(wStart * FPS),
        endFrame: Math.round(wEnd * FPS),
      });
      cursor = wEnd + punctuationPause(tok);
    });
    result.push({
      startSec: paraStart,
      endSec: cursor,
      words,
      paragraphRef: paragraphsOfPart[paraI],
    });
  });

  return result;
};

const buildAll = () => {
  const part1 = PARAGRAPHS.map((p, idx) => ({p, idx})).filter(
    ({p}) => p.part === 1,
  );
  const part2 = PARAGRAPHS.map((p, idx) => ({p, idx})).filter(
    ({p}) => p.part === 2,
  );

  const t1 = buildPartTimings(part1, 0, PART1_DURATION_SEC);
  const t2 = buildPartTimings(part2, PART2_START_SEC, PART2_DURATION_SEC);
  const all = [...t1, ...t2];

  const seenChapters = new Set<number>([0]);
  const chapterCards: ChapterCardTiming[] = [];

  const paragraphs: ParagraphTiming[] = all.map((entry) => {
    const chap = entry.paragraphRef.p.chapter;
    let hasCard = false;
    if (!seenChapters.has(chap) && CHAPTERS[chap]?.showCard) {
      seenChapters.add(chap);
      hasCard = true;
      const cardDuration = 2.6;
      chapterCards.push({
        chapter: chap,
        startSec: entry.startSec,
        durationSec: cardDuration,
        startFrame: Math.round(entry.startSec * FPS),
        durationFrames: Math.round(cardDuration * FPS),
      });
    }
    return {
      index: entry.paragraphRef.idx,
      chapter: chap,
      text: entry.paragraphRef.p.text,
      words: entry.words,
      startSec: entry.startSec,
      endSec: entry.endSec,
      startFrame: Math.round(entry.startSec * FPS),
      endFrame: Math.round(entry.endSec * FPS),
      hasChapterCard: hasCard,
    };
  });

  return {paragraphs, chapterCards};
};

const built = buildAll();
export const PARAGRAPH_TIMINGS = built.paragraphs;
export const CHAPTER_CARD_TIMINGS = built.chapterCards;
export const TOTAL_DURATION_FRAMES =
  Math.ceil(VOICEOVER_DURATION_SEC * FPS) + 30;

// Chapter card overlays the first 2.6s of the chapter's first paragraph.
// Words for that paragraph are delayed visually until the card fades.
export const CHAPTER_CARD_WORD_DELAY_SEC = 1.6;
