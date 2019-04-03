import * as rocwct from '../rocwct.js';
import { html } from '../../js/libs/node_modules/lit-html/lit-html';
import { RocrailEventConstants } from '../interfaces/rocrail-events.js';
const template = document.createElement('template');
template.innerHTML = `<button><slot name="lbl">default</slot></button>`;
export class LocDirection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.controlcode = (this.getAttribute("controlcode")) ? this.getAttribute("controlcode") : '';
        this.slavecode = (this.getAttribute("slavecode")) ? this.getAttribute("slavecode") : '';
        this.iconRight = (this.getAttribute("icon-right")) ? this.getAttribute("icon-right") : 'fast_forward';
        this.iconLeft = (this.getAttribute("icon-left")) ? this.getAttribute("icon-left") : 'fast_rewind';
        this.locID = this.getAttribute("loc-id");
        if (!this.locID) {
            this.innerHTML = `<div style="color:red;font-family:courier;"><b>MISSING ATTRIBUTE for loc-direction!</b><br/>Attribut loc-id is required for the component!</div>`;
            return;
        }
        this.addEventListener('click', this.onClick);
        rocwct.subscribe(this, RocrailEventConstants.LC_EVENTID, this.locID);
        rocwct.subscribe(this, RocrailEventConstants.PLAN_EVENTID);
    }
    disconnectedCallback() {
        this.removeEventListener('click', this.onClick);
        rocwct.unsubscribe(this);
    }
    onClick() {
        var toggle = (this.data.dir === true) ? "false" : "true";
        rocwct.send("<lc id=\"" + this.locID + "\" dir=\"" + toggle + "\" controlcode=\"" + this.controlcode + "\" slavecode=\"" + this.slavecode + "\" />");
    }
    onSubscribed() {
        rocwct.send("<model cmd=\"plan\" />");
    }
    onSocketMessage(event, msg) {
        if (event === RocrailEventConstants.LC_EVENTID) {
            this.data = msg.lc;
        }
        else if (event === RocrailEventConstants.PLAN_EVENTID) {
            msg.plan.lclist.lc.forEach((loc) => {
                if (loc.id === this.locID) {
                    this.data = loc;
                }
            });
        }
        var icon = (this.data.dir === true) ? this.iconRight : this.iconLeft;
        //render(LocDirection.template(icon), this);
    }
}
LocDirection.cn = 'rocwct-loc-direction';
LocDirection.template = (icon) => html `
    <style>
        button {
            background-color: yellow;
        }
    </style>
    <button class="rwc-control rwc-button loc-direction active">
    <slot name="lbl"></slot>
        <div class="icon">        
			<i class="material-icons">${icon}</i>
		</div>
	</button>
    `;
customElements.define(LocDirection.cn, LocDirection);
//# sourceMappingURL=loc-direction.js.map