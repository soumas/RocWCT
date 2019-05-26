import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventState }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-throttle')
export class PowerSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.slider {
        -webkit-appearance: none;
        width: 98%;
        height: 98%;
        border-radius: 5px;   
        /*background: #d3d3d3;*/
        background: url('/images/iconset-default/Triangle-Ruler.svg');
        background-size:cover;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
      }`,
      css`.slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%; 
        /* background: #4CAF50; */
        background: url('/images/iconset-default/circle.svg');
        cursor: pointer;
      }`,
      css`.slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        background: url('/images/iconset-default/circle.svg');
        cursor: pointer;
      }`
    ]
   ;
  }

  connectedCallback() {
    super.connectedCallback();
  }
    
  render() {
    return html`
      <div class="btn-container" style="linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))">
        <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
        <div class="scale">
          <div class="marker" style="left:0%;"></div>
          <div class="marker" sytle="left:5%"></div>
          <div class="marker" sytle="left:10%"></div>
          <div class="marker" sytle="left:20%"></div>
          <div class="marker" sytle="left:25%"></div>
          <div class="marker" sytle="left:30%"></div>
          <div class="marker" sytle="left:35%"></div>
          <div class="marker" sytle="left:40%"></div>
          <div class="marker" sytle="left:45%"></div>
          <div class="marker" sytle="left:50%"></div>
          <div class="marker" sytle="left:55%"></div>
          <div class="marker" sytle="left:60%"></div>
          <div class="marker" sytle="left:65%"></div>
          <div class="marker" sytle="left:70%"></div>
          <div class="marker" sytle="left:75%"></div>
          <div class="marker" sytle="left:80%"></div>
          <div class="marker" sytle="left:85%"></div>
          <div class="marker" sytle="left:90%"></div>
          <div class="marker" sytle="left:95%"></div>
          <div class="marker" sytle="left:100%"></div>
        </div>
      </div>`;
  }

}