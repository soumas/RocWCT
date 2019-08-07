import { html, customElement, css, property } from 'lit-element';
import '@polymer/paper-slider/paper-slider.js';
import { RocWctLitElement, EServerEvent, RocrailEventState } from '../base/rocwct-lib';
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

  @property({ type: Number }) val = 0;

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
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
        <input type="range" min="1" max="100" value="${this.val}" @change="${this.sliderChange}" class="slider" >
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
            <div class="btn icon off" @click="${this.setValue}" value="20" style="-webkit-mask: url(/images/iconset-default/gauge_0.svg) no-repeat center; mask: url(/images/iconset-default/gauge_0.svg) no-repeat center;"></div>
          </div>							  
          <div class="control-box">
            <div class="btn icon off" @click="${this.setValue}" value="80" style="-webkit-mask: url(/images/iconset-default/gauge_1.svg) no-repeat center; mask: url(/images/iconset-default/gauge_1.svg) no-repeat center;"></div>
          </div>					  
          <div class="control-box">
            <div class="btn icon off" @click="${this.setValue}" value="80" style="-webkit-mask: url(/images/iconset-default/gauge_2.svg) no-repeat center; mask: url(/images/iconset-default/gauge_2.svg) no-repeat center;"></div>
          </div>					  
          <div class="control-box">
            <div class="btn icon off" @click="${this.setValue}" value="100" style="-webkit-mask: url(/images/iconset-default/gauge_3.svg) no-repeat center; mask: url(/images/iconset-default/gauge_3.svg) no-repeat center;"></div>
          </div>
        </div>`;
  }

  sliderChange(e: any) {
    this.val = e.target.value;
  }

  setValue(e: any) {
    alert(e.target.value);
  }
  
}