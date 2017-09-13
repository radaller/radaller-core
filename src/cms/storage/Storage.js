class Storage {
    fetchDocument(path) {}

    fetchDocumentCollection(type, query) {}

    saveDocument(document) {}

    deleteDocument(path) {}

    getDocumentList(type, filter = {}) {}
}

export default Storage;