import {Logger, LoggingLevel} from './lib/logger';

window.onload = function() {
    init();
}

function init() {
    Logger.setLoggingLevel(LoggingLevel.debug);
    Logger.trace("trace");
    Logger.debug("debug");
    Logger.info("info");
    Logger.warn("Warn");
    Logger.error("Error");
}