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
  @property({ type : String })  icon = null;
  @property({ type : String, attribute : "icon-on" }) iconOn = "power-on.png";
  @property({ type : String, attribute : "icon-off" }) iconOff = "power-off.png";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.state, null, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<button @click="${this.handleClick}" ><img src="${this.iconSetRoot}/${this.icon}" alt="power" title="power" /></button>`
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
    this.updateButtonState();
  }

  sendCmd() : void {
    let cmd : string = `<sys cmd="${this.on === true ? "stop" : "go"}" />`;
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