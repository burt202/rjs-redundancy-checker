var fs = require('fs');

var FileWriter = function (file, content) {
    this.file = file;
    this.content = content;
};

FileWriter.prototype.write = function () {
	var file = fs.createWriteStream(this.file);

	this.content.forEach(function(line) {
		file.write(line + '\n');
	});

	file.end();
};

module.exports = FileWriter;
