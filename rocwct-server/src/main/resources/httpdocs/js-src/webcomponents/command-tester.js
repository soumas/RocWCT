import * as rocwct from '../../js/rocwct.js';
import { html, render } from '../../js/libs/node_modules/lit-html/lit-html.js';
class CommandTester extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        render(CommandTester.template(), this);
        this.querySelector('button').onclick = () => {
            rocwct.send(this.querySelector('textarea').value);
        };
    }
}
CommandTester.cn = 'rocwct-command-tester';
CommandTester.template = () => html `
		<textarea class="rwc-control command-tester" placeholder="z.B.: <sys cmd=&ldquo;go&ldquo; />"></textarea><br/>
		<button>Send</button>
	`;
customElements.define(CommandTester.cn, CommandTester);
//# sourceMappingURL=command-tester.js.map