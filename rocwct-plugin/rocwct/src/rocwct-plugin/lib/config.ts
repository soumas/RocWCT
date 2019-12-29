import { RocWCT } from '../rocwct';
import { Utils } from './utils';
import { LoggingLevel } from './logger';

/**
 * container class for basic settings
 * note that only string representation is supported for this container
 * class. converting to real type is the job of the Config-class.
 */
export class ConfigContainer {
    controlcode: string;
    slavecode: string;
    throttleid: string;
    loggingLevel: string;
}

/**
 * this class is responsible for basic configurations.
 */
export class Config extends ConfigContainer {
    
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

    public init(cfg : ConfigContainer) : void {
        
        RocWCT.logger.info("loading configuration...");

        /* apply lowest level: default values */
        this.initDefaultValues();
        /* overrule default values by config-obj (provided by initRocWCT() call) */
        this.initByConfigObj(cfg);
        /* overrule config values by url params */
        this.initByUrlParams();

        RocWCT.logger.info("configuration loaded");
        RocWCT.logger.debug(this);
    }

    /**
     * apply available default value for ech property 
     */
    private initDefaultValues() {
        this.loggingLevel = "info";
        this.controlcode = "";
        this.slavecode = "";
        this.throttleid = "rocwct";
    }

    /**
     * apply available value from cfg-object for ech property 
     */
    private initByConfigObj(cfg : ConfigContainer) {
        if(Utils.nullOrUndefined(cfg)) {
            cfg = new ConfigContainer();
        }        
        Object.keys(this).forEach((key: string) => {
            if(!Utils.nullOrUndefined(cfg[key])) {
                this[key] = cfg[key];
            }
        });
    }

    /**
     * apply available value from url-param for ech property 
     */
    private initByUrlParams() {
        Object.keys(this).forEach((key: string) => {
            if(!Utils.nullOrUndefined(Utils.getUrlParam(key))) {
                this[key] = Utils.getUrlParam(key);
            }
        });
    }

    
}
