## rJS Redundancy Checker <sup>v0.2.0</sup>

This tool, cross-references your rJS ([requireJS optimiser](http://requirejs.org/docs/optimization.html)) build log with the public assets in your project and highlights which files are not being bundled and potentially not needed anymore. Useful if you want to keep redundancy in your codebase to a minimum. It comes with a set of configurable options which are explained below.

### Usage (requires NodeJS)

* change the options in `config.json` for you project
* run `node run.js`

### Options

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
        <td>relative path from project root to folder with public assets</td>
    </tr>
    <tr>
        <td>buildLogPath</td>
        <td>String (required)</td>
        <td>relative path from project root to rjs build log</td>
    </tr>
    <tr>
        <td>extensions</td>
        <td>Array (required)</td>
        <td>an array of file types to search for during scan for public assets</td>
    </tr>
    <tr>
        <td>directoriesToIgnore</td>
        <td>Array (required)</td>
        <td>an array of directories to ignore during scan for public assets</td>
    </tr>
    <tr>
        <td>filesToIgnore</td>
        <td>Array (required)</td>
        <td>an array of files to ignore during scan for public assets</td>
    </tr>
    <tr>
        <td>allFilePath</td>
        <td>String (required)</td>
        <td>relative path to location (including file name) to list all public assets</td>
    </tr>
    <tr>
        <td>usedFilePath</td>
        <td>String (required)</td>
        <td>relative path to location (including file name) to list used public assets</td>
    </tr>
    <tr>
        <td>unUsedFilePath</td>
        <td>String (required)</td>
        <td>relative path to location (including file name) to list unused public assets</td>
    </tr>
</table>

### Changelog

0.2.0 (31 Aug 2014)

* replaces PHP implementation with JavaScript as it just makes more sense seeing this is a JS tool

0.1.0 (28 Aug 2014)

* initial PHP implementation

### Suggestions, comments and queries welcome, send to aaron@burtdev.net