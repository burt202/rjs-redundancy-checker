<?php

class BuildLogParser
{
  protected $pathToProject;
  protected $publicAssetDirPath;
  protected $buildLogPath;
  protected $directoriesToIgnore;

  public function __construct ($pathToProject, $publicAssetDirPath, $buildLogPath, $directoriesToIgnore) {
    $this->pathToProject = $pathToProject;
    $this->publicAssetDirPath = $publicAssetDirPath;
    $this->buildLogPath = $buildLogPath;

    $this->directoriesToIgnore = array_map(function ($dir) use ($publicAssetDirPath) {
      return $publicAssetDirPath . $dir;
    }, $directoriesToIgnore);
  }

  public function parse () {
    $logLines = file($this->pathToProject . $this->buildLogPath, FILE_IGNORE_NEW_LINES);
    $usedFiles = array_slice($logLines, $this->getStartingIndex($logLines));

    $usedFiles = $this->filterFiles($usedFiles);
    $usedFiles = $this->formatFiles($usedFiles);

    return $usedFiles;
  }

  private function getStartingIndex ($lines) {
    $index = -1;

    foreach ($lines as $line) {
      $index++;
      if ($line === '----------------') {
        break;
      }
    }

    return $index + 1;
  }

  private function filterFiles ($files) {
    return array_filter($files, function ($file) {
      $excludeDir = false;
      $file = str_replace($this->pathToProject, '', $file);

      foreach ($this->directoriesToIgnore as $dir) {
        if (substr($file, 0, strlen($dir)) === $dir) {
          $excludeDir = true;
        }
      }

      if ($excludeDir) {
        return false;
      }

      if ($file === '') {
        return false;
      }

      return true;
    });
  }

  private function formatFiles ($files) {
    return array_map(function ($file) {
      $parts = explode('/', $file);
      $resolved = array();

      foreach ($parts as $part) {
        if ($part === '..') {
          array_pop($resolved);
          continue;
        } else {
          array_push($resolved, $part);
        }
      }

      $file = implode('/', $resolved);

      $path = str_replace(array($this->pathToProject, 'text!'), array('', $this->publicAssetDirPath), $file);
      return $path;
    }, $files);
  }
}
