import { RocWCT } from '../rocwct';
import { Utils } from './utils';
import { LoggingLevel, Logger } from './logger';

export class Config {
    
    private controlcode: string;
    private slavecode: string;
    private throttleid: string;   
    private loggingLevel : string;

    public init(cfg : ConfigContainer) : void {
        
        RocWCT.logger.info("loading configuration...");

        this.initByCfgOrDefaults(cfg);
        this.initByUrlParams();

        RocWCT.logger.info("configuration loaded");
        RocWCT.logger.debug(this);
    }

    private initByCfgOrDefaults(cfg : ConfigContainer) {
        if(Utils.nullOrUndefined(cfg)) {
            cfg = new ConfigContainer();
        }        
        this.controlcode = !Utils.nullOrUndefined(cfg.controlcode) ? cfg.controlcode : "";
        this.slavecode = !Utils.nullOrUndefined(cfg.slavecode) ? cfg.slavecode : "";
        this.throttleid = !Utils.nullOrUndefined(cfg.throttleid) ? cfg.throttleid : "rocwct";
        this.loggingLevel = !Utils.nullOrUndefined(cfg.loggingLevel) ? cfg.loggingLevel : "info";
    }

    private initByUrlParams() {
        Object.keys(this).forEach((key: string) => {
            if(!Utils.nullOrUndefined(Utils.getUrlParam(key))) {
                this[key] = Utils.getUrlParam(key);
            }
        });
    }

    // public getter
    public getControlcode() : string {
        return this.controlcode;
    }
    public getSlavecode() : string {
        return this.slavecode;
    }
    public getThrottleid() : string {
        return this.throttleid;
    }
    public getLoggingLevel() : LoggingLevel {
        return LoggingLevel[this.loggingLevel];
    }
    
}

export class ConfigContainer {
    controlcode: string;
    slavecode: string;
    throttleid: string;
    loggingLevel: string;
}