import FileStorage from './storage/FileStorage';
import RestStorageManager from './RestStorageManager';


class FileCms {
    static getStorage(config) {
        const storage = new FileStorage(config);
        return new RestStorageManager(storage);
    }
}

export default FileCms;
