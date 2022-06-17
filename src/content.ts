import { MemoryDump } from './memory-dump';
import rng from './rng';

export type TerminalDimensions = {
  rowsPerBlock: number;
  columnsPerBlock: number;
};

type TerminalRow = {
  memoryAddress: string;
  columns: string[];
};

type TerminalMatrix = {
  rowsPerBlock: {
    firstBlock: TerminalRow[];
    secondBlock: TerminalRow[];
  };
};

const formatMemoryAddress = (address: number) => `0X${address.toString(16)}`.substring(0, 6);

const range = <T>(limit: number, cb: (idx: number) => T) => [ ...Array(limit).keys() ].map(cb);

export const formatMemoryDump = (dimensions: TerminalDimensions, memoryDump: MemoryDump): TerminalMatrix => {
  const initialMemoryAddress = rng.memoryAddress();

  const data = memoryDump.dumpedContent.split('');
  const firstBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));
  const secondBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));

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
    rowsPerBlock: {
      firstBlock: firstBlockRows,
      secondBlock: secondBlockRows
    },
  };

}
