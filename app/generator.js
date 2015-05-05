var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var client, subscribeClient;
var intervalKey;

function Generator(options) {
    client = redis.createClient();
    client.on("error", function (err) {
        LogMe.error("Error: " + err);
    });
    this.options = options;
    getMessage = getMessage.bind(this);
}

Generator.prototype.start = function(id) {
    this.id = id;
    this.active = true;
    startGeneration.call(this);
    //checkActiveClients(this.id);
};

Generator.prototype.finish = function() {
    if (this.active) {
        this.active = false;
        clearInterval(intervalKey);
    }
};

function startGeneration() {
    function onSetInterval() {
        sendMessage();
        if (this.options.force && this.cnt > Enum.Force.MAX_COUNT) {
            clearInterval(intervalKey);
        }
    }

    sendMessage();
    var interval = this.options.force ? Enum.Force.GEN_TIMEOUT : Enum.Timeout.GENERATE;
    intervalKey = setInterval(onSetInterval.bind(this), interval);
}

function sendMessage() {
    var message = getMessage();
    client.rpush(Enum.RedisKeys.MESSAGES_LIST, message, function(err, index) {
        if (err) {
            LogMe.error("Generation error: " + err + " \nMessages in list: " + index);
        }
        LogMe.log("Message generated: " + message + "  |  Messages in list: " + index);
    });
}

function getMessage() {
    this.cnt = this.cnt || 0;
    return this.cnt++;
}

function checkActiveClients(id) {
    setInterval(function() {
        LogMe.log("*** Date: " + (new Date()).toLocaleString() + "***");
        LogMe.log("Generator: " + id);
        client.publish(Enum.PubSub.CHANNEL_CHECK, "check");
    }, Enum.Timeout.CHECK_ACTIVE);
    subscribeClient.subscribe(Enum.PubSub.CHANNEL_RECEIVERS);
    subscribeClient.on('message', function (channel, message) {
        if (channel === Enum.PubSub.CHANNEL_RECEIVERS) {
            LogMe.log(message);
        }
    });
}

module.exports = Generator;