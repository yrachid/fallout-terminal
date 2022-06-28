import { TerminalDimensions } from "./content";
import domQuery, { ColumnCoordinates } from "./dom-query";
import { MemoryDump } from "./memory-dump";

const KEY_CODES = {
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
};

export const movement = (
  terminalDimensions: TerminalDimensions,
  memoryDump: MemoryDump
) => {
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

  const getNextColumn = (movement: string) => {
    const coordinates = domQuery.getActiveColumnCoordinates();

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

  return function handleCursorMovement(event: KeyboardEvent) {
    if (!domQuery.isActiveElementATerminalColumn()) {
      domQuery.firstColumn().focus();
      return;
    }

    if (Object.values(KEY_CODES).includes(event.key)) {
      getNextColumn(event.key)?.focus();
      return;
    }

    if (event.key === "Enter") {
      const coordinates = domQuery.getActiveColumnCoordinates();
      const boundaries = memoryDump.getGuessBoundary(
        coordinates.contiguousIndex
      );

      if (boundaries) {
        console.log('Guess selected:', domQuery.guessText(boundaries));
      } else {
        console.log('Garbage selected:', domQuery.by.contiguousIndex(coordinates.contiguousIndex)?.innerText);
      }
    }
  };
};
