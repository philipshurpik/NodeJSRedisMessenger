var Logger = require('logger');
var defaultLogFile = 'app.log';
var defaultErrorLogFile = 'app-error.log';
var logger = Logger.createLogger(defaultLogFile);
var errorLogger = Logger.createLogger(defaultErrorLogFile);
var debug = false;

module.exports = {
    init: function(options) {
        options = options || {};
        debug = options.debug || debug;
        logger = options.logFile ? Logger.createLogger(options.logFile) : logger;
        errorLogger = options.errorLogFile ? Logger.createLogger(options.errorLogFile) : errorLogger;
    },
    log: function(message) {
        debug && console.log(message);
        logger.info(message);
    },
    error: function(message) {
        debug && console.error(message);
        errorLogger.error(message);
    }
};