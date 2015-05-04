var LogMe = require('./app/util/logMe');
//LogMe.init({debug: false,});
var force = true;

var Bot = require('./app/bot');
var bots = [];
var botsCount = force ? 100 : 1;
for (var i = 0; i < botsCount; i++) {
    bots.push(new Bot({ force: force }));
}