import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventAuto }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('auto-switch')
export class AutoSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles
    ]
   ;
  }

  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "icon" }) icon = "auto-mode.svg";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.auto, res => this.onServerEvent(res));
    this.sendInitCommand();
  }

  render() {
    return html`${this.on != null
      ? html`<div class="btn-container">
                <div class="btn icon ${this.on === true ? "on" : "off"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
            </div>`
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
    let cmd : string = `<auto cmd="${this.on === true ? "off" : "on"}"  controlcode="" slavecode="" />`;
    rocwct.send(cmd); 
  }

}