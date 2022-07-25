import { boundedRange, range } from "../collections";
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

/* TODO: Refactor attempt handling logic */
const setAttempts = (attempts: number) => {
  const numberOfAttempts = query.attemptCounter();
  numberOfAttempts.dataset.attempts = `${attempts}`;
  numberOfAttempts.innerText = `${attempts}`;

  const attemptsDisplay = query.attemptsDisplay();

  attemptsDisplay.innerText = range(attempts, () => "■").join(" ");
};

const lockTerminal = () => {
  document.body.innerHTML = `
  <div id="lockout-message-container">
    <h1>You have been locked out</h1>
    <h2>Refresh to retry</h2>
  </div>
  `;
};

const unlockTerminal = () => {
  document.body.innerHTML = `
  <div id="lockout-message-container">
    <h1>Congratulations?</h1>
  </div>
  `;
};

const decrementAttempts = () => {
  const numberOfAttempts = query.attemptCounter();
  const currentAttempts = parseInt(numberOfAttempts.dataset.attempts ?? "0");

  if (currentAttempts === 2) {
    query.lockoutWarning().classList.toggle("hidden");
  }

  if (currentAttempts <= 1) {
    lockTerminal();
  } else {
    numberOfAttempts.innerText = `${currentAttempts - 1}`;
    numberOfAttempts.dataset.attempts = `${currentAttempts - 1}`;

    const attemptsDisplay = query.attemptsDisplay();

    attemptsDisplay.innerText = range(currentAttempts - 1, () => "■").join(" ");
  }
};

const registerRejectedGuess = (boundaries: GuessBoundary, likeness: number) => {
  const promptHistory = query.promptHistory();

  const guessText = creation.p({
    text: `>${query.guessText(boundaries)}`,
  });
  const feedback = creation.p({
    text: `>Entry denied.`,
  });
  const likenessFeedback = creation.p({
    text: `>Likeness=${likeness}.`,
  });

  promptHistory.append(guessText, feedback, likenessFeedback);
  decrementAttempts();
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
  registerGarbageSelection,
  setAttempts,
  decrementAttempts,
  unlockTerminal
};
