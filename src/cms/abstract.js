const jsyaml = require('js-yaml');
const p = require('path');
const pluralize = require('pluralize');
const sprintf = require("sprintf-js").sprintf;

class Abstract {
    get(path, query) {
        return this
            ._readFile(Abstract._addFileExtension(path))
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

    put(path, data) {
        data.id = undefined;
        delete data.id;
        return this
            ._writeToFile(Abstract._addFileExtension(path), jsyaml.safeDump(data))
            .then(() => this.get(path, {}));
    }

    post(path, data) {
        return this
            ._generateNewFileName(path)
            .then(createPath => this._writeToFile(Abstract._addFileExtension(createPath), jsyaml.safeDump(data)))
            .then((newFilePath) => this.get(Abstract._removeFileExtension(newFilePath), {}));
    }

    remove(path) {
        return this
            ._deleteFile(Abstract._addFileExtension(path))
            .then(() => ({id: p.basename(path)}))
            .then(JSON.stringify);
    }

    static _convertToObject(data) {
        let object = jsyaml.load(data.content);
        object.id = data.id;
        return object;
    }

    static _addFileExtension(path){
        return path + '.yaml';
    }

    static _removeFileExtension(path) {
        return path.substring(0, path.indexOf("."));
    }

    _generateNewFileName(path) {
        return this
            ._getDirFilesPaths(path)
            .then(files => files.length)
            .then(filesAmount => Abstract._getNewFileName(filesAmount + 1, path));
    }

    static _getNewFileName(id, path) {
        const folder = p.basename(path);
        const newFileName = sprintf('%s_%s', id, pluralize.singular(folder));
        return p.join(path, newFileName);
    }
}

export default Abstract;