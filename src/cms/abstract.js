const jsyaml = require('js-yaml');
const p = require('path');
const pluralize = require('pluralize');
const sprintf = require("sprintf-js").sprintf;
const Ajv = require('ajv');

const GET_PATHS_TO_ITEMS = 0;
const GET_ITEMS_TOTAL = 1;

class Abstract {
    get(path, query) {
        return this
            ._isFile(Abstract._addFileExtension(path))
            .then(this._getOne(path), this._getMany(path, query))
            .then(JSON.stringify);
    }

    _getOne(path) {
        return () => (
            this._readFile(Abstract._addFileExtension(path)).then(Abstract._convertToObject)
        );
    }

    _getMany(path, query) {
        return () => {
            const promisesForGetMany = [];
            promisesForGetMany[GET_PATHS_TO_ITEMS] = this._readFiles(path, query);
            promisesForGetMany[GET_ITEMS_TOTAL] = this._getFilePathsByFilter(path, query.filter);
            return Promise.all(promisesForGetMany)
                .then(promises => (
                    {
                        total: promises[GET_ITEMS_TOTAL].length,
                        items: promises[GET_PATHS_TO_ITEMS].map(Abstract._convertToObject)
                    }
                ))
        };
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
            .then(createPath => {
                return this._writeToFile(Abstract._addFileExtension(createPath), jsyaml.safeDump(data));
            })
            .then((newFilePath) => {
                return this.get(Abstract._removeFileExtension(newFilePath), {});
            });
    }

    validate(path, data) {
        const schemaPath = Abstract._getPathToSchema(path);
        return this
            ._readFile(Abstract._addFileExtension(schemaPath))
            .then(Abstract._convertToObject)
            .then((schema) => {
                const ajv = new Ajv();
                const validate = ajv.compile(schema);
                const valid = validate(data);
                if (!valid) {
                    throw {message: "Data is not valid", err: validate.errors};
                }
                return true;
            });
    }

    static _getPathToSchema(path) {
        const schemaName =p.dirname(path).replace('/', '_');
        return p.join('schemas', schemaName);
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