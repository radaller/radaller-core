const jsyaml = require('js-yaml');
const p = require('path');

export default class Document {
    constructor(key, content) {
        this.id = p.basename(key);
        this.type = p.dirname(key);
        this.key = key;
        if (typeof content === 'object') {
            content.id = undefined;
            delete content.id;
            this.data = content;
        } else {
            this.data = jsyaml.load(content);
        }
    }
    getKey() {
        return this.key;
    }
    toContentString() {
        return jsyaml.safeDump(this.data);
    }
    toPrettyObject() {
        let object = {};
        object.id = this.id;
        Object.assign(object, this.data);
        return object;
    }
}