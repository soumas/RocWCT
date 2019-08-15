import { html, customElement, css, property } from 'lit-element';
import { EServerEvent, RocrailEventLc, RocrailEventAuto, RocWctLocoDependentButton }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-auto-switch')
export class LocoAutoSwitch extends RocWctLocoDependentButton {

  static get styles() {
    return [ 
      RocWctLocoDependentButton.stylesRocWctLocoDependentButton
    ]
   ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String })  icon = "play.svg";
  @property({ type : String })  label = "Lok-Auto";
  @property({ type : Boolean, attribute : "activate-global-auto" }) activateGlobalAuto = false;
  @property({ type : Boolean, attribute : "start-stop-loco" }) startStopLoco = false;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.handleLocoEvent(res, e => this.onServerEventLoco(e)));
    this.registerServerEvent(EServerEvent.auto, res => this.onServerEventAuto(res));
  }

  handleClick() {  
    this.sendDirCmd();
  }

  protected onLocoIdChange(): void {
    this.sendInitCommand();
  }

  sendInitCommand() {        
    rocwct.send('<sys cmd="getstate"/>');  // get global state 
    rocwct.send(`<lc id="${this.locoId}"  />`);  // empty lc-command triggers server event with current state of loco
  }  

  onServerEventLoco(event:RocrailEventLc) {
    this.on = !event.lc.manual;
  }

  onServerEventAuto(event:RocrailEventAuto) {
    // if global auto mode goes to 'off' and attrStartStopLoco is true, the loco auto mode should go to manual and stop
    if(event.auto.cmd !== "on" && this.startStopLoco === true) {
      rocwct.send(`<lc id="${this.locoId}" cmd="setmanualmode" controlcode="" slavecode="" />`); 
      rocwct.send(`<lc id="${this.locoId}" cmd="stop" controlcode="" slavecode="" />`); 
    }
  }

  sendDirCmd() : void {
    let doActivateAutoMode : Boolean = false;
    if(this.on === false) {
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