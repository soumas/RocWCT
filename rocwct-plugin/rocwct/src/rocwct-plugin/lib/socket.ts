import { RocWCT } from '../rocwct';

export class Socket {

    private socket: WebSocket;

    public init() {
        this.initSocket();
    }

    private initSocket() {

        RocWCT.logger.info("initializing websocket...");
        
        this.socket = new WebSocket(this.buildWsUrl(),"rcp");
        this.socket.onopen = (e) => { this.handleOpen(e); };
        this.socket.onmessage = (e) => { this.handleMessage(e); };
        this.socket.onerror = (e) => { this.handleError(e); };
        this.socket.onclose = (e) => { this.handleClose(e); };
    }

    /* WebSocket Event handler */
    private handleOpen(event:Event) {
        RocWCT.logger.info("connection to rocrail established");
    }

    private handleError(event:Event) {
        RocWCT.logger.error(event.type);
        this.reconnect();
    }
    private handleClose(event:Event) {
        RocWCT.logger.info("connection closed");
        this.reconnect();
    }

    private handleMessage(event:MessageEvent) {
        RocWCT.logger.trace(`<<< incoming message`);
        RocWCT.logger.trace(event.data);
    }    

    /* helper methods */
    public async sendCmd(cmd : string) {

        if(this.socket == null || this.socket.readyState !==  WebSocket.OPEN) {
            RocWCT.logger.debug(`socket is currently not ready for communication. waiting for better times...`);
            while(this.socket == null || this.socket.readyState !==  WebSocket.OPEN) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        RocWCT.logger.trace(`>>> outgoing message`);
        RocWCT.logger.trace(cmd);
        this.socket.send(cmd);
    }

    private reconnect() {
        if(this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
            RocWCT.logger.info("try to reconnect...");
            window.setTimeout(() => { this.initSocket(); }, 1000);
        }
    }

    private buildWsUrl() {
        let protocol = (location.protocol == "https:") ? "wss" : "ws";
        let host = location.hostname.replace("www.", "");
        let port = location.port;
        return protocol + "://" + host + ":" + port;
    }

}