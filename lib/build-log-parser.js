var fs = require('fs');
var path = require('path');

var BuildLogParser = function (pathToProject, publicAssetDirPath, buildLogPath, directoriesToIgnore) {
    this.pathToProject = pathToProject;
    this.publicAssetDirPath = publicAssetDirPath;
    this.buildLogPath = buildLogPath;

    this.directoriesToIgnore = directoriesToIgnore.map(function (dir) {
        return publicAssetDirPath + dir;
    });
};

BuildLogParser.prototype.parse = function () {
    var logLines = fs.readFileSync(this.pathToProject + this.buildLogPath, 'utf8').split('\n');
    var usedFiles = logLines.slice(getStartingIndex(logLines));

    usedFiles = filterFiles(usedFiles, this.pathToProject, this.directoriesToIgnore);
    usedFiles = formatFiles(usedFiles, this.pathToProject, this.publicAssetDirPath);

    usedFiles.sort();
    return usedFiles;
};

function getStartingIndex (lines) {
    var index = -1;

    for (var i = 0; i < lines.length; i++) {
        index++;
        if (lines[i] === '----------------') {
            break;
        }
    }

    return index + 1;
}

function filterFiles (files, pathToProject, directoriesToIgnore) {
    return files.filter(function (file) {
        var excludeDir = false;
        file = file.replace(pathToProject, '');

        directoriesToIgnore.forEach(function (dir) {
            if (file.substring(0, dir.length) === dir) {
                excludeDir = true;
            }
        });

        if (excludeDir) {
            return false;
        }

        if (file === '') {
            return false;
        }

        return true;
    });
}

function formatFiles (files, pathToProject, publicAssetDirPath) {
    return files.map(function (file) {
        file = path.normalize(file);
        file = file.replace(/\\/g, '/');
        file = file.replace(pathToProject, '');
        file = file.replace('text!', publicAssetDirPath);
        return file;
    });
}

module.exports = BuildLogParser;
