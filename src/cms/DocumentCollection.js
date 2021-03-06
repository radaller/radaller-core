/**
 * Represents the list of {@link Document}'s
 */
class DocumentCollection {
    constructor(documents, total) {
        this.documents = documents;
        this.total = total;
    }
    toJson() {
        let object = {};
        object.total = this.total;
        object.items = this.documents;
        return object;
    }
}

export default DocumentCollection;