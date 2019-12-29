import { html, customElement, css } from 'lit-element';
import { RocWctLitElement } from './base/rocwct-litelement';
import { RocWCT } from '../rocwct';

@customElement('rcp-tester')
export class RcpTester extends RocWctLitElement {

  render() {
    return html`
      <textarea rows="10" id="cmd" placeholder="z.B.: <sys cmd=&quot;go&quot; />" style="width:100%"></textarea><br/>
      <button @click="${this.handleClick}" >Send command</button><br/>
      <span><a href="https://wiki.rocrail.net/doku.php?id=cs-protocol-en" target="_blank">Rocrail Client Protocol (RCP)</a></span>
    `;
  }

  private handleClick() {    
    let cmd : string = (this.shadowRoot.querySelector('#cmd') as HTMLInputElement).value;
    RocWCT.router.send(cmd);
  }
}