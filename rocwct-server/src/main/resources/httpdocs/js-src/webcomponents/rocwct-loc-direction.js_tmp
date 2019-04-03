import * as rwcp from '../rocwct.js';
import {html, render} from '../node_modules/lit-html/lit-html.js';

(function() {

	const rcp_event = "lc";
	const template = (icon) => html`
	<button class="rwc-control rwc-button loc-direction active">
		<div class="icon">
			<i class="material-icons">${icon}</i>
		</div>
	</button>
	`;
	
	var data;

	class RwcpButtonLocDirection extends HTMLElement {
	
		constructor() {
			super();					
		}

		connectedCallback() {

			this.controlcode = (this.getAttribute("controlcode")) ? this.getAttribute("controlcode") : '';
			this.slavecode = (this.getAttribute("slavecode")) ? this.getAttribute("slavecode") : '';
			this.iconRight = (this.getAttribute("icon-right")) ? this.getAttribute("icon-right") : 'fast_forward';
			this.iconLeft = (this.getAttribute("icon-left")) ? this.getAttribute("icon-left") : 'fast_rewind';
			this.locID = this.getAttribute("loc-id");

			if(!this.locID) {
				this.innerHTML=`<div style="color:red;font-family:courier;"><b>MISSING ATTRIBUTE for rocwct-loc-direction!</b><br/>Attribut loc-id is required for the component!</div>`;
				return;
			} 

			this.addEventListener('click', this.onClick);
			rwcp.subscribe(this, rcp_event, this.locID);			
		}

		disconnectedCallback() {
			this.removeEventListener('click', this.onClick);
			rwcp.unsubscribe(this);
		}

		onClick() {
			var toggle = (this.data.dir === true) ? "false" : "true";
			rwcp.send("<lc id=\""+this.locID+"\" dir=\""+toggle+"\" controlcode=\""+this.controlcode+"\" slavecode=\""+this.slavecode+"\" />");
		}

		onSubscribed() {
			// TODO
			//rwcp.send("<sys cmd=\"getstate\" />");
		}

		onSocketMessage(data) {
			this.data = data[rcp_event];
			var icon = (this.data.dir === true) ? this.iconRight : this.iconLeft;			
			render(template(icon), this);
		}

	}

	customElements.define("rocwct-loc-direction", RwcpButtonLocDirection);

}());