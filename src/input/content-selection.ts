import dom from "../dom";
import { MemoryDump } from "../memory-dump";

export const contentSelection = (memoryDump: MemoryDump) => {
  return function handleContentSelection() {
    const coordinates = dom.query.getActiveColumnCoordinates();
    const boundaries = memoryDump.getGuessBoundary(coordinates.contiguousIndex);

    const contentContainer = dom.query.selectedContent();

    if (boundaries) {
      const selectedGuess = dom.creation.p({
        text: `>${dom.query.guessText(boundaries)}`,
      });
      const feedback = dom.creation.p({
        text: `>Entry denied.`,
      });
      const likeness = dom.creation.p({
        text: `>Likeness=1.`,
      });

      contentContainer.append(selectedGuess);
      contentContainer.append(feedback);
      contentContainer.append(likeness);
      console.log("Guess selected:", dom.query.guessText(boundaries));
    } else {
      const selectedGarbage = dom.creation.p({
        text: `>${
          dom.query.by.contiguousIndex(coordinates.contiguousIndex)?.innerText
        }`,
      });
      contentContainer.append(selectedGarbage);
      console.log(
        "Garbage selected:",
        dom.query.by.contiguousIndex(coordinates.contiguousIndex)?.innerText
      );
    }
  };
};
