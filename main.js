import { createElement, Component, render } from './toyReact'

class MyToyReact extends Component {
  render() {
    return (
      <div class="a">
        <h1>my toy react</h1>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
        {this.children}
      </div>
    )
  }
}

render(<MyToyReact id="toy" class="react"><h2>my toy react</h2></MyToyReact>, document.body)