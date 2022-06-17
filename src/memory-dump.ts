import rng from './rng';
import { range } from './terminal';

export type SecurityLevel = {
  passphraseLength: number;
  passphrasesDumped: number;
}

export const SecurityLevels: Record<string, SecurityLevel> = {
  L1: {
    passphraseLength: 5,
    passphrasesDumped: 8
  }
}

export type MemoryDump = {
  guessIndices: number[];
  dumpedContent: string;
}

const GUESSES = [ 'WHICH', 'OTHER', 'ABOUT', 'MAYBE', 'LUNCH', 'EVERY', 'THEIR', 'FAITH' ];

export const getMemoryDump = (dumpSize: number, securityLevel: SecurityLevel): MemoryDump => {
  const guessesSize = securityLevel.passphraseLength * securityLevel.passphrasesDumped;

  const garbageSize = dumpSize - guessesSize;

  const garbage = range(garbageSize, () => rng.garbage()).join('');

  // TODO: Improve guess distribution logic
  const groupOffset = Math.floor(garbageSize / (securityLevel.passphrasesDumped + 1));

  const guessIndices = range(securityLevel.passphrasesDumped, (i) => groupOffset * i + 1).map((offset) => {
    const nextIndex = rng.randomWithin(groupOffset - securityLevel.passphraseLength) + offset;

    return Math.min(nextIndex, garbageSize - securityLevel.passphraseLength);
  });

  const insertGuessesIntoGarbage = (result: string, guessIndex: number) =>
    result.slice(0, guessIndex) + rng.randomItemOf(GUESSES) + result.slice(guessIndex);

  const dumpedContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);

  return {
    guessIndices,
    dumpedContent
  };
};
