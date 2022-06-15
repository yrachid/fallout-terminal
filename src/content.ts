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
  rowsPerBlock: {
    firstBlock: TerminalRow[];
    secondBlock: TerminalRow[];
  };
};

type GuessConfig = {
  length: number;
  guessesPerColumn: number;
}

const GUESSES = [ 'WHICH', 'OTHER', 'ABOUT', 'MAYBE', 'LUNCH', 'EVERY', 'THEIR', 'FAITH' ];

const range = <T>(limit: number, cb: (idx: number) => T) => [ ...Array(limit).keys() ].map(cb);

const formatMemoryAddress = (address: number) => `0X${address.toString(16)}`.substring(0, 6);

const generateContent = (dimensions: TerminalDimensions, guessConfig: GuessConfig) => {
  const totalContentSize = (dimensions.columnsPerBlock * dimensions.rowsPerBlock) * 2 + 1;
  const guessesSize = guessConfig.length * (guessConfig.guessesPerColumn * 2);

  const garbageSize = totalContentSize - guessesSize;

  const garbage = range(garbageSize, () => rng.garbage()).join('');

  const groupOffset = Math.floor(garbageSize / (guessConfig.guessesPerColumn + 1));

  const guessIndices = range(guessConfig.guessesPerColumn * 2, (i) => groupOffset * i + 1).map((offset) => {
    const nextIndex = rng.randomWithin(groupOffset - guessConfig.length) + offset;

    return Math.min(nextIndex, garbageSize - guessConfig.length);
  });

  const insertGuessesIntoGarbage = (result: string, guessIndex: number) =>
    result.slice(0, guessIndex) + rng.randomItemOf(GUESSES) + result.slice(guessIndex);

  const fullContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);

  const data = fullContent.split('');
  const firstBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock))
  const secondBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock))

  return { indices: guessIndices, 
    firstBlock,
    secondBlock
     };
};

export const makeMatrix = (dimensions: TerminalDimensions, guessConfig: GuessConfig): TerminalMatrix => {
  const initialMemoryAddress = rng.memoryAddress();

  const { indices, firstBlock, secondBlock} = generateContent(dimensions, guessConfig);

  const firstBlockRows: TerminalRow[] = firstBlock.map((data, idx) => {
    return {
      memoryAddress: formatMemoryAddress(initialMemoryAddress + idx * dimensions.columnsPerBlock),
      columns: data
    };
  });

  const secondBlockRows: TerminalRow[] = secondBlock.map((data, idx) => {
    return {
      memoryAddress: formatMemoryAddress(initialMemoryAddress + (dimensions.rowsPerBlock * dimensions.columnsPerBlock) + idx * dimensions.columnsPerBlock),
      columns: data
    };
  });

  return {
    guessIndices: indices,
    dimensions: {
      rowsPerBlock: dimensions.rowsPerBlock,
      columnsPerBlock: dimensions.columnsPerBlock
    },
    rowsPerBlock: {
      firstBlock: firstBlockRows,
      secondBlock: secondBlockRows,
    },
    guessLength: guessConfig.length
  };
};
