import HttpStorage from './storage/HttpStorage';
import Cli from './Cli';

class HttpCli {
    static getClient(config) {
        const storage = new HttpStorage(config);
        return new Cli(storage);
    }
}

export default HttpCli;