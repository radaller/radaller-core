import Abstract from './abstract';
const p = require('path');
var fetch = require('node-fetch');

class Http extends Abstract{
    constructor(config) {
        super();
        this.basePath = config.basePath;
    }

    _resolve(path) {
        var path = path.substr('cms://'.length);
        var fullPath = this.basePath + p.sep + path;
        return fetch(fullPath).then(res => res.text());
    }

}

export default Http;