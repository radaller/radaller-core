'use strict';

import GitHubToken from '../../../src/cms/github/GitHubToken';
import {GitHubUnauthorisedError, GitHubTwoFactorError} from '../../../src/cms/github/GitHubError';

import axios from 'axios';
jest.mock('axios');

const gitHubToken = new GitHubToken();

const tokens = {
    data: [
        {
            "id": 1,
            "token": "",
            "note": "Some Application"
        },
        {
            "id": 2,
            "token": "",
            "note": "Radaller CMS"
        },
    ]
};

const newToken = {
    data: {
        "id": 2,
        "token": "valid_token",
        "note": "Radaller CMS"
    }
};

const paths = {
    "https://api.github.com/authorizations": {
        "GET": tokens,
        "POST": newToken
    },
    "https://api.github.com/authorizations/2": {
        "DELETE": {data: ""}
    }
};

const validBaseAuth = {
    username: "valid_username",
    password: "valid_password"
};

const appName = "Radaller CMS";

const twoFactorBaseAuth = {
    username: "valid_username",
    password: "2fa_password"
};

const wrongBaseAuth = {
    username: "wrong_username",
    password: "wrong_password"
};

const headers = {
    "Content-Type": "application/json"
};

axios.mockImplementation(
    (options) => {
        const {username, password} = options['auth'];
        if (username === twoFactorBaseAuth.username && password === twoFactorBaseAuth.password) {
            return Promise.reject({ response: { status: 401, headers:{"x-github-otp":"required"} } });
        }
        if (username !== validBaseAuth.username || password !== validBaseAuth.password) {
            return Promise.reject({ response: { status: 401, headers:{} } });
        }
        if (paths[options['url']][options['method']]) {
            return Promise.resolve(paths[options['url']][options['method']]);
        } else {
            return Promise.reject({ error: `Directory with ${options['url']} was not found.` });
        }
    });

beforeEach(() => {
    axios.mockClear();
});

it('should throw exception on wrong base auth', () => {
    return gitHubToken
        .getPersonalTokens(wrongBaseAuth)
        .catch(error => {
            expect(error).toBeInstanceOf(GitHubUnauthorisedError);
            expect(error.message).toEqual('Unauthorised.');
        });
});

it('should throw exception on 2fa base auth', () => {
    return gitHubToken
        .getPersonalTokens(twoFactorBaseAuth)
        .catch(error => {
            expect(error).toBeInstanceOf(GitHubTwoFactorError);
            expect(error.message).toEqual('Unauthorised. Two Factor Code required.');
        });
});

it('should return personal tokens', () => {
    return gitHubToken
        .getPersonalTokens(validBaseAuth)
        .then(response => {
            expect(axios).toHaveBeenLastCalledWith(
                {
                    "url": 'https://api.github.com/authorizations',
                    "headers": headers,
                    "method": "GET",
                    "auth": validBaseAuth
                }
            );
            expect(response).toEqual(tokens);
        });
});

it('should delete personal token by id', () => {
    return gitHubToken
        .deletePersonalTokenById(validBaseAuth, 2)
        .then(response => {
            expect(axios).toHaveBeenLastCalledWith(
                {
                    "url": 'https://api.github.com/authorizations/2',
                    "headers": headers,
                    "method": "DELETE",
                    "auth": validBaseAuth
                }
            );
            expect(response).toEqual({ data: "" });
        });
});

it('should generate personal token', () => {
    return gitHubToken
        .generatePersonalToken(validBaseAuth, appName)
        .then(response => {
            expect(axios).toHaveBeenLastCalledWith(
                {
                    "url": 'https://api.github.com/authorizations',
                    "headers": headers,
                    "method": "POST",
                    "auth": validBaseAuth,
                    "data": {
                        "scopes": [
                            "public_repo"
                        ],
                        "note": appName
                    }
                }
            );
            expect(response).toEqual(newToken);
        });
});

it('should delete personal token by note', () => {
    return gitHubToken
        .deletePersonalTokenByNote(validBaseAuth, "Radaller CMS")
        .then(response => {
            expect(axios).toHaveBeenCalledTimes(2);
            expect(axios).toHaveBeenLastCalledWith(
                {
                    "url": 'https://api.github.com/authorizations/2',
                    "headers": headers,
                    "method": "DELETE",
                    "auth": validBaseAuth
                }
            );
            expect(response).toEqual({ data: "" });
        });
});