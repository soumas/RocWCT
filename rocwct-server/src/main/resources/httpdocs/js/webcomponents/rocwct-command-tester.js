"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rwcp = require("../rocwct");
const lit_html_1 = require("../../js/libs/node_modules/lit-html/lit-html");
(function () {
    const rcp_event = "state";
    const template = () => lit_html_1.html `
	<textarea class="rwc-control command-tester" placeholder="z.B.: <sys cmd=&ldquo;go&ldquo; />"></textarea><br/>
	<button>Send</button>
	`;
    var data;
    class RwcpCommandTester extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            lit_html_1.render(template(), this);
            this.querySelector('button').onclick = () => {
                rwcp.send(this.querySelector('textarea').value);
            };
        }
    }
    customElements.define("rocwct-command-tester", RwcpCommandTester);
}());
//# sourceMappingURL=rocwct-command-tester.js.map