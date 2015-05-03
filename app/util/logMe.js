var Logger = require('logger');
var logger;
var defaultLogFile = 'app.log';
var debug = true;

module.exports = {
    init: function(options) {
        options = options || {};
        debug = options.debug || false;
        logger = Logger.createLogger(options.logFile || defaultLogFile);
    },
    log: function(message) {
        debug && console.log(message);
        !debug && logger.info(message);
    },
    error: function(message) {
        debug && console.error(message);
        !debug && logger.error(message);
    }
};