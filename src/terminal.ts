import { formatMemoryDump, TerminalDimensions } from './content';
import dom from './dom';
import { getMemoryDump, SecurityLevels } from './memory-dump';

// const KEY_CODES = {
//   UP: 38,
//   RIGHT: 39,
//   DOWN: 40,
//   LEFT: 37,
// };

const terminalDimensions: TerminalDimensions = {
  rowsPerBlock: 17,
  columnsPerBlock: 12
}

const memoryDumpSize = (terminalDimensions.columnsPerBlock * terminalDimensions.rowsPerBlock) * 2 + 1;

const memoryDump = getMemoryDump(memoryDumpSize, SecurityLevels.L1);

const matrix = formatMemoryDump(
  terminalDimensions,
  memoryDump
);

const leftRows = matrix.rowsPerBlock.firstBlock.map((row) =>
  dom.p({
    className: 'terminal-line',
    children: [
      dom.span({
        className: 'memory-address',
        content: row.memoryAddress
      }),
      ...row.columns.map((c) => dom.span({ className: 'terminal-line', tabIndex: 0, content: c }))
    ]
  })
);

const rightRows = matrix.rowsPerBlock.secondBlock.map((row) =>
  dom.p({
    className: 'terminal-line',
    children: [
      dom.span({
        className: 'memory-address',
        content: row.memoryAddress
      }),
      ...row.columns.map((c) => dom.span({ className: 'terminal-line', tabIndex: 0, content: c }))
    ]
  })
);

const terminalBlockContainer = document.querySelector('#block-container');

terminalBlockContainer?.append(
  dom.section({
    className: 'terminal-block',
    children: leftRows
  }),
  dom.section({
    className: 'terminal-block',
    children: rightRows 
  }),
);