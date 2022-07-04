import dom from "../dom";
import { MemoryDump } from "../memory-dump";

export const contentSelection = (memoryDump: MemoryDump) => {
  return function handleContentSelection() {
    const coordinates = dom.query.getActiveColumnCoordinates();
    const boundaries = memoryDump.getGuessBoundary(coordinates.contiguousIndex);

    if (boundaries) {
      console.log("Guess selected:", dom.query.guessText(boundaries));
    } else {
      console.log(
        "Garbage selected:",
        dom.query.by.contiguousIndex(coordinates.contiguousIndex)?.innerText
      );
    }
  };
};
