var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var Generator = require('./generator');
var Receiver = require('./receiver');
var client;

function Bot(options) {
    client = redis.createClient();
    client.on("error", function (err) {
        LogMe.error("Error: " + err);
    });
    this.options = options;
    this.generator = new Generator(options);
    this.receiver = new Receiver(options);
    this.addInitKeyInRedis();
}

Bot.prototype.addInitKeyInRedis = function() {
    function onComplete(err, index) {
        if (err) {
            LogMe.error("AddInitKeyInRedis error: " + err);
        }
        setExpireTime(Enum.RedisKeys.CLIENTS_LIST, Enum.Timeout.EXPIRE);
        this.id = global.process.pid + '-' + index + '-' + Date.now();
        this.status = index === 1 ? this.initGenerator() : this.initReceiver();
        LogMe.log('Started: ' + this.id + ': ' + this.status);
    }

    client.rpush(Enum.RedisKeys.CLIENTS_LIST, Date.now(), onComplete.bind(this));
};

Bot.prototype.initGenerator = function() {
    function updateGeneratorIsActive() {
        setExpireTime(Enum.RedisKeys.CLIENTS_LIST, Enum.Timeout.EXPIRE);
    }

    this.generator.start(this.id, client);
    this.intervalKey = setInterval(updateGeneratorIsActive, Enum.Timeout.CHECK);
    return Enum.Status.GENERATOR;
};

Bot.prototype.initReceiver = function() {
    function checkIsGeneratorExists() {
        client.exists(Enum.RedisKeys.CLIENTS_LIST, function(err, isGeneratorExists) {
            if (!isGeneratorExists) {
                this.reInitialize();
            }
        }.bind(this));
    }

    this.receiver.start(this.id, client);
    this.intervalKey = setInterval(checkIsGeneratorExists.bind(this), Enum.Timeout.CHECK);
    return Enum.Status.RECEIVER;
};

Bot.prototype.reInitialize = function() {
    LogMe.log('Reinitialize bot: ' + this.status);
    this.shutdown();
    this.addInitKeyInRedis();
};

Bot.prototype.shutdown = function() {
    clearInterval(this.intervalKey);
    this.receiver.finish();
    this.generator.finish();
};

function setExpireTime(key, time) {
    client.pexpire(key, time);
}

module.exports = Bot;