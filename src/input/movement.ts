import { TerminalDimensions } from "../content";
import domQuery, { ColumnCoordinates } from "../dom-query";
import { MemoryDump } from "../memory-dump";
import { KeyCode } from "./key-mapping";

export const movement = (
  terminalDimensions: TerminalDimensions,
  memoryDump: MemoryDump
) => {
  const move: Record<string, Function> = {
    [KeyCode.DOWN]: (coord: ColumnCoordinates) =>
      coord.row === terminalDimensions.rowsPerBlock - 1
        ? { row: 0 }
        : { row: coord.row + 1 },
    [KeyCode.UP]: (coord: ColumnCoordinates) =>
      coord.row === 0
        ? { row: terminalDimensions.rowsPerBlock - 1 }
        : { row: coord.row - 1 },
    [KeyCode.LEFT]: (coord: ColumnCoordinates) =>
      coord.column === 0
        ? {
            column: terminalDimensions.columnsPerBlock - 1,
            block: coord.block === 0 ? 1 : 0,
          }
        : {
            column: coord.column - 1,
          },
    [KeyCode.RIGHT]: (coord: ColumnCoordinates) =>
      coord.column === terminalDimensions.columnsPerBlock - 1
        ? {
            column: 0,
            block: coord.block === 0 ? 1 : 0,
          }
        : {
            column: coord.column + 1,
          },
  };

  const getNextColumn = (movement: KeyCode) => {
    const coordinates = domQuery.getActiveColumnCoordinates();

    const guessBoundary = memoryDump.getGuessBoundary(
      coordinates.contiguousIndex
    );

    if (guessBoundary !== undefined && movement === KeyCode.RIGHT) {
      return domQuery.by.contiguousIndex(guessBoundary.end + 1);
    }

    if (guessBoundary !== undefined && movement === KeyCode.LEFT) {
      return domQuery.by.contiguousIndex(guessBoundary.start - 1);
    }

    const nextCoordinates = { ...coordinates, ...move[movement](coordinates) };
    return domQuery.by.columnRowAndBlock(nextCoordinates);
  };

  return function handleCursorMovement(keyCode: KeyCode) {
    if (!domQuery.isActiveElementATerminalColumn()) {
      domQuery.firstColumn().focus();
      return;
    }

    getNextColumn(keyCode)?.focus();
  };
};
