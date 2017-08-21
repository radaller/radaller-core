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

    _readFiles(path, query) {
        let {offset=0, limit=100, filter} = query;
        return this
            ._getFilePathsByFilter(path, filter)
            .then(this._paginate(offset, limit))
            .then(this._joinPath(path))
            .then(this._collectFilesContent);
    }

    _writeToFile(filePath, content) {
        const absolutePath = this.clientFile._getAbsolutePath(filePath);
        return fs.writeFile(absolutePath, content, 'utf8').then(() => filePath);
    }

    _deleteFile(path) {
        const absolutePath = this.clientFile._getAbsolutePath(path);
        return fs.unlink(absolutePath);
    }

    _getFilePathsByFilter(path, filter) {
        return this
            ._getDirFilesPaths(path)
            .then(File._arrayReverse)
            .then(this._applyFilter(filter))
    }

    _isFile(filePath) {
        const absolutePath = this.clientFile._getAbsolutePath(filePath);
        return fs.stat(absolutePath).then(this._checkIsFile(filePath));
    }

    _checkIsFile(filePath) {
        return stats => {
            return new Promise((resolve, reject) => {
                if (stats.isFile()) {
                    resolve(filePath);
                } else {
                    reject(filePath);
                }
            })
        }
    }

    _collectFilesContent(filesPaths) {
        return Promise.all(
            filesPaths.map(filePath => this._readFile(filePath))
        );
    }

    static _arrayReverse(array) {
        return array.reverse();
    }

    _applyFilter(filter = {}) {
        return fileNames => {
            if (filter.id !== undefined) {
                return fileNames.filter(fileName => filter.id.includes(Abstract._removeFileExtension(fileName)))
            }
            return fileNames;
        }
    }

    _paginate(offset, limit) {
        return fileNames => fileNames.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    }

    _getDirFilesPaths(path) {
        let absolutePath = this.clientFile._getAbsolutePath(path);
        return fs.readdir(absolutePath).then(File._filterFiles);
    }

    _joinPath(path) {
        return fileNames => fileNames.map(fileName => p.join(path, fileName));
    }

    static _filterFiles(dirItems) {
        return dirItems.filter(item => item.indexOf(".") > -1);
    }
}

export default File;