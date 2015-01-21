var _ = require('underscore');

var DirectoryScanner = require('./lib/directory-scanner');
var Logger = require('./lib/logger');
var BuildLogParser = require('./lib/build-log-parser');
var UnusedBreakdown = require('./lib/unused-breakdown');

var RjsRedundancyChecker = function (config) {
    this.config = config;
};

RjsRedundancyChecker.prototype.run = function () {
    _.defaults(this.config, {
        directoriesToIgnore: [],
        filesToIgnore: [],
        allFilePath: '',
        usedFilePath: '',
        unUsedFilePath: '',
        disableConsoleLogs: false
    });

    var logger = new Logger(this.config.disableConsoleLogs);

    // SCAN CODEBASE FOR ALL FILES

    var scanner = new DirectoryScanner(
        this.config.pathToProject,
        this.config.publicAssetDirPath,
        this.config.extensions,
        this.config.directoriesToIgnore,
        this.config.filesToIgnore
    );

    var allFiles = scanner.recursiveScan();

    logger.log('Scanned for ' + this.config.extensions.join(',') +  ' files in: ' + this.config.pathToProject + this.config.publicAssetDirPath);
    logger.log('Ignored directories: ' + this.config.directoriesToIgnore.join(', '));
    logger.log('Ignored files: ' + this.config.filesToIgnore.join(', '));

    // WRITE SCANNED PATHS TO FILE

    logger.writeToFile(this.config.allFilePath, allFiles);
    logger.log(allFiles.length + ' scanned paths written to: ' + this.config.allFilePath);

    // READ FROM BUILD LOG AND FILTER/FORMAT LINES

    var parser = new BuildLogParser(
        this.config.pathToProject,
        this.config.publicAssetDirPath,
        this.config.buildLogPath,
        this.config.directoriesToIgnore
    );

    var usedFiles = parser.parse();

    // WRITE USED PATHS TO FILE

    logger.writeToFile(this.config.usedFilePath, usedFiles);
    logger.log(usedFiles.length + ' used paths written to: ' + this.config.usedFilePath);

    // WRITE OUT UNUSED PATHS TO FILE

    var unUsedFiles = allFiles.filter(function (i) {
        return usedFiles.indexOf(i) < 0;
    });

    logger.writeToFile(this.config.unUsedFilePath, unUsedFiles);
    logger.log(unUsedFiles.length + ' unused paths written to: ' + this.config.unUsedFilePath);

    // WORK HOW MANY LINES CAN BE DELETED

    var breakdown = new UnusedBreakdown(unUsedFiles, this.config.pathToProject);
    var results = breakdown.compile();

    logger.log('Unused file breakdown:');

    results.breakdown.forEach(function (info) {
        logger.log(info);
    });

    logger.log('Total: ' + results.lineSaving + ' line saving');
};

module.exports = RjsRedundancyChecker;
