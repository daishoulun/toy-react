const RENDER_TO_DOM = Symbol('render to dom')

class ElementWrapper  {
  constructor(type) {
    this.root = document.createElement(type)
    console.log('elementWrapper')
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    } else {
      if (name === 'className') {
        this.root.setAttribute('class', value)
      } else {
        this.root.setAttribute(name, value)
      }
    }
    console.log('elementWrapper---setAttribute')
  }
  appendChild(component) {
    console.log('elementWrapper---appendChild')
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    component[RENDER_TO_DOM](range)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(content) {
    console.log('TextWrapper')
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    console.log('Component')
    this.props = Object.create(null);
    this.children = []                      
    this._root = null;
    this._range = null
  }
  setAttribute(name, value) {
    console.log('Component---setAttribute')
    this.props[name] = value
  }
  appendChild(component) {
    console.log('Component---appendChild')
    this.children.push(component)
  }
  [RENDER_TO_DOM](range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }
  rerender() {
    let oldRange = this._range
    let range = document.createRange()
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    this[RENDER_TO_DOM](range)

    oldRange.setStart(range.endContainer, range.endOffset)
    oldRange.deleteContents()
  }
  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => {
      for (p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        } else {
          merge(oldState[p], newState[p])
        }
      }
    }

    merge(this.state, newState)
    this.rerender()
  }
  // get root() {
  //   console.log('Component---get root')
  //   console.log('Component---get root', this._root)
  //   if (!this._root) {
  //     this._root = this.render().root
  //   }
  //   console.log('Component---get root', this._root)
  //   return this._root
  // }
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
      if (child === null) {
        continue
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
  let range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RENDER_TO_DOM](range)
  // parentElement.appendChild(component.root)
}


