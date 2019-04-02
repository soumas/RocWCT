import * as rwcp from '../rocwct';
import {html, render} from '../../js/libs/node_modules/lit-html/lit-html';

(function() {

	const template = () => html`
	<textarea class="rwc-control command-tester" placeholder="z.B.: <sys cmd=&ldquo;go&ldquo; />"></textarea><br/>
	<button>Send</button>
	`;
	

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