import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc, RocrailEventAuto }  from '../base/rocwct-lib';
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
  @property({ type : Boolean, attribute : "activate-global-auto" }) activateGlobalAuto = false;
  @property({ type : Boolean, attribute : "start-stop-loco" }) startStopLoco = false;
  @property({ type : String })  icon = "auto-mode.svg";
  @property({ type : Boolean })  locoIsManual = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.onServerEventLoco(res));
    this.registerServerEvent(EServerEvent.auto, res => this.onServerEventAuto(res));
  }
    
  render() {
    return html`${this.locoIsManual != null
      ? html`<div class="btn-container">
                <div class="btn icon ${(this.locoIsManual === true) ? "off" : "on"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
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
    rocwct.send('<sys cmd="getstate"/>');  // get global state 
    rocwct.send(`<lc id="${this.locoId}"  />`);  // empty lc-command triggers server event with current state of loco
  }  

  onServerEventLoco(event:RocrailEventLc) {
    if(event.lc.id !== this.locoId) {
      return;
    }
    this.locoIsManual = event.lc.manual;
  }

  onServerEventAuto(event:RocrailEventAuto) {
    // if global auto mode gos to 'off' and attrStartStopLoco is true, the loco auto mode should go to manual and stop
    if(event.auto.cmd !== "on" && this.startStopLoco === true) {
      rocwct.send(`<lc id="${this.locoId}" cmd="setmanualmode" controlcode="" slavecode="" />`); 
      rocwct.send(`<lc id="${this.locoId}" cmd="stop" controlcode="" slavecode="" />`); 
    }
  }

  sendDirCmd() : void {
    let doActivateAutoMode : Boolean = false;
    if(this.locoIsManual === true) {
      doActivateAutoMode = true;
    } else {
      doActivateAutoMode = false;
    }

    // activate global auto mode when loco auto will be activated (if specified by attribute)
    if(doActivateAutoMode === true && this.activateGlobalAuto === true) {
      rocwct.send(`<auto cmd="on" />`); 
    }
    // activate loco auto mode
    rocwct.send(`<lc id="${this.locoId}" cmd="${doActivateAutoMode === true ? 'resetmanualmode' : 'setmanualmode'}" controlcode="" slavecode="" />`); 

    // trigger go-/stop-command
    if(this.startStopLoco === true) {
        rocwct.send(`<lc id="${this.locoId}" cmd="${doActivateAutoMode === true ? 'go' : 'stop'}" controlcode="" slavecode="" />`); 
    }
  }

}