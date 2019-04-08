import { ServerEventSubscription } from './base/server-event-subscription'

window.onload = function() {
    init();
}

var socket : WebSocket;
let subscribtions : Array<ServerEventSubscription> = [];

function init() {
    initWebSocket();
}

function initWebSocket() {
    socket = new WebSocket("ws://localhost:8053");
    socket.onopen = function() {
        log("websocket connection is open");
    };
    socket.onmessage = function (evt) {
        log("Message: " + evt.data);
        var data = JSON.parse(evt.data);
        subscribtions.forEach(subscribtion => {
            if(data.hasOwnProperty(subscribtion.event)) {
                if(!subscribtion.id || subscribtion.id === data[subscribtion.event].id) {
                    subscribtion.onServerEvent(subscribtion.event, data);
                }
            }
        }); 
    }; 
    socket.onclose = function() {
        log("websocket connection is closed");
    };
}

function log(msg) {
    console.log("rocwct: " + msg); 
}

export function unsubscribe(component) {
    // TODO
}

export function subscribe(subscribtion : ServerEventSubscription) {

    subscribtions.push(subscribtion);

    if(subscribtion.onSubscribed) {
        subscribtion.onSubscribed();
    }
}

export async function send(message : string) {
    // wait till socket is ready
    while(socket == null || socket.readyState !==  socket.OPEN) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // send message
    socket.send(message);
}
