import * as rwcp from '../rocwct.js';
import {html, render} from '../libs/node_modules/lit-html/lit-html.js';

(function() {

	const rcp_event = "lc";
	const template = (value) => html`
	<input id="slider" class="rwc-control loc-throttle" type="range" min="0" max="100"  value="${value}" />
	`;

	class RwcpLocThrottle extends HTMLElement {
	
		constructor() {
			super();	
		}
		
		connectedCallback() {
			
			this.controlcode = (this.getAttribute("controlcode")) ? this.getAttribute("controlcode") : '';
			this.slavecode = (this.getAttribute("slavecode")) ? this.getAttribute("slavecode") : '';
			this.locID = this.getAttribute("loc-id");

			if(!this.locID) {
				this.innerHTML=`<div style="color:red;font-family:courier;"><b>MISSING ATTRIBUTE for rwcp-button-loc-throttle!</b><br/>Attribut loc-id is required for the component!</div>`;
				return;
			} 
			
			rwcp.subscribe(this, rcp_event, this.locID);						
			render(template(0), this);

			this.querySelector('#slider').onchange = () => {
				rwcp.send("<lc id=\""+this.locID+"\" V=\""+this.querySelector('#slider').value+"\" controlcode=\""+this.controlcode+"\" slavecode=\""+this.slavecode+"\" />");
			}  

		}

		disconnectedCallback() {
			rwcp.unsubscribe(this);
		}

		onSubscribed() {
			// TODO
			//rwcp.send("<model cmd=\"getini\" controlcode=\"\" slavecode=\"\"/>");
		}
		
		onSocketMessage(msg) {
			this.querySelector('#slider').value = msg[rcp_event].V;						
		}

	}

	customElements.define("rocwct-loc-throttle", RwcpLocThrottle);

}());