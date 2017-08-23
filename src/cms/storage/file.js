
const fs = require('fs-extra');
const p = require('path');

export default (Document, DocummentCollection) => {
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

        fetchDocumentCollection(type, query) {
            let {offset = 0, limit = 100, filter} = query;
            let total;
            return this
                .getDocumentList(type, filter)
                .then(documentKeys => {
                    total = documentKeys.length;
                    return documentKeys;
                })
                .then(_paginate(offset, limit))
                .then(_map(fileName => p.join(type, fileName)))
                .then(_collectDocuments(this.basePath))
                .then(documents => {
                    const collection = new DocummentCollection(documents, total);
                    return collection.toPrettyObject();
                });
        }

        saveDocument(document) {
            const filePath = _getFilePath(this.basePath, document.getKey());
            return fs.writeFile(filePath, document.toContentString(), 'utf8').then(() => {
                return document.getKey();
            });
        }

        deleteDocument(key) {
            return fs.unlink(_getFilePath(this.basePath, key));
        }

        isDocument(key) {
            return fs.stat(_getFilePath(this.basePath, key)).then(_checkIsFile(key));
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
    };

    function _readFile(basePath, key) {
        return fs.readFile(_getFilePath(basePath, key), 'utf8')
            .then(data => {
                const doc = new Document(key, data);
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

    function _getFilePath(basePath, key) {
        return p.join(basePath, key) + '.yaml';
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