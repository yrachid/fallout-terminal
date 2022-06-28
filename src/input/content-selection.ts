import domQuery from "../dom-query";
import { MemoryDump } from "../memory-dump";

export const contentSelection = (memoryDump: MemoryDump) => {
  return function handleContentSelection() {
    const coordinates = domQuery.getActiveColumnCoordinates();
    const boundaries = memoryDump.getGuessBoundary(coordinates.contiguousIndex);

    if (boundaries) {
      console.log("Guess selected:", domQuery.guessText(boundaries));
    } else {
      console.log(
        "Garbage selected:",
        domQuery.by.contiguousIndex(coordinates.contiguousIndex)?.innerText
      );
    }
  };
};
