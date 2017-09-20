import FileStorage from './storage/FileStorage';
import PathResolver from './PathResolver';

class FileCli {
    static getClient(config) {
        const storage = new FileStorage(config);
        return new PathResolver(storage);
    }
}

export default FileCli;