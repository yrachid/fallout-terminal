import dom from "../dom";
import { MemoryDump } from "../memory-dump";

export const contentSelection = (memoryDump: MemoryDump) => {
  return function handleContentSelection() {
    const coordinates = dom.query.getActiveColumnCoordinates();
    const boundaries = memoryDump.getGuessBoundary(coordinates.contiguousIndex);

    boundaries
      ? dom.update.registerRejectedGuess(boundaries)
      : dom.update.registerGarbageSelection(coordinates.contiguousIndex);
  };
};
