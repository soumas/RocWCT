import { Config, ConfigContainer } from './lib/config';
import { Socket } from './lib/socket';
import { Logger } from './lib/logger';
import { MessageRouter } from './lib/messagerouter';

/**
 * The 'static' class RocWCT is the entrypoint and the central
 * controller for a single instance of a RocWCT user interface. 
 */
export class RocWCT {

    public static config : Config = new Config();
    public static logger : Logger = new Logger();
    public static socket : Socket = new Socket();    
    public static router : MessageRouter = new MessageRouter();

    public static init(cfg : ConfigContainer) {
        RocWCT.config.init(cfg);
        RocWCT.socket.init();
        //RocWCT.router.out(`<model cmd="plan" />`);
        //RocWCT.router.out(`<model cmd="swlist"/>`);
        // RocWCT.router.out(`<sys cmd="getstate"/>`);
        // RocWCT.router.out(`<model controlcode="" slavecode="" cmd="lclist" />`); 
        //RocWCT.router.out(`<model cmd="lcprops" throttleid="rocwct" />`);
        //RocWCT.router.out(`<lc id="4711" V_raw="87" V_rawMax="100" cmd="velocity" throttleid="rocwct"/>`);
        //RocWCT.router.out(`<model cmd="lcprops" />`); 
    }

}

/**
 * global init-method (has to be called by the host ui)
 */
globalThis.initRocWCT = function (cfg : ConfigContainer) {
    RocWCT.init(cfg);
}