import Abstract from './abstract';
import {ClientFile} from '../client';

const fs = require('fs');

class File extends Abstract {
    constructor(config) {
        super();
        this.basePath = config.basePath;
        this.clientFile = new ClientFile({
            basePath: config.basePath
        });
    }
    _get(path) {
        return this.clientFile.get(path);
    }
    _put(path, content) {
        //fs.writeFileSync(path, content);
    }

    _post(path, content) {
        //fs.writeFileSync(path, content);
    }

    _delete(path) {
        //fs.unlinkSync(path);
    }
}

export default File;