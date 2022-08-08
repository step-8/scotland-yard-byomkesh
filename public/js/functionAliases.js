const byId = (...args) => document.getElementById(...args);

const byClass = (...args) => [...document.getElementsByClassName(...args)];

const query = (...args) => document.querySelector(...args);

const queryAll = (...args) => [...document.querySelectorAll(...args)];

const createEl = (...args) => document.createElement(...args);

const appendChildTo = (parentQuery, child) => {
  const parent = query(parentQuery);
  parent.appendChild(child);
}

const removeAllChildren = (parentNode) => {
  let child = parentNode.firstChild;

  while (child) {
    parentNode.removeChild(child);
    child = parentNode.firstChild;
  }
}


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
    this.#element.appendChild(...element)
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
