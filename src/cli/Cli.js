import refParser from 'json-schema-ref-parser';

class Cli {
    constructor(storage) {
        this.storage = storage;
    }

    resolve(path) {
        const pagePath = 'cms://' + path + '.yaml';
        return refParser
            .dereference(pagePath, _getResolvers(this.storage));
    }
}

function _getResolvers(storage) {
    return {
        resolve: {
            cms: _getCmsResolver(storage)
        }
    };
}

function _getCmsResolver(storage) {
    return {
        order: 1,
        canRead: /^cms:/i,
        read: (file) => {
            const path = file.url.substr('cms://'.length);
            return storage.fetchDocumentContent(path);
        }
    };
}

export default Cli;