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

const cursorContentHolder = () =>
  document.querySelector("#prompt-cursor-content") as HTMLElement;

const promptHistory = () =>
  document.querySelector("#prompt-history") as HTMLElement;

const attemptCounter = () =>
  document.querySelector("#number-of-attempts") as HTMLElement;

const attemptsDisplay = () =>
  document.querySelector("#attempt-squares") as HTMLElement;

const lockoutWarning = () =>
  document.querySelector("#lockout-warning") as HTMLElement;

const guessText = (bounds: GuessBoundary) =>
  boundedRange(bounds)
    .map((i) => by.contiguousIndex(i))
    .map((column) => column?.innerText)
    .join("");

const textAt = (contiguousIndex: number) =>
  by.contiguousIndex(contiguousIndex)?.innerText;

export default {
  by,
  firstColumn: () => document.querySelector(".terminal-column") as HTMLElement,
  terminalContainer: () => document.querySelector("#container") as HTMLElement,
  isActiveElementATerminalColumn: () =>
    document.activeElement &&
    document.activeElement.classList.contains("terminal-column"),
  getActiveColumnCoordinates,
  guessText,
  cursorContentHolder,
  promptHistory,
  textAt,
  attemptCounter,
  attemptsDisplay,
  lockoutWarning,
};
