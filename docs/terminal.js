'use strict';

const range = (limit, cb) => [...Array(limit).keys()].map(cb);
const boundedRange = ({ start = 0, end }) => {
    const placeholder = [...Array(Math.abs(end - start)).keys()];
    return start < end
        ? placeholder.map((n) => n + start).concat([end])
        : placeholder.map((n) => -(n - start)).concat([end]);
};

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
const randomWithin = (limit) => Math.floor(Math.random() * limit);
const memoryAddress = () => randomWithin(100000);
const garbage = () => GARBAGE_CHARACTERS[randomWithin(GARBAGE_CHARACTERS.length)];
const randomItemOf = (items) => items[randomWithin(items.length)];
var rng = { randomWithin, randomItemOf, memoryAddress, garbage };

const formatMemoryAddress = (address) => `0X${address.toString(16)}`.substring(0, 6);
const formatMemoryDump = (dimensions, memoryDump) => {
    const initialMemoryAddress = rng.memoryAddress();
    const data = memoryDump.dumpedContent.split('');
    const firstBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));
    const secondBlock = range(dimensions.rowsPerBlock, () => data.splice(0, dimensions.columnsPerBlock));
    const firstBlockRows = firstBlock.map((data, idx) => {
        return {
            memoryAddress: formatMemoryAddress(initialMemoryAddress + idx * dimensions.columnsPerBlock),
            columns: data
        };
    });
    const secondBlockRows = secondBlock.map((data, idx) => {
        return {
            memoryAddress: formatMemoryAddress(initialMemoryAddress + dimensions.rowsPerBlock * dimensions.columnsPerBlock + idx * dimensions.columnsPerBlock),
            columns: data
        };
    });
    return {
        rowsPerBlock: {
            firstBlock: firstBlockRows,
            secondBlock: secondBlockRows
        },
    };
};

const span = (config) => {
    const span = document.createElement("span");
    span.className = config.className;
    if (config.tabIndex !== null && config.tabIndex !== undefined) {
        span.tabIndex = config.tabIndex;
    }
    const content = document.createTextNode(config.content);
    Object.entries(config.dataAttributes ?? {}).forEach(([key, value]) => {
        span.setAttribute(`data-${key}`, value.toString());
    });
    if (config.onFocus !== undefined) {
        span.addEventListener('focus', config.onFocus);
    }
    if (config.onBlur !== undefined) {
        span.addEventListener('blur', config.onBlur);
    }
    span.appendChild(content);
    return span;
};
const createElement = (name) => (config) => {
    const element = document.createElement(name);
    element.className = config.className;
    element.append(...config.children);
    return element;
};
const p = createElement("p");
const section = createElement("section");
var dom = { span, p, section };

const by = {
    contiguousIndex: (index) => document.querySelector(`.terminal-column[data-contiguous-index="${index}"]`),
    columnRowAndBlock: (data) => document.querySelector(`.terminal-column[data-column="${data.column}"][data-row="${data.row}"][data-block="${data.block}"]`),
};
const getActiveColumnCoordinates = () => {
    const activeColumn = document.activeElement;
    return {
        row: parseInt(activeColumn.dataset.row),
        column: parseInt(activeColumn.dataset.column),
        block: parseInt(activeColumn.dataset.block),
        contiguousIndex: parseInt(activeColumn.dataset.contiguousIndex),
    };
};
var domQuery = {
    by,
    firstColumn: () => document.querySelector(".terminal-column"),
    terminalContainer: () => document.querySelector("#block-container"),
    isActiveElementATerminalColumn: () => document.activeElement &&
        document.activeElement.classList.contains("terminal-column"),
    getActiveColumnCoordinates,
};

const SecurityLevels = {
    L1: {
        passphraseLength: 5,
        passphrasesDumped: 8,
    },
};
const GUESSES = [
    "WHICH",
    "OTHER",
    "ABOUT",
    "MAYBE",
    "LUNCH",
    "EVERY",
    "THEIR",
    "FAITH",
    "FEVER",
    "HEADS",
    "CRAZY",
    "GYOZA",
    "PROXY",
    "CHECK",
];
const generateGuesses = (guessCount) => {
    const guesses = new Set();
    while (guesses.size < guessCount) {
        const nextItem = rng.randomItemOf(GUESSES);
        if (!guesses.has(nextItem)) {
            guesses.add(nextItem);
        }
    }
    return [...guesses];
};
const getMemoryDump = (dumpSize, securityLevel) => {
    const guessesSize = securityLevel.passphraseLength * securityLevel.passphrasesDumped;
    const garbageSize = dumpSize - guessesSize;
    const guesses = generateGuesses(securityLevel.passphrasesDumped);
    const garbage = range(garbageSize, () => rng.garbage()).join("");
    // TODO: Improve guess distribution logic
    const groupOffset = Math.floor(garbageSize / (securityLevel.passphrasesDumped + 1));
    const guessIndices = range(securityLevel.passphrasesDumped, (i) => groupOffset * i + 1).map((offset) => {
        const nextIndex = rng.randomWithin(groupOffset - securityLevel.passphraseLength) + offset;
        return Math.min(nextIndex, garbageSize - securityLevel.passphraseLength);
    });
    const insertGuessesIntoGarbage = (result, guessIndex) => result.slice(0, guessIndex) + guesses.pop() + result.slice(guessIndex);
    const dumpedContent = guessIndices.reduce(insertGuessesIntoGarbage, garbage);
    const guessBoundaries = guessIndices.map((index) => ({
        start: index,
        end: index + (securityLevel.passphraseLength - 1),
    }));
    const getGuessBoundary = (index) => guessBoundaries.find(({ start, end }) => index >= start && index <= end);
    return {
        guessIndices,
        dumpedContent,
        getGuessBoundary,
    };
};

