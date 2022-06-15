import rng from './rng';

export type TerminalDimensions = {
  rowsPerBlock: number;
  columnsPerBlock: number;
};

export type GuessConfig = {
  length: number;
  guessesPerColumn: number;
}

const GUESSES = [ 'WHICH', 'OTHER', 'ABOUT', 'MAYBE', 'LUNCH', 'EVERY', 'THEIR', 'FAITH' ];

const range = <T>(limit: number, cb: (idx: number) => T) => [ ...Array(limit).keys() ].map(cb);

// TODO: This can be completely decoupled from terminal dimensions
// - Number of "bytes" should suffice
// - GuessConfig should become a security level enum
export const getMemoryDump = (dimensions: TerminalDimensions, guessConfig: GuessConfig) => {
  const totalContentSize = dimensions.columnsPerBlock * dimensions.rowsPerBlock * 2 + 1;
  const guessesSize = guessConfig.length * (guessConfig.guessesPerColumn * 2);

  const garbageSize = totalContentSize - guessesSize;

  const garbage = range(garbageSize, () => rng.garbage()).join('');

  const groupOffset = Math.floor(garbageSize / (guessConfig.guessesPerColumn * 2 + 1));

  const guessIndices = range(guessConfig.guessesPerColumn * 2, (i) => groupOffset * i + 1).map((offset) => {
    const nextIndex = rng.randomWithin(groupOffset - guessConfig.length) + offset;

    return Math.min(nextIndex, garbageSize - guessConfig.length);
  });

  const insertGuessesIntoGarbage = (result: string, guessIndex: number) =>
    result.slice(0, guessIndex) + rng.randomItemOf(GUESSES) + result.slice(guessIndex);

  const fullContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);

  const data = fullContent.split('');
  const firstBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));
  const secondBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));

  return {
    indices: guessIndices,
    firstBlock,
    secondBlock
  };
};
