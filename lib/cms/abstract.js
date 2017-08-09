class Abstract {
    get(path) {
        return this._get(path);
    }
    post(path, content) {
        return this._post(path, content);
    }
    put(path, content) {
        return this._put(path, content);
    }
    delete(path) {
        return this._delete(path);
    }
}

export default Abstract;