import { formatMemoryDump, TerminalDimensions } from "./content";
import dom from "./dom";
import { getMemoryDump, SecurityLevels } from "./memory-dump";

// const KEY_CODES = {
//   UP: 38,
//   RIGHT: 39,
//   DOWN: 40,
//   LEFT: 37,
// };

export const range = <T>(limit: number, cb: (idx: number) => T) =>
  [...Array(limit).keys()].map(cb);

const terminalDimensions: TerminalDimensions = {
  rowsPerBlock: 17,
  columnsPerBlock: 12,
};

const memoryDumpSize =
  terminalDimensions.columnsPerBlock * terminalDimensions.rowsPerBlock * 2 + 1;

const memoryDump = getMemoryDump(memoryDumpSize, SecurityLevels.L1);

const matrix = formatMemoryDump(terminalDimensions, memoryDump);

const firstBlockRows = matrix.rowsPerBlock.firstBlock.map((row) =>
  dom.p({
    className: "terminal-line",
    children: [
      dom.span({
        className: "memory-address",
        content: row.memoryAddress,
      }),
      ...row.columns.map((c) =>
        dom.span({ className: "terminal-column", tabIndex: 0, content: c })
      ),
    ],
  })
);

const secondBlockRows = matrix.rowsPerBlock.secondBlock.map((row) =>
  dom.p({
    className: "terminal-line",
    children: [
      dom.span({
        className: "memory-address",
        content: row.memoryAddress,
      }),
      ...row.columns.map((c) =>
        dom.span({ className: "terminal-column", tabIndex: 0, content: c })
      ),
    ],
  })
);

const terminalBlockContainer = document.querySelector("#block-container");

terminalBlockContainer?.append(
  dom.section({
    className: "terminal-block",
    children: firstBlockRows,
  }),
  dom.section({
    className: "terminal-block",
    children: secondBlockRows,
  })
);

const firstColumn: Element | null = document.querySelector(".terminal-column");

(firstColumn as HTMLElement)?.focus();
