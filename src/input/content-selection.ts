import dom from "../dom";
import { GuessBoundary, MatchStatus, MemoryDump } from "../memory-dump";

export const contentSelection = (memoryDump: MemoryDump) => {
  return function handleContentSelection() {
    const coordinates = dom.query.getActiveColumnCoordinates();
    const boundaries = memoryDump.getGuessBoundary(coordinates.contiguousIndex);

    boundaries
      ? registerGuess(boundaries, memoryDump)
      : dom.update.registerGarbageSelection(coordinates.contiguousIndex);
  };

  function registerGuess(boundaries: GuessBoundary, memoryDump: MemoryDump) {
    const matchResult = memoryDump.passphraseMatch(boundaries);

    matchResult.status === MatchStatus.FAILED
      ? dom.update.registerRejectedGuess(boundaries, matchResult.similarity)
      : dom.update.unlockTerminal();
  }
};
