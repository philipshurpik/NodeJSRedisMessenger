var Enum = require('./enum');
var LogMe = require('./util/logMe');
var redis = require('redis');
var client = redis.createClient();
var subscribeClient = redis.createClient();
var messagesCount = 0;
var intervalKey;

function Generator(options) {
    this.options = options;
    getMessage = getMessage.bind(this);
}

Generator.prototype.start = function(id) {
    this.id = id;
    this.active = true;
    messagesCount = 0;
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
        if (this.options.force && messagesCount > 10000) {
            clearInterval(intervalKey);
        }
    }

    sendMessage();
    var interval = this.options.force ? 0 : Enum.Timeout.GENERATE;
    intervalKey = setInterval(onSetInterval.bind(this), interval);
}

function sendMessage() {
    var message = getMessage();
    console.log("message generated:" + message);
    client.rpush(Enum.RedisKeys.MESSAGES_LIST, message, function(err, index) {
        messagesCount++;
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