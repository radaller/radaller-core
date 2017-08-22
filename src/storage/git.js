import {ClientFile} from '../client';

class Git extends ClientFile {
    constructor(config) {
        super(config);
    }

    _post(path, content) {
        super._post(path, content);
        this._commit();
        this._gitPush();
    }
    _put(path, content) {
        super._put(path, content);
        this._commit();
        this._gitPush();
    }
    _delete(path) {
        super._deleteFile(path);
        this._commit();
        this._gitPush();
    }
    _commit() {
        //TODO
    }
    _gitPush() {
        //TODO
    }
}

export default Git;