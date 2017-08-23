const fs = require('fs-extra');
const p = require('path');

export default () => {
    return class {
        constructor(config) {
            this.basePath = config.basePath;
        }

        fetchDocumentContent(path) {
            const absolutePath = p.join(this.basePath, path);
            return fs.readFile(absolutePath, 'utf8');
        }
    };
}