var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, customElement } from 'lit-element';
let LocoFunction = class LocoFunction extends LitElement {
    constructor() {
        super(...arguments);
        this.name = 'World';
    }
    render() {
        return html `<p>Hello, ${this.name}!</p>`;
    }
};
__decorate([
    property()
], LocoFunction.prototype, "name", void 0);
LocoFunction = __decorate([
    customElement('simple-greeting')
], LocoFunction);
export { LocoFunction };
