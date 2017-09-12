const p = require('path');
import axios from 'axios';

export default () => {
    return class {
        constructor(config) {
            this.basePath = config.basePath;
        }

        fetchDocumentContent(path) {
            const fullPath = this.basePath + p.sep + path;
            return axios(fullPath).then(res => res.text())
                .catch(e => {console.log(e)});
        }
    }
}