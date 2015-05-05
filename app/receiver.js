var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var client, subscribeClient;

function Receiver() {
    client = redis.createClient();
    client.on("error", function (err) {
        LogMe.error("Error: " + err);
    });
}

Receiver.prototype.start = function(_id) {
    this.id = _id;
    this.active = true;
    //subscribeOnPubSub(this.id);
    startReceiver.call(this);
};

Receiver.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function startReceiver() {
    var self = this;
    function onReceiveResult(error, msg) {
        if (error) {
            LogMe.log(self.id + " - error: " + msg);
            pushErrorMessage(msg);
        }
        else {
            LogMe.log(self.id + " - message: " + msg);
        }
        startReceiver.call(self);
    }

    client.blpop(Enum.RedisKeys.MESSAGES_LIST, 0, function(err, data) {
        if (err) {
            LogMe.error("Receiver error: " + err + " id: " + self.id);
            setTimeout(startReceiver, Enum.Timeout.CHECK);
        }
        if (data.length > 1) {
            eventHandler(data[1], onReceiveResult);
        }
    });
}

function eventHandler(msg, callback) {
    function onComplete() {
        var error = Math.random() > 0.85;
        callback(error, msg);
    }

    setTimeout(onComplete, Math.floor(Math.random() * 1000));
}

function pushErrorMessage(message) {
    client.rpush(Enum.RedisKeys.ERRORS_LIST, message, function(err, index) {
        if (err) {
            LogMe.error("Push error message error: " + err + " \nMessages in list: " + index);
        }
        LogMe.log("Message pushed in error list: " + message + "  |  Messages in error list: " + index);
    });
}

function subscribeOnPubSub(id) {
    subscribeClient.subscribe(Enum.PubSub.CHANNEL_CHECK);
    subscribeClient.on('message', function (channel, message) {
        if (channel === Enum.PubSub.CHANNEL_CHECK) {
            client.publish(Enum.PubSub.CHANNEL_RECEIVERS, "Receiver: " + id);
        }
    });
}

module.exports = Receiver;