var fs = require('fs');
var path = require('path');

var DirectoryScanner = function (pathToProject, publicAssetDirPath, extensions, directoriesToIgnore, filesToIgnore) {
    this.pathToProject = pathToProject;
    this.publicAssetDirPath = publicAssetDirPath;
    this.extensions = extensions;
    this.filesToIgnore = filesToIgnore;

    this.directoriesToIgnore = directoriesToIgnore.map(function (dir) {
        return publicAssetDirPath + dir;
    });
};

DirectoryScanner.prototype.recursiveScan = function (dir) {
    if (dir === undefined) {
        dir = this.pathToProject + this.publicAssetDirPath;
    }

    dir = stripTrailingSlash(dir);
    var results = [];

    fs.readdirSync(dir).forEach(function(file) {
        file = dir + '/' + file;

        var stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !directoryToIgnore(file, this.directoriesToIgnore, this.pathToProject)) {
            results = results.concat(this.recursiveScan(file));
        } else {
            file = file.replace(this.pathToProject, '');
            if (allowedExtension(file, this.extensions) && !fileToIgnore(file, this.filesToIgnore, this.publicAssetDirPath)) {
                results.push(file);
            }
        }
    }.bind(this));

    results.sort();
    return results;
};

function stripTrailingSlash (str) {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }

    return str;
}

function fileToIgnore (file, filesToIgnore, publicAssetDirPath) {
    file = file.replace(publicAssetDirPath, '');
    return filesToIgnore.indexOf(file) >= 0 ? true : false;
}

function directoryToIgnore (dir, directoriesToIgnore, pathToProject) {
    dir = dir.replace(pathToProject, '');
    return directoriesToIgnore.indexOf(dir) >= 0 ? true : false;
}

function allowedExtension (file, extensions) {
    return extensions.indexOf(path.extname(file).replace('.', '')) >= 0 ? true : false;
}

module.exports = DirectoryScanner;
