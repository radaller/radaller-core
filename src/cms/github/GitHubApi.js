import GitHubAPI from 'github-api';

/**
 * A wrapper for {@link http://github-tools.github.io/github/docs/3.1.0/GitHub.html|GitHubAPI}
 */
class GitHubApi extends GitHubAPI {
    /**
     * Either a username and password or an oauth token for Github
     * @typedef {Object} Auth
     * @prop {string} username - the Github username
     * @prop {string} password - the user's password
     * @prop {token} token - an OAuth token
     */
    /**
     *
     * @param {Auth} auth
     */
    constructor(auth) {
        const gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
        super(auth, gitHibAPIUrl);
    }
}

export default GitHubApi;