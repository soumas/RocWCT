import { html, customElement, css, property } from 'lit-element';
import { RocWctLitElement, ServerEventSubscription, EServerEvent, Lc, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-direction')
export class LocoDirection extends RocWctLitElement {

  static get styles() {
    return css`
      .forward::after { content: " >"; }
      .backward::before { content: "< "; }
    `;
  }
  
  render() {
    return html`${this.forward != null
      ? html`<button class="${this.forward === true ? "forward" : "backward"}" @click="${this.handleClick}"><slot name="btnContent">${this.locoId}</slot></button>`
      : html``
    }`;
  }

  locoId = this.getAttribute("loco-id");
  @property({ type : Boolean })  forward = null;

  constructor() {
    super();
    this.registerServerEvent();    
    this.sendChangeDirCmd();
  }

  registerServerEvent() {
    let lcEvent : ServerEventSubscription = new ServerEventSubscription();
    lcEvent.element = this;
    lcEvent.event = EServerEvent.lc;
    lcEvent.id = this.locoId;
    lcEvent.onServerEvent = (event : RocrailEventLc) => {
      this.forward = event.lc.dir;
    };
    rocwct.subscribe(lcEvent);
  }

  private sendChangeDirCmd() : void {
    let dirTerm = '';
    if(this.forward != null) {
      dirTerm = `dir="${this.forward === true ? "false" : "true"}"`;
    }
    rocwct.send(`<lc id="${this.locoId}" ${dirTerm}  />`); 
  }

  private handleClick() {  
    this.sendChangeDirCmd();
  }
}