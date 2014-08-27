<?php

require_once('lib/DirectoryScanner.php');
require_once('lib/FileWriter.php');
require_once('lib/BuildLogParser.php');

$json = file_get_contents(__DIR__ . '/config.json');
$config = json_decode($json, true);

# SCAN CODEBASE FOR ALL FILES

$scanner = new DirectoryScanner(
  $config['pathToProject'],
  $config['publicAssetDirPath'],
  $config['extensions'],
  $config['directoriesToIgnore'],
  $config['filesToIgnore']
);

$allFiles = $scanner->recursiveScan();

echo 'Scanned for ' . implode(', ', $config['extensions']) .  ' files in: ' . $config['pathToProject'] . $config['publicAssetDirPath'] . PHP_EOL;
echo 'Ignored directories: ' . implode(', ', $config['directoriesToIgnore']) . PHP_EOL;
echo 'Ignored files: ' . implode(', ', $config['filesToIgnore']) . PHP_EOL;

# WRITE SCANNED PATHS TO FILE

asort($allFiles);
$writer = new FileWriter($config['allFilePath'], $allFiles);
$writer->write();

echo count($allFiles) . ' scanned paths written to: ' . $config['allFilePath'] . PHP_EOL;

# READ FROM BUILD LOG AND FILTER/FORMAT LINES

$parser = new BuildLogParser(
  $config['pathToProject'],
  $config['publicAssetDirPath'],
  $config['buildLogPath'],
  $config['directoriesToIgnore']
);

$usedFiles = $parser->parse();

# WRITE USED PATHS TO FILE

asort($usedFiles);
$writer = new FileWriter($config['usedFilePath'], $usedFiles);
$writer->write();

echo count($usedFiles) . ' used paths written to: ' . $config['usedFilePath'] . PHP_EOL;

# WRITE OUT UNUSED PATHS TO FILE

$unUsedFiles = array_diff($allFiles, $usedFiles);
$writer = new FileWriter($config['unUsedFilePath'], $unUsedFiles);
$writer->write();

echo count($unUsedFiles) . ' unused paths written to: ' . $config['unUsedFilePath'] . PHP_EOL;

# WORK HOW MANY LINES CAN BE DELETED

echo 'Unused file breakdown:' . PHP_EOL;
$lineSaving = 0;

foreach ($unUsedFiles as $file) {
  $count = count(file($config['pathToProject'] . $file));
  $lineSaving += $count;
  echo $file . ' (' . $count . ')' . PHP_EOL;
}

echo 'Total: ' . $lineSaving . ' line saving' . PHP_EOL;
