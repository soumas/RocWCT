import { customElement, property } from 'lit-element';
import { RocWctButton, EServerEvent, RocrailEventAuto }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('auto-switch')
export class AutoSwitch extends RocWctButton {

  static get styles() {
    return [ 
      RocWctButton.stylesRocWctButton,
    ];
  }

  @property({ type : String, attribute : "icon" }) icon = "auto-mode.svg";
  @property({ type : String, attribute : "label" }) label = "Auto-Mode";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.auto, res => this.onServerEvent(res));
    this.sendInitCommand();
  }

  sendInitCommand() {    
    rocwct.send('<sys cmd="getstate"/>');
  }

  onServerEvent(event : RocrailEventAuto) {
    this.on = event.auto.cmd === 'on';
  }

  handleClick() {    
    rocwct.send(`<auto cmd="${this.on === true ? "off" : "on"}" controlcode="" slavecode="" />`); 
  }

}