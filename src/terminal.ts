import { formatMemoryDump, TerminalDimensions, TerminalRow } from "./content";
import dom from "./dom";
import input from "./input";
import { getMemoryDump, SecurityLevels } from "./memory-dump";

const terminalDimensions: TerminalDimensions = {
  rowsPerBlock: 17,
  columnsPerBlock: 12,
};

const memoryDumpSize =
  terminalDimensions.columnsPerBlock * terminalDimensions.rowsPerBlock * 2 + 1;

const memoryDump = getMemoryDump(memoryDumpSize, SecurityLevels.L1);

const matrix = formatMemoryDump(terminalDimensions, memoryDump);

const buildBlockOfRows = (rowContent: TerminalRow[], blockIndex: number) =>
  rowContent.map((row, rowIndex) =>
    dom.creation.p({
      className: "terminal-line",
      children: [
        dom.creation.span({
          className: "memory-address",
          content: row.memoryAddress,
        }),
        ...row.columns.map((c, columnIndex) => {
          const contiguousIndex: number =
            columnIndex +
            terminalDimensions.columnsPerBlock * rowIndex +
            blockIndex *
              (terminalDimensions.columnsPerBlock *
                terminalDimensions.rowsPerBlock);

          return dom.creation.span({
            className: "terminal-column",
            tabIndex: 0,
            content: c,
            dataAttributes: {
              block: blockIndex,
              column: columnIndex,
              row: rowIndex,
              "contiguous-index": contiguousIndex,
            },
            onFocus: () => {
              const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);

              if (guessBounds !== undefined) {
                dom.update.toggleColumnHighlight(guessBounds);
                dom.update.setCursorTextFromGuess(guessBounds);
              } else {
                dom.update.setCursorTextFromGarbage(contiguousIndex);
              }
            },
            onBlur: () => {
              const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);
              if (guessBounds !== undefined) {
                dom.update.toggleColumnHighlight(guessBounds);
              }
            },
          });
        }),
      ],
    })
  );

const firstBlockRows = buildBlockOfRows(matrix.rowsPerBlock.firstBlock, 0);
const secondBlockRows = buildBlockOfRows(matrix.rowsPerBlock.secondBlock, 1);

dom.query.terminalContainer()
?.prepend(
  dom.creation.section({
    className: "terminal-block",
    children: firstBlockRows,
  }),
  dom.creation.section({
    className: "terminal-block",
    children: secondBlockRows,
  })
);

input.registerInputHandlers(terminalDimensions, memoryDump);
dom.update.setAttempts(4);
dom.query.firstColumn().focus();
