var redis = require('redis');
var Enum = require('./enum');
var LogMe = require('./util/logMe');
var Generator = require('./generator');
var Receiver = require('./receiver');
var client = redis.createClient();

client.on("error", function (err) {
    LogMe.error("Error: " + err);
});

function Bot(options) {
    this.options = options;
    this.generator = new Generator(options);
    this.receiver = new Receiver(options);
    this.addInitKeyInRedis();
}

Bot.prototype.addInitKeyInRedis = function() {
    client.rpush(Enum.RedisKeys.CLIENTS_LIST, Date.now(), function(err, index) {
        setExpireTime(Enum.RedisKeys.CLIENTS_LIST, Enum.Timeout.EXPIRE);
        this.id = global.process.pid + '-' + index + '-' + Date.now();
        this.status = index === 1 ? this.initGenerator() : this.initReceiver();
        LogMe.log('Started: ' + this.id + ': ' + this.status);
    }.bind(this));
};

Bot.prototype.initGenerator = function() {
    this.generator.start(this.id, client);
    this.intervalKey = setInterval(function() {
        setExpireTime(Enum.RedisKeys.CLIENTS_LIST, Enum.Timeout.EXPIRE);
    }, Enum.Timeout.CHECK);
    return Enum.Status.GENERATOR;
};

Bot.prototype.initReceiver = function() {
    this.receiver.start(this.id, client);
    this.intervalKey = setInterval(function() {
        client.exists(Enum.RedisKeys.CLIENTS_LIST, function(err, isGeneratorExists) {
            if (!isGeneratorExists) {
                this.reInitialize();
            }
        }.bind(this));
    }.bind(this), Enum.Timeout.CHECK);
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