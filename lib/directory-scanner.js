var _ = require('underscore');
var fs = require('fs');
var path = require('path');

function rtrim(str, charlist) {
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '')
    .replace(re, '');
}

function fileToIgnore (file, filesToIgnore, publicAssetDirPath) {
    file = file.replace(publicAssetDirPath, '');
    return _.contains(filesToIgnore, file);
}

function directoryToIgnore (dir, directoriesToIgnore, pathToProject) {
    dir = dir.replace(pathToProject, '');
    return _.contains(directoriesToIgnore, dir);
}

function allowedExtension (file, extensions) {
    return _.contains(extensions, path.extname(file).replace('.', ''));
}

var DirectoryScanner = function (pathToProject, publicAssetDirPath, extensions, directoriesToIgnore, filesToIgnore) {
    this.pathToProject = pathToProject;
    this.publicAssetDirPath = publicAssetDirPath;
    this.extensions = extensions;
    this.filesToIgnore = filesToIgnore;

    this.directoriesToIgnore = _.map(directoriesToIgnore, function (dir) {
        return publicAssetDirPath + dir;
    });
};

DirectoryScanner.prototype.recursiveScan = function (dir) {
    if (dir === undefined) {
        dir = this.pathToProject + this.publicAssetDirPath;
    }

    dir = rtrim(dir, '\\/');
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

    return results;
};

module.exports = DirectoryScanner;
