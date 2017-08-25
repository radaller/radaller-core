import {
    _paginate,
    _applyFilter,
    _filter,
    _map,
    _reverse,
    _promiseAll
} from './helper';

const GitHubAPI = require('github-api');
const p = require('path');

export default (Document, DocumentCollection) => {
    return class {
        constructor(config) {
            this.gh = new GitHubAPI({
                username: config.username,
                token: config.token
            });
            this.repo = this.gh.getRepo(config.owner, config.repository);
        }

        fetchDocument(path) {
            return _readFile(this.repo, path);
        }
        
        fetchDocumentCollection(path, query) {
            let {offset = 0, limit = 100, filter} = query;
            let total;
            return this
                .getDocumentList(path, filter)
                .then(documentPaths => {
                    total = documentPaths.length;
                    return documentPaths;
                })
                .then(_paginate(offset, limit))
                .then(_map(fileName => p.join(path, fileName)))
                .then(_promiseAll(path => _readFile(this.repo, path)))
                .then(documents => {
                    const collection = new DocumentCollection(documents, total);
                    return collection.toJson();
                });
        }

        getDocumentList(path, filter = {}) {
            return this.repo
                .getContents('master', path, true)
                .then(response => response.data)
                .then(_filter(item => item.type === "file"))
                .then(_reverse)
                .then(_map(item => item.name))
                .then(_applyFilter(filter));
        }

        static getDocument(path, data) {
            return new Document(path, data);
        }
    };

    function _readFile(repo, path) {
        return repo
            .getContents('master', path, true)
            .then(response => {
                const doc = new Document(path, response.data);
                return doc.toJson()
            });
    }
}