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
  @property({ type : Boolean })  btnActive = null;
  @property({ type : String })  icon = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "direction" }) direction = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEvent(res));
    // trigger server-event by sending an empty dir-command
    this.sendDirCmd();    
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.forward != null
      ? html`<button><iron-icon class="btn ${this.btnActive === true ? "btn-active" : ""}" @click="${this.handleClick}" icon="${this.icon}" /></button>`
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
      this.btnActive = this.forward === true;
      this.icon = "chevron-right";
    } else if(this.direction === 'backward') {
      this.btnActive = this.forward === false;
      this.icon = "chevron-left";
    } else {
      this.btnActive = true;
      this.icon = (this.forward === true) ? "chevron-right" : "chevron-left";
    }
  }

}