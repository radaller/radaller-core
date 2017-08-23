export default class DocumentCollection {
    constructor(documents, total) {
        this.documents = documents;
        this.total = total;
    }
    toPrettyObject() {
        let object = {};
        object.total = this.total;
        object.items = this.documents;
        return object;
    }
}