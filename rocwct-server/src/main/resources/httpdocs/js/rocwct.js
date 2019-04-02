"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
window.onload = function () {
    init();
};
var socket;
var subscribtions = [];
function init() {
    initWebSocket();
    loadWebComponents();
}
function initWebSocket() {
    socket = new WebSocket("ws://localhost:8053");
    socket.onopen = function () {
        log("websocket connection is open");
    };
    socket.onmessage = function (evt) {
        log("Message: " + evt.data);
        var data = JSON.parse(evt.data);
        subscribtions.forEach(subscribtion => {
            if (data.hasOwnProperty(subscribtion.event)) {
                if (!subscribtion.id || subscribtion.id == data[subscribtion.event].id) {
                    subscribtion.component.onSocketMessage(data);
                }
            }
        });
    };
    socket.onclose = function () {
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
function log(msg) {
    console.log("rocwct.js: " + msg);
}
exports.log = log;
function subscribe(component, event, id) {
    var subscribtion = {};
    subscribtion.component = component;
    subscribtion.event = event;
    subscribtion.id = id;
    subscribtions.push(subscribtion);
    if (component.onSubscribed) {
        component.onSubscribed();
    }
}
exports.subscribe = subscribe;
function unsubscribe(component) {
    subscribtions.forEach(itm => {
        // TODO
    });
}
exports.unsubscribe = unsubscribe;
function send(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // wait till socket is ready
        while (socket == null || socket.readyState !== socket.OPEN) {
            yield new Promise(resolve => setTimeout(resolve, 100));
        }
        // send message
        socket.send(message);
    });
}
exports.send = send;
//# sourceMappingURL=rocwct.js.map