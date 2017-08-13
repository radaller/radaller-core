const json2yaml = require('json2yaml');
const jsyaml = require('js-yaml');

class Abstract {
    get(path, query) {
        return this
            ._readFile(Abstract._getFileName(path))
            .then(Abstract._convertToObject)
            .catch(
                () => (
                    Promise.all([
                        this._readFilesFromDir(path, query),
                        this._getDirFilesPaths(path)
                    ])
                    .then(promises => (
                        {
                            items: promises[0].map(Abstract._convertToObject),
                            total: promises[1].length
                        }
                    ))
                )
            )
            .then(JSON.stringify);
    }

    post(path, data) {
        return this
            ._post(Abstract._getFileName(path), json2yaml.stringify(data))
            .then(JSON.stringify);
    }
    put(path, data) {
        data.id = undefined;
        return this
            ._put(Abstract._getFileName(path), json2yaml.stringify(data))
            .then(() => JSON.stringify(data));
    }
    delete(path) {
        return this
            ._delete(Abstract._getFileName(path));
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