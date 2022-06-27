import { range } from "./collections";
import rng from "./rng";

export type SecurityLevel = {
  passphraseLength: number;
  passphrasesDumped: number;
};

export const SecurityLevels: Record<string, SecurityLevel> = {
  L1: {
    passphraseLength: 5,
    passphrasesDumped: 8,
  },
};

export type GuessBoundary = {
  start: number;
  end: number;
};

export type MemoryDump = {
  guessIndices: number[];
  dumpedContent: string;
  getGuessBoundary: (index: number) => GuessBoundary | undefined;
};

const GUESSES = [
  "WHICH",
  "OTHER",
  "ABOUT",
  "MAYBE",
  "LUNCH",
  "EVERY",
  "THEIR",
  "FAITH",
  "FEVER",
  "HEADS",
  "CRAZY",
  "GYOZA",
  "PROXY",
  "CHECK",
];

const generateGuesses = (guessCount: number) => {
  const guesses = new Set();

  while (guesses.size < guessCount) {
    const nextItem = rng.randomItemOf(GUESSES);
    if (!guesses.has(nextItem)) {
      guesses.add(nextItem);
    }
  }

  return [...guesses];
};

export const getMemoryDump = (
  dumpSize: number,
  securityLevel: SecurityLevel
): MemoryDump => {
  const guessesSize =
    securityLevel.passphraseLength * securityLevel.passphrasesDumped;

  const garbageSize = dumpSize - guessesSize;

  const guesses = generateGuesses(securityLevel.passphrasesDumped);

  const garbage = range(garbageSize, () => rng.garbage()).join("");

  // TODO: Improve guess distribution logic
  const groupOffset = Math.floor(
    garbageSize / (securityLevel.passphrasesDumped + 1)
  );

  const guessIndices = range(
    securityLevel.passphrasesDumped,
    (i) => groupOffset * i + 1
  ).map((offset) => {
    const nextIndex =
      rng.randomWithin(groupOffset - securityLevel.passphraseLength) + offset;

    return Math.min(nextIndex, garbageSize - securityLevel.passphraseLength);
  });

  const insertGuessesIntoGarbage = (result: string, guessIndex: number) =>
    result.slice(0, guessIndex) + guesses.pop() + result.slice(guessIndex);

  const dumpedContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);

  const guessBoundaries: Array<GuessBoundary> = guessIndices.map((index) => ({
    start: index,
    end: index + (securityLevel.passphraseLength - 1),
  }));

  const getGuessBoundary = (index: number) =>
    guessBoundaries.find(({ start, end }) => index >= start && index <= end);

  return {
    guessIndices,
    dumpedContent,
    getGuessBoundary,
  };
};
