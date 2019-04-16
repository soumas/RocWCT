import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-direction')
export class LocoDirection extends RocWctLitElement {

  static get styles() {
    return [ 
      css`.forward::after { content: " >>"; } `,
      css`.backward::before { content: "<< "; } `
    ]
   ;
  }

  @property({ type : Boolean })  forward = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "direction" }) direction = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEvent(res));
    // trigger server-event by sending an empty dir-command
    this.sendDirCmd();    
  }
    
  render() {
    return html`${this.forward != null
      ? html`<button class="${this.forward === true ? "forward" : "backward"}" @click="${this.handleClick}"><slot name="btnContent">${this.locoId}</slot></button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendDirCmd();
  }

  onServerEvent(event:RocrailEventLc) {
    this.forward = event.lc.dir;
  }

  sendDirCmd() : void {
    let dirTerm : string;    
    if(this.forward != null) {
      if(this.direction === 'forward') {
        dirTerm = `dir="true"`;
      } else if(this.direction === 'backward') {
        dirTerm = `dir="false"`;
      } else {
        dirTerm = `dir="${this.forward === true ? "false" : "true"}"`;
      }
    } else {
      dirTerm = '';
    }
    rocwct.send(`<lc id="${this.locoId}" ${dirTerm}  />`); 
  }

}