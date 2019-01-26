window.onload = function() {    
    if (!window.jQuery) {
        log("loading jQuery from wcp libs");
        var elem = document.createElement('script');
        elem.type = "text/javascript";
        elem.src = "/libs/jquery-3.3.1.min.js";
        elem.onload = init;
        document.head.appendChild(elem);
    } else {
        init();
    }
}

var socket;
var subscribtions = [];

function init() {
    initWebSocket();
    loadWebComponents();
}

function initWebSocket() {
    socket = new WebSocket("ws://localhost:8053");
    socket.onopen = function() {
        log("websocket connection is open");                 
    };    
    socket.onmessage = function (evt) { 
        log("Message: " + evt.data);
        var data = JSON.parse(evt.data);
        //log("Received Message: " + JSON.stringify(data, null, 2)); 
        $.each(subscribtions, function(k, subscribtion) {
            if(data.hasOwnProperty(subscribtion.event)) {
                if(!subscribtion.id || subscribtion.id == data[subscribtion.event].id) {
                    subscribtion.component.onSocketMessage(data);
                }
            }
        });
    };
    socket.onclose = function() {
        log("websocket connection is closed");
    };
}

function loadWebComponents() {
    // fetch list of all existing web components
    $.getJSON( "dynamic-rocrail-wcp-components.json", function( data ) {
        $.each( data, function( key, val ) {    
            log("loading web component file '" + val + "'");
            var js = document.createElement('script');
            js.type = "module"; 
            js.src = "components/"+val;
            document.head.appendChild(js);
        });
    });
}

export function log(msg) {
    console.log("rocrail-wcp: " + msg);
}

export function subscribe(component, event, id) {
    var subscribtion = {};
    subscribtion.component = component;
    subscribtion.event = event;
    subscribtion.id = id;
    subscribtions.push(subscribtion);
    
    if(component.onSubscribed) {
        component.onSubscribed();
    }

}

export function unsubscribe(component) {
    $.each(subscribtions, function(k,v) {
        // TODO
    });
}

export async function send(message) {
    // wait till socket is ready
    while(socket == null || socket.readyState !==  socket.OPEN) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // send message
    socket.send(message);
}
