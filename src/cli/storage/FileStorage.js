import fs from 'fs-extra';
import p from 'path';

class FileStorage {
    constructor(config) {
        this.basePath = config.basePath;
    }

    fetchDocumentContent(path) {
        const absolutePath = p.join(this.basePath, path);
        return fs.readFile(absolutePath, 'utf8');
    }
}

export default FileStorage