const KEY_CODES = {
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
};
const movement = (terminalDimensions, memoryDump) => {
    const move = {
        [KEY_CODES.DOWN]: (coord) => coord.row === terminalDimensions.rowsPerBlock - 1
            ? { row: 0 }
            : { row: coord.row + 1 },
        [KEY_CODES.UP]: (coord) => coord.row === 0
            ? { row: terminalDimensions.rowsPerBlock - 1 }
            : { row: coord.row - 1 },
        [KEY_CODES.LEFT]: (coord) => coord.column === 0
            ? {
                column: terminalDimensions.columnsPerBlock - 1,
                block: coord.block === 0 ? 1 : 0,
            }
            : {
                column: coord.column - 1,
            },
        [KEY_CODES.RIGHT]: (coord) => coord.column === terminalDimensions.columnsPerBlock - 1
            ? {
                column: 0,
                block: coord.block === 0 ? 1 : 0,
            }
            : {
                column: coord.column + 1,
            },
    };
    const getNextColumn = (movement) => {
        const coordinates = domQuery.getActiveColumnCoordinates();
        const guessBoundary = memoryDump.getGuessBoundary(coordinates.contiguousIndex);
        if (guessBoundary !== undefined && movement === KEY_CODES.RIGHT) {
            return domQuery.by.contiguousIndex(guessBoundary.end + 1);
        }
        if (guessBoundary !== undefined && movement === KEY_CODES.LEFT) {
            return domQuery.by.contiguousIndex(guessBoundary.start - 1);
        }
        const nextCoordinates = { ...coordinates, ...move[movement](coordinates) };
        return domQuery.by.columnRowAndBlock(nextCoordinates);
    };
    return function handleCursorMovement(event) {
        if (!domQuery.isActiveElementATerminalColumn()) {
            domQuery.firstColumn().focus();
            return;
        }
        if (Object.values(KEY_CODES).includes(event.key)) {
            getNextColumn(event.key)?.focus();
        }
    };
};

const terminalDimensions = {
    rowsPerBlock: 17,
    columnsPerBlock: 12,
};
const memoryDumpSize = terminalDimensions.columnsPerBlock * terminalDimensions.rowsPerBlock * 2 + 1;
const memoryDump = getMemoryDump(memoryDumpSize, SecurityLevels.L1);
const matrix = formatMemoryDump(terminalDimensions, memoryDump);
const buildBlockOfRows = (rowContent, blockIndex) => rowContent.map((row, rowIndex) => dom.p({
    className: "terminal-line",
    children: [
        dom.span({
            className: "memory-address",
            content: row.memoryAddress,
        }),
        ...row.columns.map((c, columnIndex) => {
            const contiguousIndex = columnIndex +
                terminalDimensions.columnsPerBlock * rowIndex +
                blockIndex *
                    (terminalDimensions.columnsPerBlock *
                        terminalDimensions.rowsPerBlock);
            return dom.span({
                className: "terminal-column",
                tabIndex: 0,
                content: c,
                dataAttributes: {
                    block: blockIndex,
                    column: columnIndex,
                    row: rowIndex,
                    "contiguous-index": contiguousIndex,
                },
                onFocus: () => {
                    const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);
                    if (guessBounds !== undefined) {
                        boundedRange(guessBounds).forEach((i) => domQuery.by.contiguousIndex(i)?.classList.add("active-column"));
                    }
                },
                onBlur: () => {
                    const guessBounds = memoryDump.getGuessBoundary(contiguousIndex);
                    if (guessBounds !== undefined) {
                        boundedRange(guessBounds).forEach((i) => domQuery.by
                            .contiguousIndex(i)
                            ?.classList.remove("active-column"));
                    }
                },
            });
        }),
    ],
}));
const firstBlockRows = buildBlockOfRows(matrix.rowsPerBlock.firstBlock, 0);
const secondBlockRows = buildBlockOfRows(matrix.rowsPerBlock.secondBlock, 1);
domQuery.terminalContainer()?.append(dom.section({
    className: "terminal-block",
    children: firstBlockRows,
}), dom.section({
    className: "terminal-block",
    children: secondBlockRows,
}));
document.onkeydown = movement(terminalDimensions, memoryDump);
domQuery.firstColumn().focus();
//# sourceMappingURL=terminal.js.map
