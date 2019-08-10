import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-display')
export class LocoDisplay extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`div { text-align:center; }`,
      css`img { width:100%; }`
    ]
   ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String }) locoImage = null;
  @property({ type : String }) locoAddr = null;
  @property({ type : String }) locoDescription = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.locoImage != null
      ? html`
        <div class="container">
          <div><img src="/images/rocrail/${this.locoImage}" alt="${this.locoId}" title="${this.locoId}" /></div>
          <div><span class="label">${this.locoId} (${this.locoAddr}), ${this.locoDescription}</div></div>
        </div>`
      : html``
    }`;
  }

  sendInitCommand() {    
    //rocwct.send(`<lc id="${this.locoId}"  />`); 
    rocwct.send(`<model cmd="lcprops" />`); 
  }  

  onServerEvent(e:RocrailEventLc) {
    this.executeIfNotUndefined(e.lc.image, (val : string) => { this.locoImage = val });
    this.executeIfNotUndefined(e.lc.addr, (val : string) => { this.locoAddr = val });
    this.executeIfNotUndefined(e.lc.desc, (val : string) => { this.locoDescription = val });
  }

  executeIfNotUndefined(val : any, func : Function) {
    if(val !== undefined) {
      func(val);
    }
  }
}