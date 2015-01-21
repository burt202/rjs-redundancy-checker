var fs = require('fs');

var RjsRedundancyChecker = require('../');

var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));

var rjsRedundancyChecker = new RjsRedundancyChecker(config);
rjsRedundancyChecker.run();
