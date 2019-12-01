import { RocWCT } from '../rocwct';

/**
 * this class manages the connection between 
 * RocWCT user interface and rocrail server.
 */
export class Socket {

    private socket: WebSocket;

    public init() {
        this.initSocket();
    }

    /**
     * starts the socket and registers event listeners
     */
    private initSocket() {

        RocWCT.logger.info("initializing websocket...");
        
        this.socket = new WebSocket(this.buildWsUrl(),"rcp");
        this.socket.onopen = (e) => { this.handleOpen(e); };
        this.socket.onmessage = (e) => { this.handleMessage(e); };
        this.socket.onerror = (e) => { this.handleError(e); };
        this.socket.onclose = (e) => { this.handleClose(e); };
    }

    /**
     * handles WebSocket's open event
     */
    private handleOpen(event:Event) {
        RocWCT.logger.info("connection to rocrail established");
    }

    /**
     * handles WebSocket's error event
     */
    private handleError(event:Event) {
        RocWCT.logger.error(event.type);
        this.reconnect();
    }
    
    /**
     * handles WebSocket's close event
     */
    private handleClose(event:Event) {
        RocWCT.logger.info("connection closed");
        this.reconnect();
    }

    /**
     * handles WebSocket's message event
     */
    private handleMessage(event:MessageEvent) {
        RocWCT.logger.trace(`<<< incoming message`);
        RocWCT.logger.trace(event.data);
        // todo --> parse and inform controls
    }    

    /**
     * sends the rcp command to the rocrail server
     * if socket is not yet ready, the method will wait for it
     * @param cmd 
     */
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

    /**
     * reconnects if necessary
     */
    private reconnect() {
        if(this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
            RocWCT.logger.info("try to reconnect...");
            window.setTimeout(() => { this.initSocket(); }, 1000);
        }
    }

    /**
     * builds the WebSocket url to connect to
     */
    private buildWsUrl() {
        let protocol = (location.protocol == "https:") ? "wss" : "ws";
        let host = location.hostname.replace("www.", "");
        let port = location.port;
        return protocol + "://" + host + ":" + port;
    }

}