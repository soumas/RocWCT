import { customElement, property, html } from 'lit-element';
import { RocWctLocoDependentButton, EServerEvent, RocrailEventLc }  from '../base/rocwct-lib';
import * as rocwct from '../rocwct';

@customElement('loco-stop')
export class LocoStop extends RocWctLocoDependentButton {

  static get styles() {
    return [ 
      RocWctLocoDependentButton.stylesRocWctLocoDependentButton
    ]
   ;
  }

  @property({ type : String, attribute : "icon" }) icon = "stop.svg";
  @property({ type : String, attribute : "label" }) label = "Stop";
  @property({ type : String, attribute : "loco-id" }) locoId = null;

  connectedCallback() {
    super.connectedCallback();
    this.on = true;
    this.registerServerEvent(EServerEvent.lc, res => this.handleLocoEvent(res, e => this.onServerEvent(e)));
  }

  onServerEvent(e : RocrailEventLc): void {    
    super.disabled = e.lc.V === 0;
  }
    
  handleClick() {  
    rocwct.send(`<lc id="${this.locoId}" V="0" controlcode="" slavecode="" />`);    
  }

  render() {
    return super.render();
  }

  protected onLocoIdChange(): void {
    // trigger empty lc command results in statusinf for specific loco
    rocwct.send(`<lc id="${this.locoId}"  />`);
  }

}