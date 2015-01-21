## rJS Redundancy Checker <sup>v0.3.0</sup>

This tool, cross-references your rJS ([requireJS optimiser](http://requirejs.org/docs/optimization.html)) build log with the public assets in your project and highlights which files are not being bundled and potentially not needed anymore. Useful if you want to keep redundancy in your codebase to a minimum. It comes with a set of configurable options which are explained below.

### Installation

`npm install rjs-redundancy-checker`

### Options Explained

<table>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>pathToProject</td>
        <td>String (required)</td>
        <td>absolute path to project root</td>
    </tr>
    <tr>
        <td>publicAssetDirPath</td>
        <td>String (required)</td>
        <td>relative path (from 'pathToProject') to folder with public assets</td>
    </tr>
    <tr>
        <td>buildLogPath</td>
        <td>String (required)</td>
        <td>relative path (from 'pathToProject') to rjs build log</td>
    </tr>
    <tr>
        <td>extensions</td>
        <td>Array (required)</td>
        <td>an array of file types (not including '.') to search for during scan for public assets</td>
    </tr>
    <tr>
        <td>directoriesToIgnore</td>
        <td>Array (optional) | Default = []</td>
        <td>an array of relative directory paths (from 'publicAssetDirPath') to ignore during scan for public assets</td>
    </tr>
    <tr>
        <td>filesToIgnore</td>
        <td>Array (optional) | Default = []</td>
        <td>an array of relative file paths (from 'publicAssetDirPath') to ignore during scan for public assets</td>
    </tr>
    <tr>
        <td>allFilePath</td>
        <td>String (optional) | Default = ""</td>
        <td>relative path to location (including file name) to list all public assets</td>
    </tr>
    <tr>
        <td>usedFilePath</td>
        <td>String (optional) | Default = ""</td>
        <td>relative path to location (including file name) to list used public assets</td>
    </tr>
    <tr>
        <td>unUsedFilePath</td>
        <td>String (optional) | Default = ""</td>
        <td>relative path to location (including file name) to list unused public assets</td>
    </tr>
    <tr>
        <td>disableConsoleLogs</td>
        <td>Bool (optional) | Default = false</td>
        <td>control whether to output info to console</td>
    </tr>
</table>

### Gotchas

* make sure the paths in the compiled rjs build log start from the same location as where you're running the tool from else you will end with it reporting that all files are redundant

### Changelog

0.3.0 (22 Jan 2015)

* adds package json
* converts rjs-redundancy-checker into a node package
* adds 'disableConsoleLogs' setting
* improves documentation
* splits example usage into separate directory

0.2.0 (31 Aug 2014)

* replaces PHP implementation with JavaScript as it just makes more sense seeing this is a JS tool

0.1.0 (28 Aug 2014)

* initial PHP implementation

### Suggestions, comments and queries welcome, send to aaron@burtdev.net