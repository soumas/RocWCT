import { html, customElement, css, property } from 'lit-element';
import '@polymer/paper-slider/paper-slider.js';
import { RocWctLitElement, EServerEvent, RocrailEventLc, EVMode } from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-throttle')
export class PowerSwitch extends RocWctLitElement {

  static get styles() {
    return [
      RocWctLitElement.baseStyles,
      css`	
      .slider {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 97%; 
		    height: 6px;
        background: linear-gradient(to right, #FCAE01,  #ce2029); 
        outline: none;   
        margin-bottom:9px;
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
      
      .indikator-track {
        position: relative;
        height: 12px;
        z-index: -1;
      }
      .indikator {
		    position: absolute;
        border-right:solid 1px red;
		    margin-right:-1px;
      }
      .indikator.top {
		    position: absolute;
        bottom: 0px;
      }

      .control-box {
        width: 25%;
        float:left;
        height:25px;
      }`
    ]
      ;
  }

  @property({ type : String, attribute : "loco-id" }) locoId = "";  
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
    this.registerServerEvent(EServerEvent.lc, this.locoId, res => this.onServerEventLc(res));
    this.sendInitCommand();
  }
  
  sendInitCommand() {    
    rocwct.send(`<model cmd="lcprops" />`); 
  }  

  render() {
    return html`${this.vCurrent != null
      ? html`
        <div class="indikator-track">							
          <div class="indikator top" style="height:2px;left:5%"></div>
          <div class="indikator top" style="height:2px;left:10%"></div>
          <div class="indikator top" style="height:2px;left:15%"></div>
          <div class="indikator top" style="height:3px;left:20%"></div>
          <div class="indikator top" style="height:3px;left:25%"></div>
          <div class="indikator top" style="height:3px;left:30%"></div>
          <div class="indikator top" style="height:4px;left:35%"></div>
          <div class="indikator top" style="height:4px;left:40%"></div>
          <div class="indikator top" style="height:4px;left:45%"></div>
          <div class="indikator top" style="height:5px;left:50%"></div>
          <div class="indikator top" style="height:5px;left:55%"></div>
          <div class="indikator top" style="height:6px;left:60%"></div>
          <div class="indikator top" style="height:6px;left:65%"></div>
          <div class="indikator top" style="height:7px;left:70%"></div>
          <div class="indikator top" style="height:7px;left:75%"></div>
          <div class="indikator top" style="height:8px;left:80%"></div>
          <div class="indikator top" style="height:8px;left:85%"></div>
          <div class="indikator top" style="height:9px;left:90%"></div>
          <div class="indikator top" style="height:10px;left:95%"></div>
        </div>							
        <input type="range" min="0" step="1" max="${this.sliderMax}" .value="${this.vCurrent}" @change="${(e) => this.sendCommnd(e.target.value)}" class="slider" >
        <div class="indikator-track">
          <div class="indikator" style="height:2px;left:5%"></div>
          <div class="indikator" style="height:2px;left:10%"></div>
          <div class="indikator" style="height:2px;left:15%"></div>
          <div class="indikator" style="height:3px;left:20%"></div>
          <div class="indikator" style="height:3px;left:25%"></div>
          <div class="indikator" style="height:3px;left:30%"></div>
          <div class="indikator" style="height:4px;left:35%"></div>
          <div class="indikator" style="height:4px;left:40%"></div>
          <div class="indikator" style="height:4px;left:45%"></div>
          <div class="indikator" style="height:5px;left:50%"></div>
          <div class="indikator" style="height:5px;left:55%"></div>
          <div class="indikator" style="height:6px;left:60%"></div>
          <div class="indikator" style="height:6px;left:65%"></div>
          <div class="indikator" style="height:7px;left:70%"></div>
          <div class="indikator" style="height:7px;left:75%"></div>
          <div class="indikator" style="height:8px;left:80%"></div>
          <div class="indikator" style="height:8px;left:85%"></div>
          <div class="indikator" style="height:9px;left:90%"></div>
          <div class="indikator" style="height:10px;left:95%"></div>
        </div>						  
        <div class="control-container">
          <div class="control-box">
            <div class="btn icon off" @click="${() => this.sendCommnd(this.vMin)}" style="-webkit-mask: url(/images/iconset-default/gauge_0.svg) no-repeat center; mask: url(/images/iconset-default/gauge_0.svg) no-repeat center;"></div>
          </div>							  
          <div class="control-box">
            <div class="btn icon off" @click="${() => this.sendCommnd(this.vMid)}" style="-webkit-mask: url(/images/iconset-default/gauge_1.svg) no-repeat center; mask: url(/images/iconset-default/gauge_1.svg) no-repeat center;"></div>
          </div>					  
          <div class="control-box">
            <div class="btn icon off" @click="${() => this.sendCommnd(this.vCru)}" style="-webkit-mask: url(/images/iconset-default/gauge_2.svg) no-repeat center; mask: url(/images/iconset-default/gauge_2.svg) no-repeat center;"></div>
          </div>					  
          <div class="control-box">
            <div class="btn icon off" @click="${() => this.sendCommnd(this.vMax)}" style="-webkit-mask: url(/images/iconset-default/gauge_3.svg) no-repeat center; mask: url(/images/iconset-default/gauge_3.svg) no-repeat center;"></div>
          </div>
        </div>`
        : html``
      }`;
  }

  sendCommnd(speed: number) {
    rocwct.send(`<lc id="${this.locoId}" V="${speed}" controlcode="" slavecode="" />`);    
  }
  
  onServerEventLc(event:RocrailEventLc) {    
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

