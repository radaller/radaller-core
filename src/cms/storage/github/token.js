const GitHubAPIUser = require('github-api/dist/components/User');
const Base64 = require('js-base64').Base64;

export default class {
    constructor() {
        this.gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
    }

    getUserByToken(token) {
        return new GitHubAPIUser(null, {token: token}, this.gitHibAPIUrl);
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
        return fetch(`${this.gitHibAPIUrl}/authorizations`, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify({
                "scopes": [
                    "public_repo"
                ],
                "note": baseAuth.appName
            })
        })
        .then(_formatResponse);
    }

    getPersonalTokens(baseAuth) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return fetch(`${this.gitHibAPIUrl}/authorizations`, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        })
        .then(_formatResponse);
    }

    deletePersonalTokenById(baseAuth, tokenId) {
        let headers = _getBaseAuthHeaders(baseAuth);
        return fetch(`${this.gitHibAPIUrl}/authorizations/${tokenId}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: headers
        })
        .then(_formatResponse);
    }
}

function _formatResponse(response) {
    return {
        data: response.json(),
        status: response.status,
        headers: response.headers,
        response: response
    };
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
