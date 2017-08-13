const json2yaml = require('json2yaml');
const jsyaml = require('js-yaml');

class Abstract {
    get(path, query) {
        return this
            ._readFile(Abstract._getFileName(path))
            .then(Abstract._convertToObject)
            .catch(
                () => (
                    this._readFilesFromDir(path, query)
                    .then(contentList => contentList.map(Abstract._convertToObject))
                )
            )
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
    static _convertToObject(data) {
        let object = jsyaml.load(data.content);
        object.id = data.id;
        return object;
    }
    static _getFileName(path){
        return path + '.yaml';
    }
}

export default Abstract;