import GitHubToken from './token';

export default class {
    constructor() {
        this.gitHubToken = new GitHubToken();
    }

    authenticate(credentials) {
        let auth = null;
        if (typeof credentials === "string") {
            auth = this._authenticateByToken(credentials);
        } else {
            auth = this._authenticateByBaseAuth(credentials);
        }
        return auth;
    }

    _authenticateByToken(token) {
        return this.gitHubToken
            .getUserByToken(token)
            .getProfile()
            .catch(e => {
                if (e.status !== 200) {
                    throw { message: 'Token is not valid.'};
                }
                throw e;
            })
            .then(response => {
                return {
                    username: response.data.login,
                    token: token
                };
            });
    }

    _authenticateByBaseAuth(baseAuth) {
        return this._generatePersonalTokenIfNotExist(baseAuth)
            .then(response => {
                const data = response.json();
                return {
                    username: baseAuth.username,
                    token: data.token
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
