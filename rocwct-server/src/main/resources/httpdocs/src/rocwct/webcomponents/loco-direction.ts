import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc, RocWctLocoDependentButton }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-direction')
export class LocoDirection extends RocWctLocoDependentButton {

  static get styles() {
    return [ 
      RocWctLocoDependentButton.stylesRocWctLocoDependentButton,
    ]
   ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "direction" }) direction = null;
  @property({ type : String, attribute : "icon-forward" }) iconForward = "chevron-right.svg";
  @property({ type : String, attribute : "icon-backward" }) iconBackward = "chevron-left.svg";
  @property({ type : String, attribute : "label-forward" }) labelForward = "Vorwärts";
  @property({ type : String, attribute : "label-backward" }) labelBackward = "Rückwärts";
  @property({ type : Boolean })  forward = null;
  @property({ type : String })  icon = null;
  @property({ type : String })  label = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res =>  this.handleLocoEvent(res, e => this.onServerEvent(e)));
  }    

  onLocoIdChange(): void {
    this.sendInitCommand();
  }

  handleClick() {  
    this.sendDirCmd();
  }

  sendInitCommand() {    
    // trigger empty lc command results in statusinf for specific loco
    rocwct.send(`<lc id="${this.locoId}"  />`);
  }  

  onServerEvent(event:RocrailEventLc) {
    this.forward = event.lc.dir;
    this.updateButtonState();
  }

  updateButtonState() {
    if(this.direction === 'forward') {
      this.on = this.forward === true;
      this.icon = this.iconForward;
      this.label = this.labelForward;
    } else if(this.direction === 'backward') {
      this.on = this.forward === false;
      this.icon = this.iconBackward;
      this.label = this.labelBackward;
    } else {
      this.on = true;
      this.icon = (this.forward === true) ? this.iconForward : this.iconBackward;
      this.label = (this.forward === true) ? this.labelForward : this.labelBackward;
    }
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

}