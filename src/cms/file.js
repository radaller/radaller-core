import Abstract from './abstract';
import {ClientFile} from '../client';

const fs = require('fs');
const p = require('path');
var jsyaml = require('js-yaml');

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
        return this.clientFile
            .get(path)
            .then(jsyaml.load);
    }

    _getMany(path, query) {
        return this
            ._getDirFilesPaths(path, query.offset, query.limit)
            .then(this._collectFilesContent);
    }

    _put(path, content) {
        //fs.writeFileSync(path, content);
    }

    _post(path, content) {
        //fs.writeFileSync(path, content);
    }

    _delete(path) {
        //fs.unlinkSync(path);
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
        var absolutePath = p.join(this.basePath, path);
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
            if(item.indexOf(".")>-1) {
                return item;
            }
        });
    }
}

export default File;