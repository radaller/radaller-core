import {
    _paginate,
    _applyFilter,
    _filter,
    _map,
    _reverse,
    _promiseAll
} from './StorageHelper';
import fs from 'fs-extra';
import p from 'path';
import Document from '../Document';
import DocumentCollection from '../DocumentCollection';
import Storage from './Storage';

class FileStorage extends Storage {
    constructor(config) {
        super();
        this.basePath = config.basePath;
    }

    fetchDocument(path) {
        return _readFile(this.basePath, path);
    }

    fetchDocumentCollection(type, query) {
        let {offset = 0, limit = 100, filter} = query;
        let total;
        return this
            .getDocumentList(type, filter)
            .then(documentPaths => {
                total = documentPaths.length;
                return documentPaths;
            })
            .then(_paginate(offset, limit))
            .then(_map(fileName => p.join(type, fileName)))
            .then(_promiseAll(path => _readFile(this.basePath, path)))
            .then(documents => {
                const collection = new DocumentCollection(documents, total);
                return collection.toJson();
            });
    }

    saveDocument(document) {
        const filePath = p.join(this.basePath, document.getPath());
        return fs.writeFile(filePath, document.toContentString(), 'utf8').then(() => {
            return document.getPath();
        });
    }

    deleteDocument(path) {
        return fs.unlink(p.join(this.basePath, path));
    }

    getDocumentList(type, filter = {}) {
        const dirPath = p.join(this.basePath, type);
        return fs
            .readdir(dirPath)
            .then(_filter(item => item.indexOf(".") > -1))
            .then(_reverse)
            .then(_applyFilter(filter));
    }
}

function _readFile(basePath, path) {
    return fs.readFile(p.join(basePath, path), 'utf8')
        .then(data => {
            const doc = new Document(path, data);
            return doc.toJson()
        });
}

export default FileStorage;

