import { ServerEventSubscription, EServerEvent, LoggingLevel } from './base/rocwct-lib'

window.onload = function() {
    init();
}

var socket : WebSocket;
var subscribtions : Array<ServerEventSubscription> = [];
var loggingLevel : LoggingLevel = new URL(document.URL).searchParams.get("logging-level") != null ? LoggingLevel[new URL(document.URL).searchParams.get("logging-level")] : LoggingLevel["info"];

function init() {
    initWebSocket();
}

function initWebSocket() {

    let socketPort = new URL(document.URL).searchParams.get("port");
    if(!socketPort) {
        socketPort = "8053";
    }

    let socketUrl = "ws://"+ location.hostname + ":"+socketPort;
    socket = new WebSocket(socketUrl);
    socket.onopen = function() {
        info("WebSocket is open and connected to RocWCT Server @ " + socketUrl);
    };
    socket.onmessage = function (evt) {
        
        var data = JSON.parse(evt.data);
        if(data.hasOwnProperty("type") && data.type === "RocWctClientNotification") {
            log(data.loggingLevel, data.msg);
        } else {
            trace("<<<< IN: ");
            trace(evt.data);
            subscribtions.forEach(subscribtion => {
                let eventName : String = EServerEvent[subscribtion.event];
                if(data.hasOwnProperty(eventName)) {
                    if(!subscribtion.id || subscribtion.id === eval('data[eventName]').id) {
                        subscribtion.onServerEvent(data, subscribtion.event);
                    }
                }
            }); 
        }
    }; 
    socket.onclose = function() {
        info("WebSocket to RocWCT Server is closed... try to reconnect");
        initWebSocket()
    };
}

export function unsubscribe(subscribtion : ServerEventSubscription) {
    let unsubcr = subscribtion;
    subscribtions = subscribtions.filter(function(elem:ServerEventSubscription ) {
        return elem.element !== unsubcr.element 
            || elem.event !== unsubcr.event 
            || elem.id !== unsubcr.id;
    });
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
    trace(">>>> OUT: ");
    trace(message);
    socket.send(message);
}

// logging
export function log(loggingLevelStr : String, data : any) {
    switch(loggingLevelStr) {
        case LoggingLevel[LoggingLevel.trace]:
            trace(data);
            break;
        case LoggingLevel[LoggingLevel.debug]:
            debug(data);
            break;
        case LoggingLevel[LoggingLevel.info]:
            info(data);
            break;
        case LoggingLevel[LoggingLevel.warn]:
            warn(data);
            break;
        case LoggingLevel[LoggingLevel.error]:
            error(data);
            break;
    }
}
export function error(data : any) {    
    if(loggingLevel <= LoggingLevel.error) {
        console.error(data);
    }    
}
export function warn(data : any) {    
    if(loggingLevel <= LoggingLevel.warn) {
        console.warn(warn);
    }    
}
export function info(data : any) {    
    if(loggingLevel <= LoggingLevel.info) {
        console.info(data);
    }    
}
export function debug(data : any) {    
    if(loggingLevel <= LoggingLevel.debug) {
        console.log(data);
    }    
}
export function trace(data : any) {    
    if(loggingLevel <= LoggingLevel.trace) {
        console.log(data);
    }    
}
