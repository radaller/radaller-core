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
     * Returns the instance of {@link RestStorageManager} for {@link GitHubStorage}
     *
     * @param {object} config - See {@link GitHubStorage}
     * @returns {RestStorageManager}
     */
    static getRestStorage(config) {
        const storage = new GitHubStorage(config);
        return new RestStorageManager(storage);
    }

    /**
     * Returns instance to manage github authorisations
     *
     * @returns {GitHubAuth}
     */
    static getAuth() {
        const token = new GitHubToken();
        return new GitHubAuth(token);
    }

    /**
     *
     * @param {object} auth
     * @param {string} auth.username - The username of github user
     * @param {string} auth.token - Github token.
     * @param {string} auth.password - Github password.
     * @returns {GitHubApi}
     */
    static getApi(auth) {
        return new GitHubApi(auth);
    }
}

export default GitHubCms;