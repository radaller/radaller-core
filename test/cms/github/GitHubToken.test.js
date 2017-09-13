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
    password: "valid_password",
    appName: "Radaller CMS"
};

const twoFactorBaseAuth = {
    username: "valid_username",
    password: "2fa_password"
};

const wrongBaseAuth = {
    username: "wrong_username",
    password: "wrong_password",
    appName: "Radaller CMS"
};

const validAuthHeaders = {
    "Authorization": "Basic dmFsaWRfdXNlcm5hbWU6dmFsaWRfcGFzc3dvcmQ=",
    "Content-Type": "application/json"
};

const valid2faAuthHeaders = {
    "Authorization": "Basic dmFsaWRfdXNlcm5hbWU6MmZhX3Bhc3N3b3Jk",
    "Content-Type": "application/json"
};

axios.mockImplementation(
    (options) => {
        if (options['headers']['Authorization'] === valid2faAuthHeaders['Authorization']) {
            return Promise.reject({ response: { status: 401, headers:{"x-github-otp":"required"} } });
        }
        if (options['headers']['Authorization'] !== validAuthHeaders['Authorization']) {
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
                    "headers": validAuthHeaders,
                    "method": "GET"
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
                    "headers": validAuthHeaders,
                    "method": "DELETE"
                }
            );
            expect(response).toEqual({ data: "" });
        });
});

it('should generate personal token', () => {
    return gitHubToken
        .generatePersonalToken(validBaseAuth)
        .then(response => {
            expect(axios).toHaveBeenLastCalledWith(
                {
                    "url": 'https://api.github.com/authorizations',
                    "headers": validAuthHeaders,
                    "method": "POST",
                    "data": {
                        "scopes": [
                            "public_repo"
                        ],
                        "note": "Radaller CMS"
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
                    "headers": validAuthHeaders,
                    "method": "DELETE"
                }
            );
            expect(response).toEqual({ data: "" });
        });
});