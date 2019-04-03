import { LitElement, html, property, customElement } from 'lit-element';

@customElement('rcp-composer')
export class RcpComposer extends LitElement {
  @property() name = 'RcpComposer';

  render() {
    return html`<p>Hello ${this.name}!</p>`;
  }  
}
