
const fs = require('fs-extra');
const p = require('path');

export default (Document) => {
    return class {
        constructor(config) {
            this.basePath = config.basePath;
        }

        fetchDocument(key) {
            return _readFile(this.basePath, key);
        }

        static getDocument(key, data) {
            return new Document(key, data);
        }

        getCollection(type, query) {
            let {offset = 0, limit = 100, filter} = query;
            return this
                .getDocumentList(type, filter)
                .then(_paginate(offset, limit))
                .then(_map(fileName => p.join(type, fileName)))
                .then(_collectDocuments(this.basePath));
        }

        saveDocument(document) {
            const filePath = p.join(this.basePath, document.getKey()) + '.yaml';
            return fs.writeFile(filePath, document.toSaveString(), 'utf8').then(() => {
                return document.getKey();
            });
        }

        deleteDocument(key) {
            const filePath = p.join(this.basePath, key) + '.yaml';
            return fs.unlink(filePath);
        }

        isDocument(key) {
            const filePath = p.join(this.basePath, key) + '.yaml';
            return fs.stat(filePath).then(_checkIsFile(key));
        }

        getDocumentList(type, filter = {}) {
            const dirPath = p.join(this.basePath, type);
            return fs
                .readdir(dirPath)
                .then(_filter(item => item.indexOf(".") > -1))
                .then(_reverse)
                .then(_map(_removeExtension))
                .then(_applyFilter(filter));
        }
    }
    function _readFile(basePath, key) {
        const absolutePath = p.join(basePath, key) + '.yaml';
        return fs.readFile(absolutePath, 'utf8')
            .then(data => {
                const doc = new Document(key, data);
                //console.log(doc);
                return doc.toPrettyObject()
            });
    }

    function _collectDocuments(basePath) {
        return (filesPaths) => {
            return Promise.all(
                filesPaths.map(filePath => _readFile(basePath, filePath))
            );
        }
    }
}

function _checkIsFile(key) {
    return stats => {
        return new Promise((resolve, reject) => {
            if (stats.isFile()) {
                resolve(key);
            } else {
                reject(key);
            }
        })
    }
}

function _applyFilter(filter = {}) {
    return fileNames => {
        if (filter.id !== undefined) {
            return fileNames.filter(fileName => filter.id.includes(fileName))
        }
        return fileNames;
    }
}

function _removeExtension(path) {
    return path.substring(0, path.indexOf("."));
}

function _paginate(offset, limit) {
    return array => array.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
}

function _map(lambda) {
    return array => array.map(lambda);
}

function _filter(lambda) {
    return array => array.filter(lambda);
}

function _reverse(array) {
    return array.reverse();
}