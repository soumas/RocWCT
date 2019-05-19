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
  @property({ type : String })  icon = null;
  @property({ type : String, attribute : "icon-on" }) iconOn = "cached";
  @property({ type : String, attribute : "icon-off" }) iconOff = "cached";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.auto, null, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<button @click="${this.handleClick}"><iron-icon class="btn ${this.on === true ? "btn-active" : ""}" icon="${this.icon}" /></button>`
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
    this.updateButtonState();
  }

  sendCmd() : void {
    let cmd : string = `<auto cmd="${this.on === true ? "off" : "on"}" />`;
    rocwct.send(cmd); 
  }

  updateButtonState() {
    if(this.on === true) {
      this.icon = this.iconOn;
    } else {
      this.icon = this.iconOff;
    } 
  }
}