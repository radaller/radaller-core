import FileStorage from './storage/FileStorage';
import Cli from './Cli';

class FileCli {
    static getClient(config) {
        const storage = new FileStorage(config);
        return new Cli(storage);
    }
}

export default FileCli;