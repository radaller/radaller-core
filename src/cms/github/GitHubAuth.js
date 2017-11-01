import { GitHubTokenExistError } from './GitHubError';
/**
 * Defines the interface for CRUD operations on cms documents in storage
 */
class GitHubAuth {
    constructor(gitHubToken) {
        this.gitHubToken = gitHubToken;
    }

    getAuthByToken(token) {
        return this.gitHubToken
            .getUserProfile({token: token})
            .then(response => {
                return {
                    username: response.data.login,
                    token: token
                };
            });
    }

    getAuthByBaseAuth(baseAuth) {
        return this._generatePersonalTokenIfNotExist(baseAuth)
            .then(response => {
                return {
                    username: baseAuth.username,
                    token: response.data.token
                };
            });
    }

    _generatePersonalTokenIfNotExist(baseAuth) {
        return this.gitHubToken
            .generatePersonalToken(baseAuth, baseAuth.appName)
            .catch(error => {
                if (error instanceof GitHubTokenExistError) {
                    return this.gitHubToken
                        .deletePersonalTokenByNote(baseAuth, baseAuth.appName)
                        .then(() => {
                            return this.gitHubToken.generatePersonalToken(baseAuth);
                        })
                }
                throw error;
            });
    }
}

export default GitHubAuth;
