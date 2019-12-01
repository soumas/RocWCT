import { Config, ConfigContainer } from './lib/config';
import { Socket } from './lib/socket';
import { Logger } from './lib/logger';

/**
 * The 'static' class RocWCT is the entrypoint and the central
 * controller for a single instance of a RocWCT user interface. 
 */
export class RocWCT {

    public static config : Config = new Config();
    public static logger : Logger = new Logger();
    public static socket : Socket = new Socket();    

    public static init(cfg : ConfigContainer) {
        RocWCT.config.init(cfg);
        RocWCT.socket.init();
        RocWCT.socket.sendCmd(`<sys cmd="getstate"/>`);
    }

}

/**
 * global init-method (has to be called by the host ui)
 */
globalThis.initRocWCT = function (cfg : ConfigContainer) {
    RocWCT.init(cfg);
}