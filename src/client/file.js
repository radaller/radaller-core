import Abstract from './abstract';
const fs = require('fs');
const p = require('path');

class File extends Abstract {
    constructor(config) {
        super();
        this.basePath = config.basePath;
    }

    get(path) {
        var absolutePath = this._getAbsolutePath(path);
        return new Promise(function(resolve, reject) {
            fs.readFile(absolutePath, 'utf8', function(err, data){
                if (err) {
                    reject({message: "Requested resource doesn't exist."});
                } else {
                    resolve(data);
                }
            });
        });
    }

    _getAbsolutePath(path) {
        return p.join(this.basePath, path);
    }
}

export default File;