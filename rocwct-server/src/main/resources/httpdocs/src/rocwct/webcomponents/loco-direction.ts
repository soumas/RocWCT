import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-direction')
export class LocoDirection extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles
    ]
   ;
  }

  @property({ type : Boolean })  forward = null;
  @property({ type : String })  icon = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "direction" }) direction = null;
  @property({ type : String, attribute : "icon-forward-on" }) iconForwardOn = "chevron-right-on.png";
  @property({ type : String, attribute : "icon-forward-off" }) iconForwardOff = "chevron-right-off.png";
  @property({ type : String, attribute : "icon-backward-on" }) iconBackwardOn = "chevron-left-on.png";
  @property({ type : String, attribute : "icon-backward-off" }) iconBackwardOff = "chevron-left-off.png";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEvent(res));
    // trigger server-event by sending an empty dir-command
    this.sendDirCmd();    
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.forward != null
      ? html`<button @click="${this.handleClick}" ><img src="${this.iconSetRoot}/${this.icon}" alt="direction" title="direction" /></button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendDirCmd();
  }

  sendInitCommand() {    
    // empty lc-command triggers server event with current state of loco
    rocwct.send(`<lc id="${this.locoId}"  />`); 
  }  

  onServerEvent(event:RocrailEventLc) {
    this.forward = event.lc.dir;
    this.updateButtonState();
  }

  sendDirCmd() : void {
    let dirval : string = '';
    if(this.direction === 'forward') {
      dirval = 'true';
    } else if(this.direction === 'backward') {
      dirval = 'false';
    } else {
      dirval = this.forward === true ? "false" : "true";
    }
    rocwct.send(`<lc id="${this.locoId}" dir="${dirval}" />`); 
  }

  updateButtonState() {
    if(this.direction === 'forward') {
      this.icon = (this.forward  === true) ? this.iconForwardOn : this.iconForwardOff;
    } else if(this.direction === 'backward') {
      this.icon = !(this.forward === true) ? this.iconBackwardOn : this.iconBackwardOff;
    } else {
      this.icon = (this.forward === true) ? this.iconForwardOn : this.iconBackwardOn;
    }
  }

}