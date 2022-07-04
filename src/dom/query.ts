import { boundedRange } from "../collections";
import { GuessBoundary } from "../memory-dump";

export type ColumnRowAndBlock = {
  column: number;
  row: number;
  block: number;
};

export type ColumnCoordinates = {
  row: number;
  column: number;
  block: number;
  contiguousIndex: number;
};

const by = {
  contiguousIndex: (index: number) =>
    document.querySelector(
      `.terminal-column[data-contiguous-index="${index}"]`
    ) as HTMLElement | undefined,
  columnRowAndBlock: (data: ColumnRowAndBlock) =>
    document.querySelector(
      `.terminal-column[data-column="${data.column}"][data-row="${data.row}"][data-block="${data.block}"]`
    ) as HTMLElement | undefined,
};

const getActiveColumnCoordinates = () => {
  const activeColumn = document.activeElement as HTMLElement;

  return {
    row: parseInt(activeColumn.dataset.row!),
    column: parseInt(activeColumn.dataset.column!),
    block: parseInt(activeColumn.dataset.block!),
    contiguousIndex: parseInt(activeColumn.dataset.contiguousIndex!),
  };
};

const guessText = (bounds: GuessBoundary) =>
  boundedRange(bounds)
    .map((i) => by.contiguousIndex(i))
    .map((column) => column?.innerText)
    .join("");

export default {
  by,
  firstColumn: () => document.querySelector(".terminal-column") as HTMLElement,
  terminalContainer: () =>
    document.querySelector("#block-container") as HTMLElement,
  isActiveElementATerminalColumn: () =>
    document.activeElement &&
    document.activeElement.classList.contains("terminal-column"),
  getActiveColumnCoordinates,
  guessText,
};
