import * as rwcp from '../rocwct.js';
import {html, render} from '../node_modules/lit-html/lit-html.js';

(function() {

	const rcp_event = "state";
	const template = (stateclass) => html`
	<textarea class="rwc-control command-tester" placeholder="z.B.: <sys cmd=&ldquo;go&ldquo; />"></textarea><br/>
	<button>Send</button>
	`;
	
	var data;

	class RwcpCommandTester extends HTMLElement {
	
		constructor() {
			super();					
		}

		connectedCallback() {		
			render(template(), this);

			this.querySelector('button').onclick = () => {
				rwcp.send(this.querySelector('textarea').value);
			}            
		}
	}

	customElements.define("rocwct-command-tester", RwcpCommandTester);

}());