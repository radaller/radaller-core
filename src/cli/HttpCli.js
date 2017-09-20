import HttpStorage from './storage/HttpStorage';
import PathResolver from './PathResolver';

class HttpCli {
    static getClient(config) {
        const storage = new HttpStorage(config);
        return new PathResolver(storage);
    }
}

export default HttpCli;