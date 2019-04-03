import { LitElement, html, property, customElement } from 'lit-element';

@customElement('loco-function')
export class LocoFunction extends LitElement {
  @property() name = 'LocoFunction';

  render() {
    return html`<p>Hello ${this.name}!</p>`;
  }  
}
