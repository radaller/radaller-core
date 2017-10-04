import GitHubStorage from './storage/GitHubStorage';
import RestStorageManager from './RestStorageManager';
import GitHubAuth from './github/GitHubAuth';
import GitHubToken from './github/GitHubToken';
import GitHubApi from './github/GitHubApi';

/**
 * A Factory to create GitHub CMS components
 */
class GitHubCms {
    /**
     *
     * @param {StorageConfig} config - See {@link GitHubStorage}
     * @returns {RestStorageManager}
     */
    static getRestStorage(config) {
        const storage = new GitHubStorage(config);
        return new RestStorageManager(storage);
    }

    /**
     *
     * @returns {GitHubAuth}
     */
    static getAuth() {
        const token = new GitHubToken();
        return new GitHubAuth(token);
    }

    /**
     *
     * @param {Auth} auth
     * @returns {GitHubApi}
     */
    static getApi(auth) {
        return new GitHubApi(auth);
    }
}

export default GitHubCms;