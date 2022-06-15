import rng from './rng';

type TerminalDimensions = {
  rowsPerBlock: number;
  columnsPerBlock: number;
};

type TerminalRow = {
  memoryAddress: string;
  columns: string[];
};

type TerminalMatrix = {
  guessIndices: number[];
  dimensions: TerminalDimensions;
  guessLength: number;
  rows: TerminalRow[];
};

const GUESSES = [ 'WHICH', 'OTHER', 'ABOUT', 'MAYBE', 'LUNCH', 'EVERY', 'THEIR', 'FAITH' ];

const range = <T>(limit: number, cb: (idx: number) => T) => [ ...Array(limit).keys() ].map(cb);

const formatMemoryAddress = (address: number) => `0X${address.toString(16)}`.substring(0, 6);

const generateContent = (dimensions: TerminalDimensions, guessLength: number, guesses = 4) => {
  const totalContentSize = dimensions.columnsPerBlock * dimensions.rowsPerBlock + 1;
  const guessesSize = guessLength * guesses;

  const garbageSize = totalContentSize - guessesSize;

  const garbage = range(garbageSize, () => rng.garbage()).join('');

  const groupOffset = Math.floor(garbageSize / (guesses + 1));

  const guessIndices = range(guesses, (i) => groupOffset * i + 1).map((offset) => {
    const nextIndex = rng.randomWithin(groupOffset - guessLength) + offset;

    return Math.min(nextIndex, garbageSize - guessLength);
  });

  const insertGuessesIntoGarbage = (result: string, guessIndex: number) =>
    result.slice(0, guessIndex) + rng.randomItemOf(GUESSES) + result.slice(guessIndex);

  const fullContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);

  const data = fullContent.split('');

  return { indices: guessIndices, data: range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock)) };
};

export const makeMatrix = (dimensions: TerminalDimensions, guessLength: number): TerminalMatrix => {
  const initialMemoryAddress = rng.memoryAddress();

  const { indices, data } = generateContent(dimensions, guessLength);

  const rows: TerminalRow[] = data.map((data, idx) => {
    return {
      memoryAddress: formatMemoryAddress(initialMemoryAddress + idx * dimensions.columnsPerBlock),
      columns: data
    };
  });

  return {
    guessIndices: indices,
    dimensions: {
      rowsPerBlock: dimensions.rowsPerBlock,
      columnsPerBlock: dimensions.columnsPerBlock
    },
    rows,
    guessLength
  };
};
