import { LitElement, html, property, customElement } from 'lit-element';

@customElement('loco-throttle')
export class LocoThrottle extends LitElement {
  @property() name = 'LocoThrottle';

  render() {
    return html`<p>Hello! ${this.name}! <button @click="${this.clickHandler}">cklick me</button></p>`;
  } 

  clickHandler(e : Event) {
    console.log(e.target);
    this.name = "XXX";
  }
}
