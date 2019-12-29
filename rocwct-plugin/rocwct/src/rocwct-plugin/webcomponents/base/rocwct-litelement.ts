import { LitElement, html, customElement, css, property } from 'lit-element';
import { ServerEventSubscription, IServerEventCallback, EServerEvent } from './servereventsubscription';
import { RocWCT } from '../../rocwct';

export abstract class RocWctLitElement extends LitElement {

    static get stylesRocWctLitElement() {
        return [
            css`:host { display: block; width: 100%; height: 100%;font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 10px; color: #7E888A }`,
        ];
    }

    protected iconSetRoot : string = "/images/iconset-default";

    constructor() {
        super();
    }

    registerServerEvent(event : EServerEvent, serverEventHandler? : IServerEventCallback) : ServerEventSubscription{
        let evnt : ServerEventSubscription = new ServerEventSubscription();
        evnt.element = this;
        evnt.event = event;
        evnt.onServerEvent = serverEventHandler;
        RocWCT.router.subscribe(evnt);
        return evnt;
      }

      unregisterServerEvent(event: ServerEventSubscription) : void {
        RocWCT.router.unsubscribe(event);
      }
}