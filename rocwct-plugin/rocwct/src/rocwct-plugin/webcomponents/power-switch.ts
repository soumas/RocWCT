import { customElement, property } from 'lit-element';
import { RocWctButton, EServerEvent, RocrailEventState }  from './base/rocwct-lib';
import { RocWCT } from '../rocwct';

@customElement('power-switch')
export class PowerSwitch extends RocWctButton {

  static get styles() {
    return [ 
      RocWctButton.stylesRocWctButton
    ]
   ;
  }

  @property({ type : String, attribute : "icon" }) icon = "power.svg";
  @property({ type : String, attribute : "label" }) label = "Power";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.state, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  sendInitCommand() {    
    RocWCT.router.send('<sys cmd="getstate"/>');
  }

  onServerEvent(event : RocrailEventState) {
    this.on = event.state.power;
  }

  handleClick() {  
    RocWCT.router.send(`<sys cmd="${this.on === true ? "stop" : "go"}" />`); 
  }

}