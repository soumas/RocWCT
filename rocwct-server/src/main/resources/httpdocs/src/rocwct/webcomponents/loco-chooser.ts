import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLclist, Lclist, Lc } from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-chooser')
export class LocoChooser extends RocWctLitElement {

  static get styles() {
    return [
      RocWctLitElement.baseStyles
    ];
  }

  @property({ type: Array }) locoList = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lclist, null, res => this.onServerEventLc(res));
    this.sendInitCommand();
  }
  
  sendInitCommand() {    
    rocwct.send(`<model cmd="lclist" />`); 
  }  

  render() {
    return html`${this.locoList != null
      ? html`<ul>
            ${this.locoList.map(loco => html`
              <li>
                <loco-display loco-id="${loco.id}"></loco-display>
              </li>
            `)}
            </ul>`
      : html``
    }`;
  }
  
  onServerEventLc(event:RocrailEventLclist) {  
      this.locoList = event.lclist.lc;
  }
}

