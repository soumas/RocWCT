window.onload = function() {
    init();
}

var socket : WebSocket;
var subscribtions = [];

function init() {
    initWebSocket();
    //loadWebComponents();
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
                    subscribtion.component.onSocketMessage(subscribtion.event, data);
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
        return response.json();
    })
    .then(data => {
        data.forEach((val: string) => {
            log("fetching web component '" + val + "'");
            var js = document.createElement('script');
            js.type = "module";
            js.src = "/js/webcomponents/"+val;
            document.head.appendChild(js);
         });
    });
}

function log(msg) {
    console.log("rocwct: " + msg); 
}

export function unsubscribe(component) {
    // TODO
}

export function subscribe(component, event : string, id? : string) {

    var subscribtion : any = {};
    subscribtion.component = component;
    subscribtion.event = event;
    subscribtion.id = id;
    subscribtions.push(subscribtion);

    if(component.onSubscribed) {
        component.onSubscribed();
    }
}

export async function send(message) {
    // wait till socket is ready
    while(socket == null || socket.readyState !==  socket.OPEN) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // send message
    socket.send(message);
}
