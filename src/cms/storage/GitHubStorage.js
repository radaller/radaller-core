import {
    _paginate,
    _applyFilter,
    _filter,
    _map,
    _reverse,
    _promiseAll
} from './StorageHelper';

import GitHubAPI from '../github/GitHubApi';
import Document from '../Document';
import DocumentCollection from '../DocumentCollection';
import p from 'path';
import Storage from './Storage';

/**
 * Uses GitHub to manage {@link Document}'s
 */
class GitHubStorage extends Storage {
    /**
     *
     * @param {object} config
     * @param {string} config.username
     * @param {string} config.token
     */
    constructor(config) {
        super();
        const gitConfig = {
            username: config.username,
            token: config.token
        };
        this.gh = new GitHubAPI(gitConfig);
        this.repo = this.gh.getRepo(_getFullRepoName(config));
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
}

function _getFullRepoName(config) {
    if (config.repository.indexOf("/") > -1) {
        return config.repository;
    } else {
        return `${config.username}/${config.repository}`;
    }
}

function _readFile(repo, path) {
    return repo
        .getContents('master', path, true)
        .then(response => {
            const doc = new Document(path, response.data);
            return doc.toJson()
        });
}

export default GitHubStorage;
