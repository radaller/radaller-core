import Abstract from './abstract';
import {ClientFile} from '../client';

const fs = require('fs');
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

    _get(path) {
        return this.clientFile.get(path);
    }

    _getMany(path, query) {
        return this
            ._getDirFilesPaths(path, query.offset, query.limit)
            .then(this._collectFilesContent);
    }

    _put(path, content) {
        var absolutePath = this.clientFile._getAbsolutePath(path);
        return this._writeToFile(absolutePath, content);
    }

    _post(path, content) {
        var absolutePath = this.clientFile._getAbsolutePath(path);
        return this._writeToFile(absolutePath, content);
    }

    _delete(path) {
        return new Promise(function(resolve, reject) {
            fs.unlink(path, (err) => {
                if (err) {
                    reject(err);
                }
            })
        });
    }

    _writeToFile(filePath, content) {
        return new Promise(function(resolve, reject) {
            fs.writeFile(filePath, content, 'utf8' , (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    }

    _collectFilesContent(filesPaths) {
        const self = this;
        return Promise.all(
            filesPaths.map(function (filePath) {
                return self._get(filePath);
            })
        );
    }

    _getDirFilesPaths(path, offset, limit) {
        var absolutePath = this.clientFile._getAbsolutePath(path);
        return new Promise(function(resolve, reject){
            fs.readdir(absolutePath, function(err, dirData){
                if (err) {
                    reject({
                        message: "Requested resource doesn't exist."
                    });
                } else {
                    resolve(dirData);
                }
            })
        })
        .then(this._getFiles)
        .then(function(fileNames) {
            return fileNames.slice(parseInt(offset) - 1, parseInt(offset) + parseInt(limit) - 1);
        })
        .then(function(fileNames) {
            return fileNames.map(function (fileName) {
                return p.join(path, fileName)
            });
        });
    }

    _getFiles(dirItems) {
        return dirItems.filter(function (item) {
            if(item.indexOf(".") > -1) {
                return item;
            }
        });
    }
}

export default File;