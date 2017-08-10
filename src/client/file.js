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
            fs.readFile(filePath, 'utf8', function(err, data){
                if (err) {
                    reject({message: "Requested resource doesn't exist."});
                } else {
                    resolve(data);
                }
            });
        });
    }
}

export default File;