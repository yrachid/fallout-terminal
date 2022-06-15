const GARBAGE_CHARACTERS = [
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '-',
  '+',
  '=',
  '|',
  '\\',
  ';',
  ':',
  '"',
  "'",
  ',',
  '.',
  '?',
  '/',
  '[',
  ']',
  '<',
  '>',
  '{',
  '}'
];

const randomWithin = (limit: number): number => Math.floor(Math.random() * limit);

const memoryAddress = () => randomWithin(100000);

const garbage = () => GARBAGE_CHARACTERS[randomWithin(GARBAGE_CHARACTERS.length)];

const randomItemOf = <T>(items: T[]): T => items[randomWithin(items.length)]

export default { randomWithin, randomItemOf, memoryAddress, garbage };
