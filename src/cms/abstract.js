class Abstract {
    get(path, query) {
        var $this = this;
        return this
            ._get(this._getResouceName(path))
            .catch(function() {
                return $this._getMany(path, query);
            })
            .then(JSON.stringify);
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
    _getResouceName(path){
        return path + '.yaml';
    }
}

export default Abstract;