import { formatMemoryDump, TerminalDimensions, TerminalRow } from "./content";
import dom from "./dom";
import { getMemoryDump, SecurityLevels } from "./memory-dump";

const KEY_CODES = {
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
};

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

const buildBlockOfRows = (rowContent: TerminalRow[], blockIndex: number) =>
  rowContent.map((row, rowIndex) =>
    dom.p({
      className: "terminal-line",
      children: [
        dom.span({
          className: "memory-address",
          content: row.memoryAddress,
        }),
        ...row.columns.map((c, columnIndex) =>
          dom.span({
            className: "terminal-column",
            tabIndex: 0,
            content: c,
            dataAttributes: {
              block: blockIndex,
              column: columnIndex,
              row: rowIndex,
            },
          })
        ),
      ],
    })
  );

const firstBlockRows = buildBlockOfRows(matrix.rowsPerBlock.firstBlock, 0);
const secondBlockRows = buildBlockOfRows(matrix.rowsPerBlock.secondBlock, 1);

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

document.onkeydown = (event) => {
  const activeElement = document.activeElement as HTMLElement;
  if (!activeElement || activeElement.className !== "terminal-column") {
    console.log("Not focusing on any column");
    (document.querySelector(".terminal-column") as HTMLElement).focus();
    return;
  }

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

  if (Object.values(KEY_CODES).includes(event.key)) {
    const currentCoordinates = getColumnCoordinates(activeElement);
    const nextCoordinates = {
      ...currentCoordinates,
      ...move[event.key](currentCoordinates),
    };

    getNextColumn(nextCoordinates)?.focus();
  }
};

type ColumnCoordinates = {
  row: number;
  column: number;
  block: number;
};

const getNextColumn = (coordinates: ColumnCoordinates) => {
  const selector = `.terminal-column[data-row="${coordinates.row}"][data-column="${coordinates.column}"][data-block="${coordinates.block}"]`;
  return document.querySelector(selector) as HTMLElement | undefined;
};

const getColumnCoordinates = (activeColumn: HTMLElement): ColumnCoordinates => {
  return {
    row: parseInt(activeColumn.dataset.row!),
    column: parseInt(activeColumn.dataset.column!),
    block: parseInt(activeColumn.dataset.block!),
  };
};

const firstColumn: Element | null = document.querySelector(".terminal-column");

(firstColumn as HTMLElement)?.focus();
