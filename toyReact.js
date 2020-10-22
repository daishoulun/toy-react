class ElementWrapper  {
  constructor(type) {
    this.root = document.createElement(type)
    console.log('elementWrapper')
  }
  setAttribute(name, value) {
    console.log('elementWrapper---setAttribute')
    this.root.setAttribute(name, value)
  }
  appendChild(component) {
    console.log('elementWrapper---appendChild')
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(content) {
    console.log('TextWrapper')
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    console.log('Component')
    this.props = Object.create(null);
    this.children = []
    this._root = null;
  }
  setAttribute(name, value) {
    console.log('Component---setAttribute')
    this.props[name] = value
  }
  appendChild(component) {
    console.log('Component---appendChild')
    this.children.push(component)
  }
  get root() {
    console.log('Component---get root')
    console.log('Component---get root', this._root)
    if (!this._root) {
      this._root = this.render().root
    }
    console.log('Component---get root', this._root)
    return this._root
  }
}

export function createElement(type, attributes, ...children) {
  console.log('createElement')
  console.log('createElement params:',type, attributes, ...children)
  let e;
  if (typeof type === 'string') {
    e = new ElementWrapper(type)
  } else {
    e = new type;
  }
  for (let key in attributes) {
    e.setAttribute(key, attributes[key])
  }

  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      if ((typeof child === 'object') && (child instanceof Array)) {
        insertChildren(child)
      } else {
        e.appendChild(child)
      }
    }
  }
  insertChildren(children)
  return e
}
export function render(component, parentElement) {
  console.log('render')
  parentElement.appendChild(component.root)
}


