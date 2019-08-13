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
  @property({ type : Boolean, attribute : "show-description" }) showDescr = 'true';
  @property({ type : String }) locoImage = null;
  @property({ type : String }) locoAddr = null;
  @property({ type : String }) locoDescription = null;
  @property({ type : String }) locoMode = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.onServerEvent(res));
  }
    
  render() {
    return html`${this.locoImage != null
      ? html`
        <div class="container">
          <div><img src="/images/rocrail/${this.locoImage}" alt="${this.locoId}" title="${this.locoId}" /></div>
          <div><span class="label">${this.locoId} (${this.locoAddr}) [${this.locoMode}]</span> <span style="display:${this.showDescr === 'true' ? '' : 'none'};" class="label">, ${this.locoDescription}</span></div>
        </div>`
      : html``
    }`;
  }

  updated(changedProperties : Map<string,any>) {
    if(changedProperties.has('locoId')) {
      this.sendInitCommand();
    }
  }

  sendInitCommand() {    
    rocwct.send(`<model cmd="lcprops" />`); 
  }  

  onServerEvent(e:RocrailEventLc) {

    if(e.lc.id !== this.locoId) {
      return;
    }

    this.executeIfNotUndefined(e.lc.image, (val : string) => { this.locoImage = val });
    this.executeIfNotUndefined(e.lc.addr, (val : string) => { this.locoAddr = val });
    this.executeIfNotUndefined(e.lc.desc, (val : string) => { this.locoDescription = val });
    this.executeIfNotUndefined(e.lc.mode, (val : string)  => { this.locoMode = val });
  }

  executeIfNotUndefined(val : any, func : Function) {
    if(val !== undefined) {
      func(val);
    }
  }
}