import * as rwcp from '../rocwct.js';
import {html, render} from '../libs/node_modules/lit-html/lit-html.js';

(function() {

	const rcp_event = "state";
	const template = (stateclass) => html`
	<button class="rwc-control rwc-button loc-function ${stateclass}">
		<div class="icon">
			<i class="material-icons">power_settings_new</i>
		</div>
	</button>
	`;
	
	var data;

	class RwcpButtonPower extends HTMLElement {
	
		constructor() {
			super();					
		}

		connectedCallback() {

			this.controlcode = (this.getAttribute("controlcode")) ? this.getAttribute("controlcode") : '';
			this.slavecode = (this.getAttribute("slavecode")) ? this.getAttribute("slavecode") : '';

			this.addEventListener('click', this.onClick);
			rwcp.subscribe(this, rcp_event);			
		}

		disconnectedCallback() {
			this.removeEventListener('click', this.onClick);
			rwcp.unsubscribe(this);
		}

		onClick() {
			var toggle = (this.data.power === true) ? "stop" : "go";
			rwcp.send("<sys cmd=\""+toggle+"\" informall=\"true\" controlcode=\""+this.controlcode+"\" slavecode=\""+this.slavecode+"\" />");
		}

		onSubscribed() {
			rwcp.send("<sys cmd=\"getstate\" />");
		}

		onSocketMessage(data) {
			this.data = data[rcp_event];
			var stateclass = (this.data.power === true) ? "active" : "";			
			render(template(stateclass), this);
		}

	}

	customElements.define("rocwct-power", RwcpButtonPower);

}());