const SPECIAL_CHARACTERS = [
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
	'/'
];

type TerminalDimensions = {
	rows: number;
	columns: number;
};

type TerminalRow = {
	memoryAddress: string;
	columns: string[];
};

type TerminalMatrix = {
	guessIndices: number[];
  dimensions: TerminalDimensions;
	guessLength: number;
  rows: TerminalRow[];
};

export const makeMatrix = (dimensions: TerminalDimensions, guessLength: number): TerminalMatrix => {
  return {
    guessIndices: [],
    dimensions: {
      rows: dimensions.rows,
      columns: dimensions.columns,
    },
    rows: [
      {
        memoryAddress: '0XABC',
        columns: ['a', 'b', 'c']
      }
    ],
    guessLength
  }
};
