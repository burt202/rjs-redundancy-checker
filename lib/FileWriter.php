<?php

class FileWriter
{
  protected $file;
  protected $content;

  public function __construct ($file, $content) {
    $this->file = $file;
    $this->content = $content;
  }

  public function write () {
    $fh = fopen($this->file, 'w');

    foreach ($this->content as $file) {
      fwrite($fh, "$file\n");
    }

    fclose($fh);
  }
}
