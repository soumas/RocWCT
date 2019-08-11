import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-auto-switch')
export class LocoAutoSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn { height: 75%; }`,
      css`.lbl { height: 25%; overflow:hidden; width:100%; text-align: center; }`,
    ]
   ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String })  icon = "auto-mode.svg";
  @property({ type : String })  manual = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.onServerEvent(res));
  }
    
  render() {
    return html`${this.manual != null
      ? html`<div class="btn-container">
                <div class="btn icon ${this.manual === true ? "off" : "on"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
            </div>`
      : html``
    }`;
  }

  updated(changedProperties : Map<string,any>) {
    if(changedProperties.has('locoId')) {
      this.sendInitCommand();
    }
  }

  handleClick() {  
    this.sendDirCmd();
  }

  sendInitCommand() {    
    // empty lc-command triggers server event with current state of loco
    rocwct.send(`<lc id="${this.locoId}"  />`); 
  }  

  onServerEvent(event:RocrailEventLc) {
    if(event.lc.id !== this.locoId) {
      return;
    }
    this.manual = event.lc.manual;
  }

  sendDirCmd() : void {
    let manualVal : string = '';
    if(this.manual === true) {
      manualVal = "resetmanualmode";
    } else {
      manualVal = "setmanualmode";
    }
    rocwct.send(`<lc id="${this.locoId}" cmd="${manualVal}" />`); 
  }

}