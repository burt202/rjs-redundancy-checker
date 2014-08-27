<?php

class DirectoryScanner
{
  protected $pathToProject;
  protected $publicAssetDirPath;
  protected $extensions;
  protected $directoriesToIgnore;
  protected $filesToIgnore;

  public function __construct ($pathToProject, $publicAssetDirPath, $extensions, $directoriesToIgnore, $filesToIgnore) {
    $this->pathToProject = $pathToProject;
    $this->publicAssetDirPath = $publicAssetDirPath;
    $this->extensions = $extensions;
    $this->filesToIgnore = $filesToIgnore;

    $this->directoriesToIgnore = array_map(function ($dir) use ($publicAssetDirPath) {
      return $publicAssetDirPath . $dir;
    }, $directoriesToIgnore);
  }

  public function recursiveScan ($dir = null, $prefix = '') {
    if ($dir === null) {
      $dir = $this->pathToProject . $this->publicAssetDirPath;
    }

    $dir = rtrim($dir, '\\/');
    $result = array();

    foreach (scandir($dir) as $f) {
      if ($f === '.' || $f === '..') {
        continue;
      }

      $d = $dir . '/' . $f;
      if (is_dir($d) && !$this->directoryToIgnore($d)) {
       $result = array_merge($result, $this->recursiveScan($d, "$prefix$f/"));
      } else {
        if ($this->allowedExtension($f) && !$this->fileToIgnore($prefix . $f)) {
          $result[] = $this->publicAssetDirPath . $prefix . $f;
        }
      }
    }

    return $result;
  }

  private function fileToIgnore ($f) {
    return in_array($f, $this->filesToIgnore);
  }

  private function directoryToIgnore ($d) {
    $d = str_replace($this->pathToProject, '', $d);
    return in_array($d, $this->directoriesToIgnore);
  }

  private function allowedExtension ($f) {
    $ext = pathinfo($f, PATHINFO_EXTENSION);
    return in_array($ext, $this->extensions);
  }
}
