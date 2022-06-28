import { boundedRange } from "./collections";
import { formatMemoryDump, TerminalDimensions, TerminalRow } from "./content";
import dom from "./dom";
import domQuery from "./dom-query";
import { inputHandler } from "./input/input-handler";
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
    dom.p({
      className: "terminal-line",
      children: [
        dom.span({
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

          return dom.span({
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
                boundedRange(guessBounds).forEach((i) =>
                  domQuery.by.contiguousIndex(i)?.classList.add("active-column")
                );
              }
            },
            onBlur: () => {
              const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);
              if (guessBounds !== undefined) {
                boundedRange(guessBounds).forEach((i) =>
                  domQuery.by
                    .contiguousIndex(i)
                    ?.classList.remove("active-column")
                );
              }
            },
          });
        }),
      ],
    })
  );

const firstBlockRows = buildBlockOfRows(matrix.rowsPerBlock.firstBlock, 0);
const secondBlockRows = buildBlockOfRows(matrix.rowsPerBlock.secondBlock, 1);

domQuery.terminalContainer()?.append(
  dom.section({
    className: "terminal-block",
    children: firstBlockRows,
  }),
  dom.section({
    className: "terminal-block",
    children: secondBlockRows,
  })
);

document.onkeydown = inputHandler(terminalDimensions, memoryDump)
domQuery.firstColumn().focus();
