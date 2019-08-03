import { html, customElement, css, property } from 'lit-element';
import '@polymer/paper-slider/paper-slider.js';
import { RocWctLitElement, EServerEvent, RocrailEventState }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-throttle')
export class PowerSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`emoji-slider {
        --emoji-slider-bar-color: #7E888A;
        --emoji-slider-bar-active-color: #FCAE01;
      }`
    ]
   ;
  }

  @property({ type : Number })  val = 0;

  connectedCallback() {
    super.connectedCallback();
  }
    
  render() {
    return html`
    <div>val: ${this.val}</div>
      <div class="btn-container" style="linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))">
        <paper-slider
          value="${this.val}"
          max="25"
          secondary-progress="200"
          editable>
        </paper-slider>
      </div>`;
  }

  change(event : any) {
    alert(event.detail.value);
  }
}