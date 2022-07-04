import { TerminalDimensions } from "../content";
import { MemoryDump } from "../memory-dump";
import { inputHandler } from "./input-handler";

export default {
  registerInputHandlers: (
    terminalDimensions: TerminalDimensions,
    memoryDump: MemoryDump
  ) => (document.onkeydown = inputHandler(terminalDimensions, memoryDump)),
};
