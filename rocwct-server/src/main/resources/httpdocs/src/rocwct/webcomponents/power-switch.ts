import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventState }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('power-switch')
export class PowerSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles
    ]
   ;
  }

  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "icon" }) icon = "power.svg";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.state, res => this.onServerEvent(res));
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

  onServerEvent(event : RocrailEventState) {
    this.on = event.state.power;
  }

  sendCmd() : void {
    let cmd : string = `<sys cmd="${this.on === true ? "stop" : "go"}" />`;
    rocwct.send(cmd); 
  }

}