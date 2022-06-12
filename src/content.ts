import rng from "./rng";

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

const formatMemoryAddress = (address: number) => `0X${address.toString(16)}`.substring(0, 6);

export const makeMatrix = (dimensions: TerminalDimensions, guessLength: number): TerminalMatrix => {
	const initialMemoryAddress = rng.memoryAddress();

	let rows: TerminalRow[] = [];
	for (let i = 0; i < dimensions.rows; i++) {
		const columns = [] ;
		for (let j = 0; j < dimensions.columns; j++) {
			columns.push(rng.garbage());
		}
		rows.push({
			memoryAddress: formatMemoryAddress(initialMemoryAddress + i * dimensions.columns),
			columns
		})
	}

	return {
		guessIndices: [],
		dimensions: {
			rows: dimensions.rows,
			columns: dimensions.columns
		},
		rows,
		guessLength
	};
};
