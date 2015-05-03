function Generator() {}

Generator.prototype.start = function() {
    this.active = true;
    var message = getMessage.call(this);
    //console.log(message);
};

Generator.prototype.finish = function() {
    if (this.active) {
        this.active = false;
    }
};

function getMessage() {
    this.cnt = this.cnt || 0;
    return this.cnt++;
}

module.exports = Generator;