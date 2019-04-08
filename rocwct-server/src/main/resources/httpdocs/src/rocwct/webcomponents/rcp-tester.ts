import { html, customElement } from 'lit-element';
import { RocWctLitElement }  from '../base/rocwct-lit-element';

@customElement('rcp-tester')
export class RcpTester extends RocWctLitElement {

  render() {
    return html`
      <style>button { background-color:yellow; }</style>
      <textarea id="cmd"><sys cmd="go" /></textarea><br/>
      <button @click="${this.handleClick}">Send command</button>
    `;
  }  

  handleClick() {    
    let cmd : string = (this.shadowRoot.querySelector('#cmd') as HTMLTextAreaElement).value;
    this.sendCmd(cmd);
  }
}