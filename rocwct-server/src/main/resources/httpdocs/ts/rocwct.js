"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
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
        //log("Received Message: " + JSON.stringify(data, null, 2));
        $.each(subscribtions, function (k, subscribtion) {
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
    $.getJSON("dynamic-rocrail-wcp-components.json", function (data) {
        $.each(data, function (key, val) {
            log("loading web component file '" + val + "'");
            var js = document.createElement('script');
            js.type = "module";
            js.src = "/js/webcomponents/" + val;
            document.head.appendChild(js);
        });
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
    $.each(subscribtions, function (k, v) {
        // TODO
    });
}
exports.unsubscribe = unsubscribe;
function send(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(socket == null || socket.readyState !== socket.OPEN)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2:
                    // send message
                    socket.send(message);
                    return [2 /*return*/];
            }
        });
    });
}
exports.send = send;
