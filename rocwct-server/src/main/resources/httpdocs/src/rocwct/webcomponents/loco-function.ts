import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventFn }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-function')
export class LocoFunction extends RocWctLitElement {

  static get styles() {
    return [ 
      css`.on::after { content: " ON"; } `,
      css`.off::after { content: "OFF "; } `
    ]
   ;
  }

  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "fn" }) fn = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.fn, this.locoId, res => this.onServerEvent(res));
  }
    
  render() {
    return html`${this.on != null
      ? html`<button class="${this.on === true ? "on" : "off"}" @click="${this.handleClick}"><slot name="btnContent">${this.locoId}, ${this.fn}, </slot></button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendCmd();
  }

  onServerEvent(event : RocrailEventFn) {
    if(!(event.fn as any).hasOwnProperty(this.fn)) {
      return;
    }
    this.on = eval('event.fn.'+this.fn) === true;
  }

  sendCmd() : void {
    let cmd : string = `<fn id="${this.locoId}" ${this.fn}="${this.on === true ? "false" : "true"}"  />`;
    rocwct.send(cmd); 
  }

}