import { makeMatrix } from './content';
import dom from './dom';

// const KEY_CODES = {
//   UP: 38,
//   RIGHT: 39,
//   DOWN: 40,
//   LEFT: 37,
// };

const matrix = makeMatrix(
  {
    rowsPerBlock: 17,
    columnsPerBlock: 12
  },
  5
);



const leftRows = matrix.rows.map((row) =>
  dom.p({
    className: 'terminal-line',
    children: [
      dom.span({
        className: 'memory-address',
        content: row.memoryAddress
      }),
      ...row.columns.map((c) => dom.span({ className: 'terminal-line', tabIndex: 0, content: c }))
    ]
  })
);

const rightRows = matrix.rows.map((row) =>
  dom.p({
    className: 'terminal-line',
    children: [
      dom.span({
        className: 'memory-address',
        content: row.memoryAddress
      }),
      ...row.columns.map((c) => dom.span({ className: 'terminal-line', tabIndex: 0, content: c }))
    ]
  })
);

const terminalBlockContainer = document.querySelector('#block-container');

terminalBlockContainer?.append(
  dom.section({
    className: 'terminal-block',
    children: leftRows
  }),
  dom.section({
    className: 'terminal-block',
    children: rightRows 
  }),
);

console.log('Making Matrix', matrix);
console.log('Guess Indices', matrix.guessIndices);