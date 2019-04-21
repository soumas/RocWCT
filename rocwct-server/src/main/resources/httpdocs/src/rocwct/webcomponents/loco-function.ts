import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventFn, RocrailEventPlan, Fundef }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-function')
export class LocoFunction extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn-on::after { content: " ON"; } `,
      css`.btn-off::after { content: "OFF "; } `
    ]
   ;
  }

  @property({ type : Boolean })  on = null;
  @property({ type : String })  icon = null;
  @property({ type : String })  text = null;
  @property({ type : String, attribute : "loco-id" }) locoId = "";
  @property({ type : String, attribute : "fn" }) fn = "";

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.fn, this.locoId, res => this.onServerEvent(res));
    this.registerServerEvent(EServerEvent.plan, null, res => this.onInitialServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<button type="button" class="btn ${this.on === true ? "btn-on" : "btn-off"}" @click="${this.handleClick}">${this.fn}, ${this.text}, ${this.icon}</button>`
      : html``
    }`;
  }

  handleClick() {  
    this.sendCmd();
  }

  sendInitCommand() {    
    rocwct.send(`<model cmd="plan" />`); 
  }  

  onInitialServerEvent(event : RocrailEventPlan) {
    // the initial model plan contains the property 'fx" for each loco.
    // the value of this property represents one bit for each function.
    // https://forum.rocrail.net/viewtopic.php?f=11&t=16987&hilit=rcp
    event.plan.lclist.lc.forEach(loco => {
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
            this.text = fundefElem.text;
            this.icon = fundefElem.icon;
          }
        };
      }
    });
  }

  onServerEvent(event : RocrailEventFn) {
    if(!(event.fn as any).hasOwnProperty(this.fn)) {
      return;
    }
    this.on = eval('event.fn.'+this.fn) === true;
  }

  sendCmd() : void {
    //let cmd : string = `<fn fnchanged="${this.extractFunctionNumber()}" fnchangedstate="true" id="${this.locoId}" group="1" fncnt="4" addr="7" shift="false" f4="true" throttleid="rv12140" controlcode="" slavecode=""/>`;
    //let cmd : string = `<fn id="${this.locoId}" ${this.fn}="${this.on === true ? "false" : "true"}"  />`;
    let group : number = 1; //(this.extractFunctionNumber()-1)/4+1; TODO
    let cmd : string = `<fn controlcode="" slavecode="" id="${this.locoId}" throttleid="" fnchanged="${this.extractFunctionNumber()}" group="${group}" f${this.extractFunctionNumber()}="${this.on === true ? "false" : "true"}" />`;
    rocwct.send(cmd); 
  }

  extractFunctionNumber() : number {
    return parseInt(this.fn.substr(1));
  }
}