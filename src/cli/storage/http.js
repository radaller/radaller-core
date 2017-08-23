const p = require('path');
const fetch = require('node-fetch');

export default () => {
    return class {
        constructor(config) {
            this.basePath = config.basePath;
        }

        fetchDocumentContent(path) {
            const fullPath = this.basePath + p.sep + path;
            return fetch(fullPath).then(res => res.text())
                .catch(e => {console.log(e)});
        }
    }
}