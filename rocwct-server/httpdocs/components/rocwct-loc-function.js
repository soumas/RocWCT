import * as rwcp from '../rocwct.js';
import {html, render} from '../libs/node_modules/lit-html/lit-html.js';

(function() {

	const rcp_event = "fn";
	const template = (data) => html`
	<button class="rwc-control rwc-button loc-function ${data.stateclass}">
		<div class="icon">
			<i class="material-icons">${data.icon}</i>
		</div>
		<div class="label">
			${data.label}
		</div>
	</button>
	`;

	class RwcpButtonLocFunction extends HTMLElement {
	
		constructor() {
			super();	
		}
		
		connectedCallback() {
			
			this.fn = this.getAttribute("fn");
			this.locID = this.getAttribute("loc-id");
			this.icon = (this.getAttribute("icon")) ?  this.getAttribute("icon") : "call_to_action";
			this.label = (this.getAttribute("label")) ?  this.getAttribute("label") : this.fn.toUpperCase();

			if(!this.fn || !this.locID) {
				this.innerHTML=`<div style="color:red;font-family:courier;"><b>MISSING ATTRIBUTE for rocwct-loc-function!</b><br/>Attributs fn and loc-id are required for the component!</div>`;
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
			var toggle = (this.isActive === true) ? "false" : "true";
			rwcp.send("<fn id=\""+this.locID+"\" "+this.fn+"=\""+toggle+"\"/>");
		}

		onSubscribed() {
			rwcp.send("<model cmd=\"getini\" controlcode=\"\" slavecode=\"\"/>");
		}
		
		onSocketMessage(msg) {
			if(!msg[rcp_event].hasOwnProperty(this.fn)) {
				return;
			}
			render(template(this.buildTemplateData(msg[rcp_event])), this);
		}

		buildTemplateData(msg) {
			this.isActive = msg[this.fn] === true;

			var templateData = {};
			templateData.stateclass = (this.isActive === true) ? "active" : "";	
			templateData.icon = this.icon;
			templateData.label = this.label;
			return templateData;
		}
	}

	customElements.define("rocwct-loc-function", RwcpButtonLocFunction);

}());