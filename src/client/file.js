import Abstract from './abstract';
const fs = require('fs');
const p = require('path');
const sprintf = require("sprintf-js").sprintf;

class File extends Abstract {
    constructor(config) {
        super();
        this.basePath = config.basePath;
    }

    get(path) {
        var filePath = p.join(this.basePath, path);
        return new Promise(function(resolve, reject) {
            // var lstat = fs.lstatSync(filePath);
            // if (!lstat.isFile()) {
            //     throw sprintf("Requested path: %s is not a file.", filePath);
            // }
            fs.readFile(filePath, 'utf8', function(err, data){
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

export default File;