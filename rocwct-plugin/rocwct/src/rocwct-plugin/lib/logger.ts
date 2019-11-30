import { RocWCT } from '../rocwct';
import { Utils } from './utils';

export enum LoggingLevel {
    trace, debug, info, warn, error
}

export class Logger {

    public error(data: any) {
        if (Utils.nullOrUndefined(RocWCT.config.getLoggingLevel())
            || RocWCT.config.getLoggingLevel() <= LoggingLevel.error) {
            console.error(data);
        }
    }

    public warn(data: any) {
        if (Utils.nullOrUndefined(RocWCT.config.getLoggingLevel())
            || RocWCT.config.getLoggingLevel() <= LoggingLevel.warn) {
            console.warn(data);
        }
    }

    public info(data: any) {
        if (Utils.nullOrUndefined(RocWCT.config.getLoggingLevel()) 
            || RocWCT.config.getLoggingLevel() <= LoggingLevel.info) {
            console.info(data);
        }
    }

    public debug(data: any) {
        if (Utils.nullOrUndefined(RocWCT.config.getLoggingLevel()) 
            || RocWCT.config.getLoggingLevel() <= LoggingLevel.debug) {
            console.log(data);
        }
    }

    public trace(data: any) {
        if (Utils.nullOrUndefined(RocWCT.config.getLoggingLevel()) 
            || RocWCT.config.getLoggingLevel() <= LoggingLevel.trace) {
            console.log(data);
        }
    }
}