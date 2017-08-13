import Abstract from './abstract';
import {ClientFile} from '../client';

const fs = require('fs-extra');
const p = require('path');

class File extends Abstract {
    constructor(config) {
        super();
        this.basePath = config.basePath;
        this.clientFile = new ClientFile({
            basePath: config.basePath
        });
        this._collectFilesContent = this._collectFilesContent.bind(this);
    }

    _readFile(path) {
        return this.clientFile.get(path);
    }

    _readFilesFromDir(path, query) {
        return this
            ._getDirFilesPathsByPage(path, query.offset, query.limit)
            .then(this._collectFilesContent);
    }

    _put(path, content) {
        const absolutePath = this.clientFile._getAbsolutePath(path);
        return this._writeToFile(absolutePath, content);
    }

    _post(path, content) {
        const absolutePath = this.clientFile._getAbsolutePath(path);
        return this._writeToFile(absolutePath, content);
    }

    _delete(path) {
        return fs.unlink(path);
    }

    _writeToFile(filePath, content) {
        return fs.writeFile(filePath, content, 'utf8');
    }

    _collectFilesContent(filesPaths) {
        return Promise.all(
            filesPaths.map(filePath => this._readFile(filePath))
        );
    }

    _getDirFilesPathsByPage(path, offset = 0, limit = 100) {
        return this._getDirFilesPaths(path)
            .then(
                fileNames => fileNames.slice(parseInt(offset), parseInt(offset) + parseInt(limit))
            )
            .then(
                fileNames => fileNames.map(fileName => p.join(path, fileName))
            );
    }

    _getDirFilesPaths(path) {
        let absolutePath = this.clientFile._getAbsolutePath(path);
        return fs.readdir(absolutePath)
            .then(File._filterFiles)
    }

    static _filterFiles(dirItems) {
        return dirItems.filter(item => item.indexOf(".") > -1);
    }
}

export default File;