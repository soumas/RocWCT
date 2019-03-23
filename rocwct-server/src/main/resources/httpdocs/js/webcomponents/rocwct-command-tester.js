"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rwcp = require("../rocwct.ts");
var lit_html_ts_1 = require("../node_modules/lit-html/lit-html.ts");
(function () {
    var rcp_event = "state";
    var template = function (stateclass) { return lit_html_ts_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\t<textarea class=\"rwc-control command-tester\" placeholder=\"z.B.: <sys cmd=&ldquo;go&ldquo; />\"></textarea><br/>\n\t<button>Send</button>\n\t"], ["\n\t<textarea class=\"rwc-control command-tester\" placeholder=\"z.B.: <sys cmd=&ldquo;go&ldquo; />\"></textarea><br/>\n\t<button>Send</button>\n\t"]))); };
    var data;
    var RwcpCommandTester = /** @class */ (function (_super) {
        __extends(RwcpCommandTester, _super);
        function RwcpCommandTester() {
            return _super.call(this) || this;
        }
        RwcpCommandTester.prototype.connectedCallback = function () {
            var _this = this;
            lit_html_ts_1.render(template(), this);
            this.querySelector('button').onclick = function () {
                rwcp.send(_this.querySelector('textarea').value);
            };
        };
        return RwcpCommandTester;
    }(HTMLElement));
    customElements.define("rocwct-command-tester", RwcpCommandTester);
}());
var templateObject_1;
