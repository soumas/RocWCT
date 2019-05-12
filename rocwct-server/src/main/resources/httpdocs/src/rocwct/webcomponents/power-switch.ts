import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, EServerEvent, RocrailEventState }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('power-switch')
export class PowerSwitch extends RocWctLitElement {

  static get styles() {
    return [ 
      RocWctLitElement.baseStyles,
      css`.btn-on::after { content: " ON"; } `,
      css`.btn-off::after { content: "OFF "; } `
    ]
   ;
  }

  @property({ type : Boolean })  on = null;

  connectedCallback() {
    super.connectedCallback();
    this.registerServerEvent(EServerEvent.state, null, res => this.onServerEvent(res));
    this.sendInitCommand();
  }
    
  render() {
    return html`${this.on != null
      ? html`<button class="btn ${this.on === true ? "btn-on" : "btn-off"}" @click="${this.handleClick}"></iron-icon></button>`
      : html``
    }`;
  }

  sendInitCommand() {    
    rocwct.send('<sys cmd="getstate"/>');
  }

  handleClick() {  
    this.sendCmd();
  }

  onServerEvent(event : RocrailEventState) {
    this.on = event.state.power;
  }

  sendCmd() : void {
    let cmd : string = `<sys cmd="${this.on === true ? "stop" : "go"}" />`;
    rocwct.send(cmd); 
  }

}