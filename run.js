var fs = require('fs');
var DirectoryScanner = require(__dirname + '/lib/directory-scanner');
var FileWriter = require(__dirname + '/lib/file-writer');
var BuildLogParser = require(__dirname + '/lib/build-log-parser');

var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));

// SCAN CODEBASE FOR ALL FILES

var scanner = new DirectoryScanner(
  config.pathToProject,
  config.publicAssetDirPath,
  config.extensions,
  config.directoriesToIgnore,
  config.filesToIgnore
);

var allFiles = scanner.recursiveScan();

console.log('Scanned for ' + config.extensions.join(',') +  ' files in: ' + config.pathToProject + config.publicAssetDirPath);
console.log('Ignored directories: ' + config.directoriesToIgnore.join(', '));
console.log('Ignored files: ' + config.filesToIgnore.join(', '));

// WRITE SCANNED PATHS TO FILE

allFiles.sort();
var writer = new FileWriter(config.allFilePath, allFiles);
writer.write();

console.log(allFiles.length + ' scanned paths written to: ' + config.allFilePath);

// READ FROM BUILD LOG AND FILTER/FORMAT LINES

var parser = new BuildLogParser(
  config.pathToProject,
  config.publicAssetDirPath,
  config.buildLogPath,
  config.directoriesToIgnore
);

var usedFiles = parser.parse();

// WRITE USED PATHS TO FILE

usedFiles.sort();
var writer = new FileWriter(config.usedFilePath, usedFiles);
writer.write();

console.log(usedFiles.length + ' used paths written to: ' + config.usedFilePath);

// WRITE OUT UNUSED PATHS TO FILE

var unUsedFiles = allFiles.filter(function (i) { return usedFiles.indexOf(i) < 0; });
var writer = new FileWriter(config.unUsedFilePath, unUsedFiles);
writer.write();

console.log(unUsedFiles.length + ' unused paths written to: ' + config.unUsedFilePath);

// WORK HOW MANY LINES CAN BE DELETED

console.log('Unused file breakdown:');
var lineSaving = 0;

unUsedFiles.forEach(function (file) {
  var count = fs.readFileSync(config.pathToProject + file, 'utf8').split('\n').length;
  lineSaving += count;
  console.log(file + ' (' + count + ')');
});

console.log('Total: ' + lineSaving + ' line saving');
