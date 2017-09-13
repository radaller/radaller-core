import p from 'path';
import pluralize from 'pluralize';
import Ajv from 'ajv';
import Document from './Document';

/**
 * Provides the REST operations to manage cms {@link Document} in {@link Storage}
 */
class RestStorageManager {
    /**
     * @param {Storage} storage - Document storage interface.
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Returns {@link Document} or {@link DocumentCollection} from {@link Storage}
     *
     * @param {string} path - Document path
     * @param {object} query - Http query parameters
     */
    get(path, query = {}) {
        return _isDocument(path)
            .then(_getOne(this.storage, path), _getMany(this.storage, path, query))
            .then(JSON.stringify);
    }

    /**
     * Updates the {@link Document} in {@link Storage}
     *
     * @param {string} path - Document path
     * @param {object|string} data - Json content to be saved.
     */
    put(path, data) {
        const document = new Document(path, data);
        return this.storage
            .saveDocument(document)
            .then(filePath => this.get(filePath));
    }

    /**
     * Updates the {@link Document} in {@link Storage}
     *
     * @param {string} path - path to {@link Document}
     * @param {object|string} data - Json content to be saved.
     */
    post(path, data) {
        return _getNewDocumentKey(this.storage, path)
            .then(createPath => {
                const document = new Document(createPath, data);
                return this.storage.saveDocument(document);
            })
            .then(newFilePath => {
                return this.get(newFilePath);
            });
    }

    /**
     * Removes the {@link Document} from {@link Storage}
     *
     * @param {string} path - path to {@link Document}
     */
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
}

export default RestStorageManager;

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
    const newFileName = `${id}_${pluralize.singular(folder)}.yaml`;
    return p.join(path, newFileName);
}