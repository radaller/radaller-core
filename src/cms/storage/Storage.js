/**
 * Storage Interface
 */
class Storage {
    /**
     *
     * @param path
     */
    fetchDocument(path) {}

    /**
     *
     * @param type
     * @param query
     */
    fetchDocumentCollection(type, query) {}

    /**
     *
     * @param {Document} document
     */
    saveDocument(document) {}

    /**
     *
     * @param path
     */
    deleteDocument(path) {}

    /**
     *
     * @param type
     * @param filter
     */
    getDocumentList(type, filter = {}) {}
}

export default Storage;