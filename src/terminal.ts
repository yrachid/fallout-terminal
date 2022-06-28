import { formatMemoryDump, TerminalDimensions, TerminalRow } from "./content";
import dom from "./dom";
import domQuery from "./dom-query";
import { getMemoryDump, SecurityLevels } from "./memory-dump";

const KEY_CODES = {
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
};

const move = {
  [KEY_CODES.DOWN]: (coord: ColumnCoordinates) =>
    coord.row === terminalDimensions.rowsPerBlock - 1
      ? { row: 0 }
      : { row: coord.row + 1 },
  [KEY_CODES.UP]: (coord: ColumnCoordinates) =>
    coord.row === 0
      ? { row: terminalDimensions.rowsPerBlock - 1 }
      : { row: coord.row - 1 },
  [KEY_CODES.LEFT]: (coord: ColumnCoordinates) =>
    coord.column === 0
      ? {
          column: terminalDimensions.columnsPerBlock - 1,
          block: coord.block === 0 ? 1 : 0,
        }
      : {
          column: coord.column - 1,
        },
  [KEY_CODES.RIGHT]: (coord: ColumnCoordinates) =>
    coord.column === terminalDimensions.columnsPerBlock - 1
      ? {
          column: 0,
          block: coord.block === 0 ? 1 : 0,
        }
      : {
          column: coord.column + 1,
        },
};

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
                for (let i = guessBounds.start; i <= guessBounds.end; i++) {
                  const col = domQuery.by.contiguousIndex(i);
                  col?.classList.add("active-column");
                }
              }
            },
            onBlur: () => {
              const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);
              if (guessBounds !== undefined) {
                for (let i = guessBounds.start; i <= guessBounds.end; i++) {
                  const col = domQuery.by.contiguousIndex(i);
                  col?.classList.remove("active-column");
                }
              }
            },
          });
        }),
      ],
    })
  );

const firstBlockRows = buildBlockOfRows(matrix.rowsPerBlock.firstBlock, 0);
const secondBlockRows = buildBlockOfRows(matrix.rowsPerBlock.secondBlock, 1);

const terminalBlockContainer = domQuery.terminalContainer();

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

document.onkeydown = (event) => {
  if (!domQuery.isActiveElementATerminalColumn()) {
    domQuery.firstColumn().focus();
    return;
  }

  const activeElement = document.activeElement as HTMLElement;
  if (Object.values(KEY_CODES).includes(event.key)) {
    getNextColumn(activeElement, event.key)?.focus();
  }
};

export type ColumnCoordinates = {
  row: number;
  column: number;
  block: number;
  contiguousIndex: number;
};

const getNextColumn = (activeElement: HTMLElement, movement: string) => {
  const coordinates = getColumnCoordinates(activeElement);

  const guessBoundary = memoryDump.getGuessBoundary(
    coordinates.contiguousIndex
  );

  if (guessBoundary !== undefined && movement === KEY_CODES.RIGHT) {
    return domQuery.by.contiguousIndex(guessBoundary.end + 1);
  }

  if (guessBoundary !== undefined && movement === KEY_CODES.LEFT) {
    return domQuery.by.contiguousIndex(guessBoundary.start - 1);
  }

  const nextCoordinates = { ...coordinates, ...move[movement](coordinates) };
  return domQuery.by.columnRowAndBlock(nextCoordinates);
};

const getColumnCoordinates = (activeColumn: HTMLElement): ColumnCoordinates => {
  return {
    row: parseInt(activeColumn.dataset.row!),
    column: parseInt(activeColumn.dataset.column!),
    block: parseInt(activeColumn.dataset.block!),
    contiguousIndex: parseInt(activeColumn.dataset.contiguousIndex!),
  };
};

domQuery.firstColumn().focus();