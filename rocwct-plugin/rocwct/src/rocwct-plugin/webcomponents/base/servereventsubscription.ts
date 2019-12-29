import { RocWctLitElement } from "./rocwct-litelement";

export class ServerEventSubscription {
    element : RocWctLitElement;
    event : EServerEvent;
    id? : string;
    onServerEvent : IServerEventCallback;
}

export enum EServerEvent {
    plan, lc, auto, clock, fn, state, lclist
}

export interface IServerEventCallback  {
    (data : any, event? : EServerEvent) : void;
}
