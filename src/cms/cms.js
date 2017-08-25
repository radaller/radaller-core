const p = require('path');
const pluralize = require('pluralize');
const sprintf = require("sprintf-js").sprintf;
const Ajv = require('ajv');

export default (Storage) => {
    return class Cms {
        constructor(config) {
            this.storage = new Storage(config);
        }
        get(path, query = {}) {
            return _isDocument(path)
                .then(_getOne(this.storage, path), _getMany(this.storage, path, query))
                .then(JSON.stringify);
        }
        put(path, data) {
            const document = Storage.getDocument(path, data);
            return this.storage
                .saveDocument(document)
                .then(filePath => this.get(filePath));
        }
        post(path, data) {
            return _getNewDocumentKey(this.storage, path)
                .then(createPath => {
                    const document = Storage.getDocument(createPath, data);
                    return this.storage.saveDocument(document);
                })
                .then(newFilePath => {
                    return this.get(newFilePath);
                });
        }
        remove(path) {
            return this.storage
                .deleteDocument(path)
                .then(() => ({id: p.basename(path)}))
                .then(JSON.stringify);
        }
        validate(path, data) {
            const schemaPath = _getPathToSchema(path);
            return this.storage
                .fetchDocument(schemaPath)
                .then((schema) => {
                    const ajv = new Ajv();
                    const validate = ajv.compile(schema);
                    const valid = validate(data);
                    if (!valid) {
                        throw {message: "Data is not valid", err: validate.errors};
                    }
                    return true;
                });
        }
    };
}

function _isDocument(path) {
    return new Promise((resolve, reject) => {
        path.indexOf(".") > -1 ? resolve() : reject();
    });
}

function _getOne(storage, path) {
    return () => storage.fetchDocument(path);
}

function _getMany(storage, path, query) {
    return () => storage.fetchDocumentCollection(path, query);
}

function _getPathToSchema(path) {
    const schemaName = p.dirname(path).replace('/', '_') + '.yaml';
    return p.join('schemas', schemaName);
}

function _getNewDocumentKey(storage, path) {
    return storage
        .getDocumentList(path)
        .then(files => files.length)
        .then(filesAmount => _getNewFileName(filesAmount + 1, path));
}

function _getNewFileName(id, path) {
    const folder = p.basename(path);
    const newFileName = sprintf('%s_%s.yaml', id, pluralize.singular(folder));
    return p.join(path, newFileName);
}