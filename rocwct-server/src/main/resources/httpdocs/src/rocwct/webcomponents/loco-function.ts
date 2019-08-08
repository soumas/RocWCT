import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventFn, Lc, Fundef, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-function')
export class LocoFunction extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn { height: 75%; }`,
      css`.lbl { height: 25%; overflow:hidden; width:100%; text-align: center; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 10px; font-color:#7E888A; }`,
    ]
   ;
  }

  @property({ type : Boolean })  on = null;
  @property({ type : String, attribute : "text" }) text = null;  
  @property({ type : String, attribute : "icon" }) icon = "lens.svg";
  @property({ type : String, attribute : "loco-id" }) locoId = "";
  @property({ type : String, attribute : "fn" }) fn = "";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.fn, this.locoId, res => this.onServerEvent(res));
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onInitialServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<div class="btn-container">
                <div class="btn icon ${this.on === true ? "on" : "off"}" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
                <div class="lbl"><span>${this.text}</span></div>
            </div>`
      : html``
    }`;
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
      if(loco.id === this.locoId) {
        // on/off state
        let funcOn : boolean = false;
        let myPos : number =  this.extractFunctionNumber();if(myPos === 0) {
            funcOn = loco.fn;
          } else {
            let binRep : string = (loco.fx >>> 0).toString(2);
            if(myPos <= binRep.length) {
              funcOn = binRep.substr(binRep.length-myPos, 1) === "1";
            }
        } 
        this.on = funcOn;

        // text & icon (fundef)
        if(loco.fundef) {
          // select the fundef-element for current function
          // the fundef node may be an instance of Fundef or an 
          // array (if multiple definitions are available)
          let fundefElem : Fundef = null;
          if(Array.isArray(loco.fundef)) {
            loco.fundef.forEach(fndf => {
              if(fndf.fn === this.extractFunctionNumber()) {
                fundefElem = fndf;
              }
            });
          } else {
            fundefElem = (loco.fundef);
          }

          if(fundefElem != null) {
            if(fundefElem.text && fundefElem.text.trim().length>0) {
              this.text = fundefElem.text;
            }
            if(fundefElem.icon && fundefElem.icon.length>0) {
              this.icon = fundefElem.icon;
            }
          }

          if(!this.text || this.text.trim().length===0) {
            this.text = this.fn.toUpperCase();
          }
        };
      }
  }

  onServerEvent(event : RocrailEventFn) {
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