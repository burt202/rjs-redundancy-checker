var fs = require('fs');

var UnusedBreakdown = function (files, pathToProject) {
    this.files = files;
    this.pathToProject = pathToProject;
};

UnusedBreakdown.prototype.compile = function () {
    var lineSaving = 0;
    var breakdown = [];

    this.files.forEach(function (file) {
        var count = fs.readFileSync(this.pathToProject + file, 'utf8').split('\n').length;
        lineSaving += count;
        breakdown.push(file + ' (' + count + ')');
    }.bind(this));

    return {
        breakdown: breakdown,
        lineSaving: lineSaving
    };
};

module.exports = UnusedBreakdown;
