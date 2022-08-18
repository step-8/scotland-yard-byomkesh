const byId = (id) => document.getElementById(id);

const byClass = (className) => [...document.getElementsByClassName(className)];

const query = (selector) => document.querySelector(selector);

const queryAll = (selector) => [...document.querySelectorAll(selector)];

const createEl = (tagName) => document.createElement(tagName);

const appendChildTo = (parentQuery, child) => {
  const parent = query(parentQuery);
  parent.appendChild(child);
};

const removeAllChildren = (parentNode) => {
  let child = parentNode.firstChild;

  while (child) {
    parentNode.removeChild(child);
    child = parentNode.firstChild;
  }
};
class Element {
  #element;
  constructor(element) {
    this.#element = document.createElement(element);
  }

  add(property, value) {
    this.#element[property] = value;
    return this;
  }

  append(...element) {
    this.#element.appendChild(...element);
    return this;
  }

  addEvent(event, handler) {
    this.#element.addEventListener(event, handler);
    return this;
  }

  addClass(elementClass) {
    this.#element.classList.add(elementClass);
    return this;
  }

  id(elementId) {
    this.#element.id = elementId;
    return this;
  }

  replace(...children) {
    this.#element.replaceChildren(...children);
    return this;
  }

  get html() {
    return this.#element;
  }
}
