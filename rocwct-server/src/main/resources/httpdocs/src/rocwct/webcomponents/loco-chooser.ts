import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLclist, Lclist, Lc } from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-chooser')
export class LocoChooser extends RocWctLitElement {

  static get styles() {
    return [
      RocWctLitElement.stylesRocWctLitElement,
      css`.locobox { padding:4px; cursor:pointer; }`,
      css`.selected { border:solid 2px #FCAE01; padding:2px;  }`,
    ];
  }

  @property({ type: Array }) locoList = new Array<Lc>();
  @property({ type: String }) selectedLoco = null;


  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lclist, res => this.onServerEventLc(res));
    this.sendInitCommand();
  }
  
  sendInitCommand() {    
    rocwct.send(`<model cmd="lclist" />`); 
  }  

  render() {
    return html`${this.locoList.length > 0
      ? html`<div>
            ${this.locoList.map(loco => html`
              <div class="locobox ${this.selectedLoco === loco.id ? 'selected' : ''}">
                <loco-display loco-id="${loco.id}" @click="${this.handleLocoboxClick}"></loco-display>
              </div>
            `)}
            </div>`
      : html``
    }`;
  }
  
  onServerEventLc(event:RocrailEventLclist) {
        
      this.locoList = new Array<Lc>();
      event.lclist.lc.forEach((loco,k) => {
        if(loco.show === true) {
          this.locoList.push(loco);
        }
      });

      // select first loco if no loco is selected
      if(this.selectedLoco === null && this.locoList.length > 0) {
         this.selectLoco(this.locoList[0].id);
      }
  }

  handleLocoboxClick(e : any) {
    this.selectLoco(e.target.getAttribute('loco-id'));    
  }

  private selectLoco(id : string) {
    this.selectedLoco = id;
    let onLocoChange = new CustomEvent('onLocoChange',  { 
        detail: { locoid: this.selectedLoco },
        bubbles: true, 
        composed: true 
      });
    this.dispatchEvent(onLocoChange);
  }
}

