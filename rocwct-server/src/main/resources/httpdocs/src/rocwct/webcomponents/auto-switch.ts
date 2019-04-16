import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventAuto }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('auto-switch')
export class AutoSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      css`.on::after { content: " ON"; } `,
      css`.off::after { content: "OFF "; } `
    ]
   ;
  }

  @property({ type : Boolean })  on = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.auto, null, res => this.onServerEvent(res));
  }
    
  render() {
    return html`${this.on != null
      ? html`<button class="${this.on === true ? "on" : "off"}" @click="${this.handleClick}"><slot name="btnContent">Auto </slot></button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendCmd();
  }

  onServerEvent(event : RocrailEventAuto) {
    this.on = event.auto.cmd === 'on';
  }

  sendCmd() : void {
    let cmd : string = `<auto cmd="${this.on === true ? "off" : "on"}" />`;
    rocwct.send(cmd); 
  }

}