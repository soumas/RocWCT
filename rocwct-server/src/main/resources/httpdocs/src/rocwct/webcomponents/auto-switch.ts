import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventAuto }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('auto-switch')
export class AutoSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn-on::after { content: " ON"; } `,
      css`.btn-off::after { content: "OFF "; } `
    ]
   ;
  }

  @property({ type : Boolean })  on = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.auto, null, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<button class="btn ${this.on === true ? "btn-on" : "btn-off"}" @click="${this.handleClick}">Auto</button>`
      : html``
    }`;
  }

  sendInitCommand() {    
    rocwct.send('<sys cmd="getstate"/>');
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