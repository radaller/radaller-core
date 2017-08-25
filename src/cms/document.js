const jsyaml = require('js-yaml');
const p = require('path');

export default class Document {
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