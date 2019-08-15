import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc, EVMode, RocWctLocoDependentElement } from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-throttle')
export class LocoThrottle extends RocWctLocoDependentElement {

  static get styles() {
    return [
      RocWctLocoDependentElement.stylesRocWctLocoDependentElement,
      css`input[type="button"] { cursor:pointer; width:100%; height: 100%; border: none; text-align: center; }`,
      css`input[type="button"].on { background-color: #FCAE01;}`,
      css`	
      .slider {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 97%; 
		    height: 6px;
        background: linear-gradient(to right, #FCAE01,  #ce2029); 
        outline: none;   
        margin-bottom:20px;
        margin-top: 20px;
      }
      
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none; 
        appearance: none;
        width: 20px; 
        height: 35px; 
        background: #FCAE01; 
        cursor: pointer; 
        border-radius: 15%;
      }
      
      .slider::-moz-range-thumb {
        width: 20px; 
        height: 35px; 
        background: #FCAE01; 
        cursor: pointer;  
        border-radius: 15%; 
      }      

      .control-box {
        width: 20%;
        float:left;
        height:35px;
      }`
    ]
      ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = null;  
  @property({ type: Number }) sliderMax = null;
  @property({ type: Number }) vCurrent = null;
  @property({ type: EVMode }) vMode = null;
  @property({ type: Number }) vMin = null;
  @property({ type: Number }) vMid = null;
  @property({ type: Number }) vCru = null;
  @property({ type: Number }) vMax = null;
  cfgVMin : number = null;
  cfgVMid : number = null;
  cfgVCru : number = null;
  cfgVMax : number = null;
  cfgVRMin : number = null;
  cfgVRMid : number = null;
  cfgVRCru : number = null;
  cfgVRMax : number = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.lc, res => this.handleLocoEvent(res, e => this.onServerEventLc(e)));
  }
  
  sendInitCommand() {    
    rocwct.send(`<model cmd="lcprops" />`); 
  }  

  render() {
    return html`${this.vCurrent != null
      ? html`		
        <input type="range" min="0" step="1" max="${this.sliderMax}" .value="${this.vCurrent}" @change="${(e) => this.sendCommnd(e.target.value)}" class="slider" > 			  
        <div class="control-container">
          <div class="control-box">
            <input @click="${() => this.sendCommnd(0)}" class="${this.vCurrent <= 0 ? 'on' : ''}" title="Stop" type="button" style="-webkit-mask: url(/images/iconset-default/stop.svg) no-repeat center; mask: url(/images/iconset-default/stop.svg) no-repeat center;" />            
          </div>	
          <div class="control-box">
            <input @click="${() => this.sendCommnd(this.vMin)}" class="${this.vCurrent > 0 && this.vCurrent <= this.vMin ? 'on' : ''}" title="Vmin" type="button" style="-webkit-mask: url(/images/iconset-default/gauge_0.svg) no-repeat center; mask: url(/images/iconset-default/gauge_0.svg) no-repeat center;" />
          </div>							  
          <div class="control-box">
            <input @click="${() => this.sendCommnd(this.vMid)}" class="${this.vCurrent > this.vMin && this.vCurrent < this.vCru ? 'on' : ''}" title="Vmid" type="button" style="-webkit-mask: url(/images/iconset-default/gauge_1.svg) no-repeat center; mask: url(/images/iconset-default/gauge_1.svg) no-repeat center;" />
          </div>					  
          <div class="control-box">
            <input @click="${() => this.sendCommnd(this.vCru)}" class="${this.vCurrent >= this.vCru && this.vCurrent < this.vMax ? 'on' : ''}" title="Vcruise" type="button" style="-webkit-mask: url(/images/iconset-default/gauge_2.svg) no-repeat center; mask: url(/images/iconset-default/gauge_2.svg) no-repeat center;" />
          </div>					  
          <div class="control-box">
            <input @click="${() => this.sendCommnd(this.vMax)}" class="${this.vCurrent >= this.vMax ? 'on' : ''}" title="Vmax" type="button" style="-webkit-mask: url(/images/iconset-default/gauge_3.svg) no-repeat center; mask: url(/images/iconset-default/gauge_3.svg) no-repeat center;" />
          </div>
        </div>`
        : html``
      }`;
  }

  sendCommnd(speed: number) {
    rocwct.send(`<lc id="${this.locoId}" V="${speed}" controlcode="" slavecode="" />`);    
  }

  protected onLocoIdChange(): void {
    this.sendInitCommand();
  }
  
  onServerEventLc(event:RocrailEventLc) {    

    if(event.lc.id !== this.locoId) {
      return;
    }

    if(!isNaN(event.lc.V_min)) {
      // if event.lc.V_min is a number... use it as new cfgVMin
      this.cfgVMin = event.lc.V_min;
      this.cfgVMid = event.lc.V_mid;
      this.cfgVCru = event.lc.V_cru;
      this.cfgVMax = event.lc.V_max;
      this.cfgVRMin = (!isNaN(event.lc.V_Rmin) && event.lc.V_Rmin > 0) ? event.lc.V_Rmin : event.lc.V_min;
      this.cfgVRMid = (!isNaN(event.lc.V_Rmid) && event.lc.V_Rmid > 0) ? event.lc.V_Rmid : event.lc.V_mid;
      this.cfgVRCru = (!isNaN(event.lc.V_Rcru) && event.lc.V_Rcru > 0) ? event.lc.V_Rcru : event.lc.V_cru;
      this.cfgVRMax = (!isNaN(event.lc.V_Rmax) && event.lc.V_Rmax > 0) ? event.lc.V_Rmax : event.lc.V_max;
    }
    this.sliderMax = this.cfgVMax;
    this.vMin = event.lc.dir ? this.cfgVMin : this.cfgVRMin;
    this.vMid = event.lc.dir ? this.cfgVMid : this.cfgVRMid;
    this.vCru = event.lc.dir ? this.cfgVCru : this.cfgVRCru;
    this.vMax = event.lc.dir ? this.cfgVMax : this.cfgVRMax;    
    this.vCurrent = event.lc.V;
  }
}

