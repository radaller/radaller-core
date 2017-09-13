import axios from 'axios';

class HttpStorage {
    constructor(config) {
        this.basePath = config.basePath;
    }

    fetchDocumentContent(path) {
        const fullPath = `${this.basePath}/${path}`;
        return axios(fullPath)
            .then(response => response.data)
            .catch(error => {console.log(error)});
    }
}

export default HttpStorage;