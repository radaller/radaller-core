import {TokenExistError, TwoFactorError, UnauthorisedError} from './error';
import axios from 'axios';

const GitHubAPIUser = require('github-api/dist/components/User');
const Base64 = require('js-base64').Base64;

export default class {
    constructor() {
        this.gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
    }

    getUserProfileByToken(token) {
        return new GitHubAPIUser(null, {token: token}, this.gitHibAPIUrl)
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

    generatePersonalToken(baseAuth) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations`,
            method: 'POST',
            headers: headers,
            data: {
                "scopes": [
                    "public_repo"
                ],
                "note": baseAuth.appName
            }
        })
        .catch(_throwCustomException);
    }

    getPersonalTokens(baseAuth) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations`,
            method: 'GET',
            headers: headers
        })
        .catch(_throwCustomException);
    }

    deletePersonalTokenById(baseAuth, tokenId) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return axios({
            url: `${this.gitHibAPIUrl}/authorizations/${tokenId}`,
            method: 'DELETE',
            headers: headers
        })
        .catch(_throwCustomException);
    }
}

function _throwCustomException(error) {
    const response = error.response;
    const twoFactor = response.headers && response.headers['x-github-otp'];
    if (response.status === 401 && twoFactor && twoFactor.indexOf("required") !== -1) {
        throw new TwoFactorError(response);
    } else if (response.status === 401) {
        throw new UnauthorisedError(response);
    } else if (response.status === 422) {
        throw new TokenExistError(response);
    } else {
        throw error;
    }
}

function _getBaseAuthHeaders({username, password, twoFactorCode}) {
    let headers = {};
    headers["Content-Type"] = "application/json";
    const encodedBaseAuth = Base64.encode(`${username}:${password}`);
    headers["Authorization"] = `Basic ${encodedBaseAuth}`;
    if (twoFactorCode) {
        headers["X-GitHub-OTP"] = twoFactorCode;
    }
    return headers;
}

function _findToken(tokens, note) {
    return tokens.find(token => token.note === note);
}
