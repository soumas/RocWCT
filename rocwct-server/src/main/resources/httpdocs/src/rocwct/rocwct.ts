import { ServerEventSubscription, EServerEvent } from './base/rocwct-lib'

window.onload = function() {
    init();
}

var socket : WebSocket;
let subscribtions : Array<ServerEventSubscription> = [];

function init() {
    initWebSocket();
}

function initWebSocket() {

    let socketPort = new URL(document.URL).searchParams.get("port");
    if(!socketPort) {
        socketPort = "8053";
    }

    socket = new WebSocket("ws://"+ location.hostname + ":"+socketPort);
    socket.onopen = function() {
        log("websocket connection is open");
    };
    socket.onmessage = function (evt) {
        log("<<<< IN: ");
        log(evt.data);
        var data = JSON.parse(evt.data);
        subscribtions.forEach(subscribtion => {
            let eventName : String = EServerEvent[subscribtion.event];
            if(data.hasOwnProperty(eventName)) {
                if(!subscribtion.id || subscribtion.id === eval('data[eventName]').id) {
                    subscribtion.onServerEvent(data, subscribtion.event);
                }
            }
        }); 
    }; 
    socket.onclose = function() {
        log("websocket connection is closed");
    };
}

function log(msg : String) {
    console.log(msg); 
}

export function unsubscribe(component) {
    // TODO
}

export function subscribe(subscribtion : ServerEventSubscription) {
    subscribtions.push(subscribtion);
}

export async function send(message : string) {
    // wait till socket is ready
    while(socket == null || socket.readyState !==  socket.OPEN) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // send message
    log(">>>> OUT: ");
    log(message);
    socket.send(message);
}
