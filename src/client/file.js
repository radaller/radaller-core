import Abstract from './abstract';
const fs = require('fs-extra');
const p = require('path');

class File extends Abstract {
    constructor(config) {
        super();
        this.basePath = config.basePath;
    }

    get(path) {
        const absolutePath = this._getAbsolutePath(path);
        return fs.readFile(absolutePath, 'utf8')
            .then(data => ({id: File._getFileId(path), content: data}));
    }

    _getAbsolutePath(path) {
        return p.join(this.basePath, path);
    }

    static _getFileId(path){
        return p.basename(path, '.yaml');
    }
}

export default File;