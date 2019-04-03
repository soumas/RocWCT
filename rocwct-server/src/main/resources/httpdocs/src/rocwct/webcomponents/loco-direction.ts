import { LitElement, html, property, customElement } from 'lit-element';

@customElement('loco-direction')
export class LocoDirection extends LitElement {
  @property() name = 'LocoDirection';

  render() {
    return html`<p>Hello ${this.name}!</p>`;
  }  
}
