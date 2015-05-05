module.exports = {
    Status: {
        GENERATOR: "generator",
        RECEIVER: "receiver"
    },
    RedisKeys: {
        CLIENTS_LIST: "clientsList",
        PUBSUB_CHANNEL: "clients",
        MESSAGES_LIST: "messagesList",
        ERRORS_LIST: "errorsList"
    },
    PubSub: {
        CHANNEL_CHECK: "clients",
        CHANNEL_RECEIVERS: "receivers"
    },
    Timeout: {
        EXPIRE: 1500,
        CHECK: 500,
        CHECK_ACTIVE: 10000,
        GENERATE: 500
    },
    Force: {
        BOTS: 100,
        GEN_TIMEOUT: 0,
        MAX_COUNT: 1000000
    }
};