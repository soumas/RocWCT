import { RocWctLitElement } from './rocwct-lit-element'

export class ServerEventSubscription {
    element : RocWctLitElement;
    event : EServerEvent;
    id? : string;
    onSubscribed? : ISubscribedCallback;
    onServerEvent : IServerEventCallback;
}

export interface ISubscribedCallback  {
    () : void;
}

export interface IServerEventCallback  {
    (event : EServerEvent, data : any) : void;
}

export enum EServerEvent {
    plan, lc, auto, clock
}