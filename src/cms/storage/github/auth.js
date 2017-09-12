import { TokenExistError } from './error';
export default class {
    constructor(gitHubToken) {
        this.gitHubToken = gitHubToken;
    }

    getAuthByToken(token) {
        return this.gitHubToken
            .getUserProfileByToken(token)
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
            .generatePersonalToken(baseAuth)
            .catch(error => {
                if (error instanceof TokenExistError) {
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
