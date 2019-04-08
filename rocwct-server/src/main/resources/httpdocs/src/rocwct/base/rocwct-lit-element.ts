import { LitElement, html, property, customElement } from 'lit-element';
import * as rocwct from '../rocwct';
import {  ServerEventSubscription } from './server-event-subscription'

export abstract class RocWctLitElement extends LitElement {
    
    constructor() {
        super();

    }

    protected abstract serverEventSubscriptions :  Array<ServerEventSubscription>;

    private subscribeAll() {
        this.serverEventSubscriptions.forEach(s => {
            s.element = this;
            rocwct.subscribe(s);
        });
    }

    protected sendCmd(cmd : string) {
        rocwct.send(cmd);
    }
}