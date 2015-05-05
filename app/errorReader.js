var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var client;

function ErrorReader() {
    client = redis.createClient();
    client.on("error", function (err) {
        LogMe.error("Error: " + err);
    });
}

ErrorReader.prototype.start = function() {
    function onGetElements(err, data) {
        if (err) {
            LogMe.error("Get error messages error: " + err);
        }
        for (var i = 0; i < data.length; i++) {
            LogMe.log("Error message: " + data[i]);
        }
        client.del(Enum.RedisKeys.ERRORS_LIST);
        global.process.exit(0);
    }

    client.lrange(Enum.RedisKeys.ERRORS_LIST, 0, -1, onGetElements);
};

module.exports = ErrorReader;