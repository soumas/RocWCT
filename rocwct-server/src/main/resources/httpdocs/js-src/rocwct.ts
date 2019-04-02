window.onload = function() {
    init();
}

var socket : WebSocket;
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
        subscribtions.forEach(subscribtion => {
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
    fetch('dynamic-rocrail-wcp-components.json')
    .then(response => {
        return response.json;
    })
    .then(data => {
        log('sfsfsfsfsf');
        log(data);
        //data.forEach(val => {
        //    log("loading web component file '" + val + "'");
        //    var js = document.createElement('script');
        //    js.type = "module";
        //    js.src = "/js/webcomponents/"+val;
        //    document.head.appendChild(js);
        // });
    });
}

export function log(msg) {
    console.log("rocwct.js: " + msg); 
}

export function subscribe(component, event, id) {
    var subscribtion : any = {};
    subscribtion.component = component;
    subscribtion.event = event;
    subscribtion.id = id;
    subscribtions.push(subscribtion);

    if(component.onSubscribed) {
        component.onSubscribed();
    }

}

export function unsubscribe(component) {
    subscribtions.forEach(itm => {
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
