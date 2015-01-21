var FileWriter = require('./file-writer');

var Logger = function (disableConsoleLogs) {
    this.disableConsoleLogs = disableConsoleLogs;
};

Logger.prototype.log = function (text) {
    if (this.disableConsoleLogs) {
        return;
    }

    console.log(text);
};

Logger.prototype.writeToFile = function (path, contents) {
    if (!path || !path.length) {
        return;
    }

    var writer = new FileWriter(path, contents);
    writer.write();
};

module.exports = Logger;
