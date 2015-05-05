var Bot = require('./app/bot');
var ErrorReader = require('./app/errorReader');
var Enum = require('./app/enum');
var LogMe = require('./app/util/logMe');
var args = require('minimist')(process.argv.slice(2));

if (args.getErrors) {
    LogMe.init({debug: true});
    var errorReader = new ErrorReader();
    errorReader.start();
}
else {
    LogMe.init({debug: args.debug});
    var bots = [];
    var botsCount = args.force ? Enum.Force.BOTS : 1;
    for (var i = 0; i < botsCount; i++) {
        bots.push(new Bot({ force: args.force }));
    }
}