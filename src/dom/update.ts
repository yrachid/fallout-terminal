import { boundedRange } from "../collections";
import { GuessBoundary, MemoryDump } from "../memory-dump";
import query from "./query";
import creation from "./element-creation";

const toggleColumnHighlight = (boundaries: GuessBoundary) => {
  boundedRange(boundaries).forEach((i) =>
    query.by.contiguousIndex(i)?.classList.toggle("active-column")
  );
};

const setCursorText = (text: string) => {
  query.cursorContentHolder().innerText = text;
};

const setCursorTextFromGarbage = (columnContiguousIndex: number) =>
  setCursorText(query.textAt(columnContiguousIndex) ?? "");

const setCursorTextFromGuess = (boundaries: GuessBoundary) =>
  setCursorText(query.guessText(boundaries));

const registerRejectedGuess = (boundaries: GuessBoundary) => {
  const promptHistory = query.promptHistory();

  const guessText = creation.p({
    text: `>${query.guessText(boundaries)}`,
  });
  const feedback = creation.p({
    text: `>Entry denied.`,
  });
  const likeness = creation.p({
    text: `>Likeness=1.`,
  });

  promptHistory.append(guessText, feedback, likeness);
};

const registerGarbageSelection = (contiguousIndex: number) =>
  query.promptHistory().append(
    creation.p({
      text: `>${query.textAt(contiguousIndex)}`,
    })
  );

export default {
  toggleColumnHighlight,
  setCursorTextFromGarbage,
  setCursorTextFromGuess,
  registerRejectedGuess,
  registerGarbageSelection
};
