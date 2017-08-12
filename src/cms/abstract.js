const json2yaml = require('json2yaml');
const jsyaml = require('js-yaml');

class Abstract {
    get(path, query) {
        const self = this;
        return this
            ._get(this._getResourceName(path))
            .then(jsyaml.load)
            .catch(function() {
                return self
                    ._getMany(path, query)
                    .then(function(contentList) {
                        return contentList.map(jsyaml.load);
                    });
            })
            .then(JSON.stringify);
    }
    post(path, data) {
        return this
            ._post(path, json2yaml.stringify(data))
            .then(JSON.stringify);
    }
    put(path, data) {
        return this
            ._put(path, json2yaml.stringify(data))
            .then(JSON.stringify);
    }
    delete(path) {
        return this
            ._delete(path);
    }
    _getResourceName(path){
        return path + '.yaml';
    }
}

export default Abstract;