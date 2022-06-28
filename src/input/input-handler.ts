import { TerminalDimensions } from "../content";
import { contentSelection } from "./content-selection";
import { MemoryDump } from "../memory-dump";
import { movement } from "./movement";
import { KeyCode, KeyMap } from "./key-mapping";

export const inputHandler = (
  terminalDimensions: TerminalDimensions,
  memoryDump: MemoryDump
) => {
  const handleMovement = movement(terminalDimensions, memoryDump);
  const handleContentSelection = contentSelection(memoryDump);

  return function handleInput(event: KeyboardEvent) {
    const mappedKey = KeyMap[event.key];

    if (mappedKey === undefined) {
      return;
    }

    mappedKey === KeyCode.ENTER
      ? handleContentSelection()
      : handleMovement(mappedKey);
  };
};
