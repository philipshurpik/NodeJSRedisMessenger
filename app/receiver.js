var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var client;

function Receiver() {
    client = redis.createClient();
    client.on("error", function (err) {
        LogMe.error("Error: " + err);
    });
}

Receiver.prototype.start = function(_id) {
    this.id = _id;
    this.active = true;
    startReceiver.call(this);
};

Receiver.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function startReceiver() {
    function onEventReceived(err, data) {
        if (err) {
            LogMe.error("Receiver error: " + err + " id: " + this.id);
            setTimeout(startReceiver.bind(this), Enum.Timeout.CHECK);
        }
        if (data.length > 1) {
            eventHandler(data[1], onEventProcessed.bind(this));
        }
    }

    function eventHandler(msg, callback) {
        function onComplete() {
            var error = Math.random() > 0.85;
            callback(error, msg);
        }

        setTimeout(onComplete, Math.floor(Math.random() * 1000));
    }

    function onEventProcessed(error, msg) {
        var logText = error ? (this.id + " - error: " + msg) : (this.id + " - message: " + msg);
        LogMe.log(logText);
        if (error) {
            pushErrorMessage(msg);
        }
        if (this.active) {
            startReceiver.call(this);
        }
    }

    client.blpop(Enum.RedisKeys.MESSAGES_LIST, 0, onEventReceived.bind(this));
}

function pushErrorMessage(message) {
    function onMessageAdded(err, index) {
        if (err) {
            LogMe.error("Push error message error: " + err + " \nMessages in list: " + index);
        }
        LogMe.log("Message pushed in error list: " + message + "  |  Messages in error list: " + index);
    }

    client.rpush(Enum.RedisKeys.ERRORS_LIST, message, onMessageAdded);
}

module.exports = Receiver;