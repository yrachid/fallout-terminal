type Span = {
  className: string;
  content: string;
  tabIndex?: number;
};
const span = (config: Span) => {
  const span = document.createElement('span');
  span.className = config.className;
  if (config.tabIndex) {
    span.tabIndex = config.tabIndex;
  }
  const content = document.createTextNode(config.content);

  span.appendChild(content);

  return span;
};

type Paragraph = {
  className: string;
  children: HTMLElement[];
};

const p = (config: Paragraph) => {
  const paragraph = document.createElement('p');
  paragraph.className = config.className;
  paragraph.append(...config.children);

  return paragraph;
};

export default { span, p };
