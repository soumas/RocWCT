import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventState }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('power-switch')
export class PowerSwitch extends RocWctLitElement {

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
    this.registerServerEvent(EServerEvent.state, null, res => this.onServerEvent(res));
  }
    
  render() {
    return html`${this.on != null
      ? html`<button class="${this.on === true ? "on" : "off"}" @click="${this.handleClick}"><slot name="btnContent">Power </slot></button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendCmd();
  }

  onServerEvent(event : RocrailEventState) {
    this.on = event.state.power;
  }

  sendCmd() : void {
    let cmd : string = `<sys cmd="${this.on === true ? "stop" : "go"}" />`;
    rocwct.send(cmd); 
  }

}