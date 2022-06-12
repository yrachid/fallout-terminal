
const SPECIAL_CHARACTERS = [
  '!', '@', '#', '$', '%', '^',
  '&', '*', '-', '+', '=', '|',
  '\\', ';', ':', '"', "'", ',',
  '.', '?', '/',
];

const KEY_CODES = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37,
};

const rows = 17;
const columns = 12;

const contentSize = rows * columns;

const initialMemoryAddress = parseInt(Math.random() * 100_000);

const run = ({ initialMemoryAddress, rows, columns}) => {

  const toHexText = (intValue) => `0X${intValue.toString(16).toUpperCase()}`.substring(0, 6);

  const h = (mem) => {
    const textNode = document.createTextNode(toHexText(mem));
    const span = document.createElement('span');
    span.className = 'memory-address';
    span.appendChild(textNode);
    return span;
  }

  const c = (elementIndex) => {
    const index = Math.floor(Math.random() * SPECIAL_CHARACTERS.length);
    const content = SPECIAL_CHARACTERS[index];
    const textNode = document.createTextNode(content);
    const span = document.createElement('span');
    span.className = 'terminal-column';
    span.tabIndex = 0;
    span.id = `column-${elementIndex}`;
    span.appendChild(textNode);
    return span;
  }

  const terminalMatrix = [
    [h(initialMemoryAddress + 1), c(00), c(01), c(02), c(03), c(04), c(05), c(06), c(07), c(08), c(09), c(10), c(11)],
    [h(initialMemoryAddress + 2), c(12), c(13), c(14), c(15), c(16), c(17), c(18), c(19), c(20), c(21), c(22), c(23)],
    [h(initialMemoryAddress + 3), c(24), c(25), c(26), c(27), c(28), c(29), c(30), c(31), c(32), c(33), c(34), c(35)],
    [h(initialMemoryAddress + 4), c(36), c(37), c(38), c(39), c(40), c(41), c(42), c(43), c(44), c(45), c(46), c(47)],
    [h(initialMemoryAddress + 5), c(48), c(49), c(50), c(51), c(52), c(53), c(54), c(55), c(56), c(57), c(58), c(59)],
    [h(initialMemoryAddress + 6), c(60), c(61), c(62), c(63), c(64), c(65), c(66), c(67), c(68), c(69), c(70), c(71)],
  ]

  for (let row = 0; row < terminalMatrix.length; row++) {
    const terminalLine = document.createElement('p');
    terminalLine.className = 'terminal-line';

    terminalLine.append(...terminalMatrix[row]);

    document.body.appendChild(terminalLine);
  }

  document.querySelector('.terminal-column').focus();

  document.onkeydown = function(e) {
    const event = e || window.event;

    const currentColumn = document.activeElement;

    if (!currentColumn.id || !currentColumn.id.includes('column')) {
      const nextItem = document.querySelector('#column-0');
      nextItem.focus();
      return;
    }

    const currentIndex = parseInt(currentColumn.id.split('-')[1]);

    if (event.keyCode === KEY_CODES.RIGHT) {
      const nextSelector = `#column-${currentIndex + 1}`;
      const nextItem = document.querySelector(nextSelector);
      nextItem.focus();
    }

    if (event.keyCode === KEY_CODES.LEFT) {
      const nextSelector = `#column-${currentIndex - 1}`;
      const nextItem = document.querySelector(nextSelector);
      nextItem.focus();
    }

    if (event.keyCode === KEY_CODES.DOWN) {
      const nextSelector = `#column-${currentIndex + 12}`;
      const nextItem = document.querySelector(nextSelector);
      nextItem.focus();
    }

    if (event.keyCode === KEY_CODES.UP) {
      const nextSelector = `#column-${currentIndex - 12}`;
      const nextItem = document.querySelector(nextSelector);
      nextItem.focus();
    }
  }
}

run({ initialMemoryAddress, rows, columns });

