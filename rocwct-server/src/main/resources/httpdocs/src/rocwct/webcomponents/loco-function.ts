import { html, customElement, css, property } from 'lit-element';
import { RocWctLocoDependentButton, EServerEvent, RocrailEventFn, Lc, Fundef, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-function')
export class LocoFunction extends RocWctLocoDependentButton {

  static get styles() {
    return [ 
      RocWctLocoDependentButton.stylesRocWctLocoDependentButton,
    ]
   ;
  }
  
  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "loco-id" }) locoId = null;
  @property({ type : String, attribute : "label" }) label = null;  
  @property({ type : String, attribute : "icon" }) icon = null;
  @property({ type : String, attribute : "icon-extension" }) attrIconExtension = null;
  @property({ type : String, attribute : "fn" }) fn = "";
  defaultIcon : string = "lens.svg";
  hasFixedIcon : Boolean = false;
  hasfixedLabel : Boolean = false;
  
  connectedCallback() {
    super.connectedCallback();
    this.hasfixedLabel = this.label !== null && this.label.length > 0;
    this.hasFixedIcon = this.icon !== null && this.icon.length > 0;
    this.registerServerEvent(EServerEvent.fn, res => this.onServerEvent(res));
    this.registerServerEvent(EServerEvent.lc, res => this.handleLocoEvent(res, e => this.onInitialServerEvent(e)));    
  }
    
  protected onLocoIdChange(): void {
    rocwct.send(`<model cmd="lcprops" />`); 
  }
  
  handleClick() {  
    this.sendCmd();
  }

  onInitialServerEvent(event : RocrailEventLc) {
    // the value of the property 'fx' represents one bit for each function.
    // https://forum.rocrail.net/viewtopic.php?f=11&t=16987&hilit=rcp
    let loco : Lc = event.lc;

    if(loco.id !== this.locoId) {
      return;
    }

    // on/off state
    let funcOn : boolean = false;
    let myPos : number =  this.extractFunctionNumber();
    if(myPos === 0) {
        funcOn = loco.fn;
      } else {
        let binRep : string = (loco.fx >>> 0).toString(2);
        if(myPos <= binRep.length) {
          funcOn = binRep.substr(binRep.length-myPos, 1) === "1";
        }
    } 
    this.on = funcOn;

    // search for fundef-element if icon or text not specified in attributes
    let fundefElem : Fundef = null;
    if(loco.fundef) {
      // select the fundef-element for current function the fundef node may be an 
      // instance of Fundef or an array (if multiple definitions are available)
      if(Array.isArray(loco.fundef)) {
        loco.fundef.forEach(fndf => {
          if(fndf.fn === this.extractFunctionNumber()) {
            fundefElem = fndf;
          }
        });
      } else {
        fundefElem = (loco.fundef);
      }

      
      // set icon
      if(this.hasFixedIcon === false) {
        if(fundefElem !== null && fundefElem.icon && fundefElem.icon.length > 0) {
          this.icon = fundefElem.icon;
          if(this.attrIconExtension !== null) {
            this.icon = this.icon + this.attrIconExtension;
          }
        } else {
          this.icon = this.defaultIcon;
        }
      }

      // set text
      if(this.hasfixedLabel === false) { 
        if(fundefElem !== null && fundefElem.text && fundefElem.text.trim().length>0) {
          this.label = fundefElem.text;
        } else {
          this.label = this.fn.toUpperCase();
        }          
      }
    }  
  }

  onServerEvent(event : RocrailEventFn) {

    if(event.fn.id !== this.locoId) {
      return;
    }

    if(!(event.fn as any).hasOwnProperty(this.fn)) {
      return;
    }
    this.on = eval('event.fn.'+this.fn) === true;
  }

  sendCmd() : void {
    let group : number = 1; //(this.extractFunctionNumber()-1)/4+1; TODO
    let cmd : string = `<fn controlcode="" slavecode="" id="${this.locoId}" throttleid="" fnchanged="${this.extractFunctionNumber()}" group="${group}" f${this.extractFunctionNumber()}="${this.on === true ? "false" : "true"}" />`;
    rocwct.send(cmd); 
  }

  extractFunctionNumber() : number {
    return parseInt(this.fn.substr(1));
  }
}