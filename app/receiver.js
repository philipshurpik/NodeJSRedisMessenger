function Receiver() {
    this.active = false;
}

Receiver.prototype.start = function() {
    this.active = true;
};

Receiver.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function eventHandler(msg, error) {
    function onComplete(){
        var error = Math.random() > 0.85;
        callback(error, msg);
    }

    setTimeout(onComplete, Math.floor(Math.random()*1000));
}

module.exports = Receiver;