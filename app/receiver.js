var Enum = require('./enum');
var redis = require('redis');
var client = redis.createClient();
var subscribeClient = redis.createClient();

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
    subscribeClient.subscribe(Enum.PubSub.CHANNEL_CHECK);
    subscribeClient.on('message', function (channel, message) {
        if (channel === Enum.PubSub.CHANNEL_CHECK) {
            client.publish(Enum.PubSub.CHANNEL_RECEIVERS, "Receiver: " + id);
        }
    });
}

module.exports = Receiver;