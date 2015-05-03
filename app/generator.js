var Enum = require('./enum');
var LogMe = require('./util/logMe');
var redis = require('redis');
var client = redis.createClient();

function Generator() {}

Generator.prototype.start = function(id) {
    this.id = id;
    this.active = true;
    var message = getMessage.call(this);
    //console.log(message);
    checkActiveClients(this.id);
};

Generator.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function getMessage() {
    this.cnt = this.cnt || 0;
    return this.cnt++;
}

function checkActiveClients(id) {
    setInterval(function() {
        LogMe.log("*** Date: " + (new Date()).toLocaleString() + "***");
        LogMe.log("Generator: " + id);
        client.publish(Enum.RedisKeys.PUBSUB_CHANNEL, 'check');
    }, Enum.Timeout.CHECK_ACTIVE);
}

module.exports = Generator;