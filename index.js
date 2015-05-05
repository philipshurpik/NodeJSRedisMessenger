var Enum = require('./app/enum');
var LogMe = require('./app/util/logMe');
//LogMe.init({debug: false});
var force = false;

var Bot = require('./app/bot');
var bots = [];
var botsCount = force ? Enum.Force.BOTS : 3;
for (var i = 0; i < botsCount; i++) {
    bots.push(new Bot({ force: force }));
}