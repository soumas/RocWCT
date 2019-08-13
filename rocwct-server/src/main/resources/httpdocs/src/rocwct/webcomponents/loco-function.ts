import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventFn, Lc, Fundef, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-function')
export class LocoFunction extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn { height: 75%; }`,
      css`.lbl { height: 25%; overflow:hidden; width:100%; text-align: center; }`,
    ]
   ;
  }

  defaultIcon : string = "lens.svg";
  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "loco-id" }) locoId = "";
  @property({ type : String, attribute : "show-label" }) showLabel = 'true';
  @property({ type : String, attribute : "label" }) attrLabel = null;  
  @property({ type : String, attribute : "icon" }) attrIcon = null;
  @property({ type : String, attribute : "icon-extension" }) attrIconExtension = null;
  @property({ type : String, attribute : "fn" }) fn = "";
  @property({ type : String }) iconCalculated = "";
  @property({ type : String }) labelCalculated = "";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.fn, res => this.onServerEvent(res));
    this.registerServerEvent(EServerEvent.lc, res => this.onInitialServerEvent(res));
  }
    
  render() {
    return html`${this.on != null
      ? html`<div class="btn-container">
                <div class="btn icon ${this.on === true ? "on" : "off"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.iconCalculated}) no-repeat center; mask: url(${this.iconSetRoot}/${this.iconCalculated}) no-repeat center;" @click="${this.handleClick}"></div>
                <div class="lbl label" style="display:${this.showLabel === 'true' ? 'block' : 'none'}"><span class="">${this.labelCalculated}</span></div>
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
    this.sendCmd();
  }

  sendInitCommand() {    
    rocwct.send(`<model cmd="lcprops" />`); 
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
      if(this.attrIcon !== null) {
        this.iconCalculated = this.attrIcon;
      } else if(fundefElem !== null && fundefElem.icon && fundefElem.icon.length > 0) {
        this.iconCalculated = fundefElem.icon;
        if(this.attrIconExtension !== null) {
          this.iconCalculated = this.iconCalculated + this.attrIconExtension;
        }
      } else {
        this.iconCalculated = this.defaultIcon;
      }

      // set text
      if(this.attrLabel !== null) {
        this.labelCalculated = this.attrLabel      
      } else if(fundefElem !== null && fundefElem.text && fundefElem.text.trim().length>0) {
        this.labelCalculated = fundefElem.text;
      } else {
        this.labelCalculated = this.fn.toUpperCase();
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