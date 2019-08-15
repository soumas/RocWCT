import { html, customElement, css, property } from 'lit-element';
import { RocWctLocoDependentElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-display')
export class LocoDisplay extends RocWctLocoDependentElement {

  static get styles() {
    return [ 
      RocWctLocoDependentElement.stylesRocWctLocoDependentElement,
      css`div { text-align:center; }`,
      css`img { width:100%; }`
    ]
   ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : Boolean, attribute : "hide-description" }) hideDescr = false;
  @property({ type : String }) locoImage = null;
  @property({ type : String }) locoAddr = null;
  @property({ type : String }) locoDescription = null;
  @property({ type : String }) locoMode = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.handleLocoEvent(res, e => this.onServerEvent(e)));
  }
    
  render() {
    return html`${this.locoImage != null
      ? html`
        <div class="container">
          <div><img src="/images/rocrail/${this.locoImage}" alt="${this.locoId}" title="${this.locoId}" /></div>
          <div><span class="label">${this.locoId} (${this.locoAddr}) [${this.locoMode}]</span> <span style="display:${(this.hideDescr === false && this.locoDescription !== null && this.locoDescription.length > 0) ? '' : 'none'};" class="label">, ${this.locoDescription}</span></div>
        </div>`
      : html``
    }`;
  }

  protected onLocoIdChange(): void {
    rocwct.send(`<model cmd="lcprops" />`);
  }

  onServerEvent(e:RocrailEventLc) {
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