var Bot = require('./app/bot');
var ErrorReader = require('./app/errorReader');
var Enum = require('./app/enum');
var LogMe = require('./app/util/logMe');

var force = false;
var debug = false;
var getErrors = false;



if (getErrors) {
    LogMe.init({debug: true});
    var errorReader = new ErrorReader();
    errorReader.start();
}
else {
    LogMe.init({debug: debug});
    var bots = [];
    var botsCount = force ? Enum.Force.BOTS : 3;
    for (var i = 0; i < botsCount; i++) {
        bots.push(new Bot({ force: force }));
    }
}
