export enum LoggingLevel {
    trace, debug, info, warn, error 
}
export class Logger {

    static loggingLevel : LoggingLevel = LoggingLevel.info;
    
    static setLoggingLevel(level : LoggingLevel) {
        Logger.loggingLevel = level;
    }

    static error(data : any) {    
        if(Logger.loggingLevel <= LoggingLevel.error) {
            console.error(data);
        }    
    }
    static warn(data : any) {    
        if(Logger.loggingLevel <= LoggingLevel.warn) {
            console.warn(data);
        }    
    }
    static info(data : any) {    
        if(Logger.loggingLevel <= LoggingLevel.info) {
            console.info(data);
        }    
    }
    static debug(data : any) {    
        if(Logger.loggingLevel <= LoggingLevel.debug) {
            console.log(data);
        }    
    }
    static trace(data : any) {    
        if(Logger.loggingLevel <= LoggingLevel.trace) {
            console.log(data);
        }    
    }
}