import GitHubToken from './token';

export default class {
    constructor() {
        this.gitHubToken = new GitHubToken();
    }

    getAuthByToken(token) {
        return this.gitHubToken
            .getUserByToken(token)
            .getProfile()
            .then(response => {
                return {
                    username: response.data.login,
                    token: token
                };
            })
            .catch(e => {
                if (e.status !== 200) {
                    throw { message: 'Token is not valid.'};
                }
                throw e;
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
            .then(_checkTwoFactor)
            .then(response => {
                //TODO rewrite with ternary operation
                if (response.status === 422) {
                    response = this.gitHubToken
                        .deletePersonalTokenByNote(baseAuth, baseAuth.appName)
                        .then(() => {
                            return this.gitHubToken.generatePersonalToken(baseAuth);
                        })
                }
                return response;
            });
    }
}

function _checkTwoFactor(response) {
    const twoFactor = response.headers && response.headers.get('X-GitHub-OTP');
    if (response.status === 401 && twoFactor && twoFactor.indexOf("required") !== -1) {
        throw { status: response.status, twoFactor: true };
    } else if (response.status === 401) {
        throw { status: response.status, message: 'Credentials are not valid.'};
    }
    return response;
}
