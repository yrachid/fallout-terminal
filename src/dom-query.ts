export type ColumnRowAndBlock = {
  column: number;
  row: number;
  block: number;
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

export default {
  by,
  firstColumn: () => document.querySelector(".terminal-column") as HTMLElement,
  terminalContainer: () => document.querySelector("#block-container") as HTMLElement,
  isActiveElementATerminalColumn: () => document.activeElement && document.activeElement.classList.contains("terminal-column")
};
