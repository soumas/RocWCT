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
  @property({ type : String })  on = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "direction" }) direction = null;
  @property({ type : String, attribute : "icon-forward" }) iconForward = "chevron-right.svg";
  @property({ type : String, attribute : "icon-backward" }) iconBackward = "chevron-left.svg";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.forward != null
      ? html`<div class="btn-container">
                <div class="btn icon ${this.on === true ? "on" : "off"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
            </div>`
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
      this.icon = this.iconForward;
      this.on = this.forward === true;
    } else if(this.direction === 'backward') {
      this.icon = this.iconBackward;
      this.on = this.forward === false;
    } else {
      this.icon = (this.forward === true) ? this.iconForward : this.iconBackward;
      this.on = true;
    }
  }

}