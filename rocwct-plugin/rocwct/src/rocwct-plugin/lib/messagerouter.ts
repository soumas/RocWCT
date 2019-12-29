import { RocWCT } from '../rocwct';
import { xml2js } from 'xml-js';
import { ServerEventSubscription } from '../webcomponents/base/servereventsubscription';

/**
 * this class routes messages from the rocrail 
 * server to the registered WebComponents.
 */
export class MessageRouter {

    subscribtions : Array<ServerEventSubscription> = [];

    public in(message : string) {
        // TODO
        //console.error(xml2js(message).elements[0]);
        // if(xml2js(message).elements[0].name==="clock") {
        //     console.warn("TIME START: " + new Date().toTimeString());
        //     let i = 0;
        //     for(i = 0; i<100000; i++) {
        //         xml2js(message);
        //     }
        //     console.warn("TIME STOP: " + new Date().toTimeString());
        // }
    }

    public send(message : string) {
        RocWCT.socket.send(message);
    }

    public unsubscribe(subscribtion : ServerEventSubscription) {
        let unsubcr = subscribtion;
        this.subscribtions = this.subscribtions.filter(function(elem:ServerEventSubscription ) {
            return elem.element !== unsubcr.element 
                || elem.event !== unsubcr.event 
                || elem.id !== unsubcr.id;
        });
    }
    
    public subscribe(subscribtion : ServerEventSubscription) {
        this.subscribtions.push(subscribtion);
    }    
}
