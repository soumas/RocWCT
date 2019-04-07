import { LitElement, html, property, customElement } from 'lit-element';

@customElement('loco-throttle')
export class LocoThrottle extends LitElement {
  @property() name = 'LocoThrottle';

  render() {
    return html`<p>Hello ${this.name}!</p>`;
  }  
}
