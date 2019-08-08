import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-stop')
export class LocoStop extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles
    ]
   ;
  }

  @property({ type : String, attribute : "icon" }) icon = "stop_arrow.svg";
  @property({ type : String, attribute : "loco-id" }) locoId = null;

  connectedCallback() {
    super.connectedCallback();
  }
    
  render() {
    return html`<div class="btn-container">
                <div class="btn icon off" style="-webkit-mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center; mask: url(${this.iconSetRoot}/${this.icon}) no-repeat center;" @click="${this.handleClick}"></div>
            </div>`;
  }

  handleClick() {  
    this.sendCommnd();
  }

  sendCommnd() {
    rocwct.send(`<lc id="${this.locoId}" V="0" controlcode="" slavecode="" />`);    
  }

}