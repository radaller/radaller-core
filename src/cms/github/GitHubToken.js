import {GitHubTokenExistError, GitHubTwoFactorError, GitHubUnauthorisedError} from './GitHubError';
import axios from 'axios';

import GitHubAPIUser from 'github-api/dist/components/User';

/**
 * Provides functionality to manages github access tokens
 */
class GitHubToken {
    constructor() {
        this.gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
    }

    /**
     *
     * @param {Auth} auth
     * @throws {GitHubTwoFactorError}
     * @throws {GitHubUnauthorisedError}
     */
    getUserProfile(auth) {
        return new GitHubAPIUser(null, auth, this.gitHibAPIUrl)
            .getProfile()
            .catch(_throwCustomException);
    }

    deletePersonalTokenByNote(baseAuth, note) {
        return this
            .getPersonalTokens(baseAuth)
            .then(response => response.data)
            .then(tokens => {
                let deletePromise = Promise.resolve();
                const token = _findToken(tokens, note);
                if (token) {
                    deletePromise = this.deletePersonalTokenById(baseAuth, token.id)
                }
                return deletePromise
            });
    }

    generatePersonalToken(baseAuth, note) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations`,
            method: 'POST',
            headers: headers,
            auth: _getBaseAuth(baseAuth),
            data: {
                "scopes": [
                    "public_repo"
                ],
                "note": note
            }
        })
        .catch(_throwCustomException);
    }

    getPersonalTokens(baseAuth) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations`,
            method: 'GET',
            headers: headers,
            auth: _getBaseAuth(baseAuth),
        })
        .catch(_throwCustomException);
    }

    deletePersonalTokenById(baseAuth, tokenId) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations/${tokenId}`,
            method: 'DELETE',
            headers: headers,
            auth: _getBaseAuth(baseAuth),
        })
        .catch(_throwCustomException);
    }
}

function _throwCustomException(error) {
    const response = error.response;
    const twoFactor = response.headers && response.headers['x-github-otp'];
    if (response.status === 401 && twoFactor && twoFactor.indexOf("required") !== -1) {
        throw new GitHubTwoFactorError(response);
    } else if (response.status === 401) {
        throw new GitHubUnauthorisedError(response);
    } else if (response.status === 422) {
        throw new GitHubTokenExistError(response);
    } else {
        throw error;
    }
}

function _getBaseAuth({username, password}) {
    return {username: username, password: password};
}

function _getBaseAuthHeaders({twoFactorCode}) {
    let headers = {};
    headers["Content-Type"] = "application/json";
    if (twoFactorCode) {
        headers["X-GitHub-OTP"] = twoFactorCode;
    }
    return headers;
}

function _findToken(tokens, note) {
    return tokens.find(token => token.note === note);
}

export default GitHubToken;
