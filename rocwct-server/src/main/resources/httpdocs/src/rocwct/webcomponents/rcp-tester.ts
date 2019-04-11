import { html, customElement, css } from 'lit-element';
import { RocWctLitElement }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('rcp-tester')
export class RcpTester extends RocWctLitElement {

  render() {
    return html`
      <input type="text" id="cmd" value="<sys cmd=&quot;go&quot; />"><br/>
      <button @click="${this.handleClick}">Send command</button>
    `;
  }

  private handleClick() {    
    let cmd : string = (this.shadowRoot.querySelector('#cmd') as HTMLInputElement).value;
    rocwct.send(cmd);
  }
}