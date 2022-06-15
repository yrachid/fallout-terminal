import { getMemoryDump, GuessConfig, TerminalDimensions } from './memory-dump';
import rng from './rng';

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

const formatMemoryAddress = (address: number) => `0X${address.toString(16)}`.substring(0, 6);

export const makeMatrix = (dimensions: TerminalDimensions, guessConfig: GuessConfig): TerminalMatrix => {
  const initialMemoryAddress = rng.memoryAddress();

  const { indices, firstBlock, secondBlock } = getMemoryDump(dimensions, guessConfig);

  const firstBlockRows: TerminalRow[] = firstBlock.map((data, idx) => {
    return {
      memoryAddress: formatMemoryAddress(initialMemoryAddress + idx * dimensions.columnsPerBlock),
      columns: data
    };
  });

  const secondBlockRows: TerminalRow[] = secondBlock.map((data, idx) => {
    return {
      memoryAddress: formatMemoryAddress(
        initialMemoryAddress + dimensions.rowsPerBlock * dimensions.columnsPerBlock + idx * dimensions.columnsPerBlock
      ),
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
      secondBlock: secondBlockRows
    },
    guessLength: guessConfig.length
  };
};
