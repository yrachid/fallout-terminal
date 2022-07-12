type Span = {
  className: string;
  content: string;
  tabIndex?: number;
  dataAttributes?: Record<string, string | number>;
  onFocus?: () => any;
  onBlur?: () => any;
};

const span = (config: Span) => {
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
    span.addEventListener("focus", config.onFocus);
  }

  if (config.onBlur !== undefined) {
    span.addEventListener("blur", config.onBlur);
  }

  span.appendChild(content);

  return span;
};

type ElementConfig = {
  className?: string;
  children?: HTMLElement[];
  text?: string;
};

const createElement = (name: string) => (config: ElementConfig) => {
  const element = document.createElement(name);
  if (config.className) {
    element.className = config.className;
  }

  if (config.children) {
    element.append(...config.children);
  }

  if (config.text) {
    element.innerText = config.text;
  }

  return element;
};

const p = createElement("p");

const section = createElement("section");

const h1 = createElement("h1");

export default { span, p, section, h1 };
