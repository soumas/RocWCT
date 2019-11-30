import { Config, ConfigContainer } from './lib/config';
import { Socket } from './lib/socket';
import { Logger } from './lib/logger';

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

/* export method initRocWCT() - and only this
method - to the world outside our module */
globalThis.initRocWCT = function (cfg : ConfigContainer) {
    RocWCT.init(cfg);
}