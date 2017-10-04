/**
 * Provides the interface to manage documents in storage
 */
class Storage {
    /**
     *
     * @param {string} path
     * @return {Document}
     */
    fetchDocument(path) {}

    /**
     *
     * @param {string} path
     * @param {Object} query
     * @return {DocumentCollection}
     */
    fetchDocumentCollection(path, query) {}

    /**
     *
     * @param {Document} document
     * @return {Document}
     */
    saveDocument(document) {}

    /**
     *
     * @param {Document} document
     */
    deleteDocument(document) {}

    /**
     *
     * @param {string} path
     * @param {Object} filter
     */
    getDocumentList(path, filter = {}) {}
}

export default Storage;