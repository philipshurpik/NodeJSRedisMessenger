var Enum = require('./enum');
var LogMe = require('./util/logMe');
var redis = require('redis');
var client = redis.createClient();

function Receiver() {
    this.active = false;
}

Receiver.prototype.start = function(id) {
    this.id = id;
    this.active = true;
    subscribeOnMessages(this.id);
};

Receiver.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function eventHandler(msg, error) {
    function onComplete(){
        var error = Math.random() > 0.85;
        callback(error, msg);
    }

    setTimeout(onComplete, Math.floor(Math.random()*1000));
}

function subscribeOnMessages(id) {
    client.subscribe('clients');
    client.on('message', function (channel, message) {
        if (channel === Enum.RedisKeys.PUBSUB_CHANNEL) {
            LogMe.log("Receiver: " + id);
        }
    });
}

module.exports = Receiver;