import jsyaml from 'js-yaml';
import p from 'path';

/**
 * Represents the data in {@link Storage}
 */
class Document {
    /**
     * @param {string} path - path to {@link Document} in {@link Storage}
     * @param {(object/string)} content - json or json string representation
     */
    constructor(path, content) {
        this.id = p.basename(path);
        this.type = p.dirname(path);
        this.path = path;
        if (typeof content === 'object') {
            content.id = undefined;
            delete content.id;
            this.data = content;
        } else {
            this.data = jsyaml.load(content);
            this.data.id = undefined;
            delete this.data.id;
        }
    }
    getPath() {
        return this.path;
    }
    toContentString() {
        return jsyaml.safeDump(this.data);
    }
    toJson() {
        let object = {};
        object.id = this.id;
        Object.assign(object, this.data);
        return object;
    }
}

export default Document;