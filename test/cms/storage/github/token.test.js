'use strict';

import GitHubToken from '../../../../src/cms/storage/github/token';

const gitHubToken = new GitHubToken();

const tokens = [
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
];

const newToken = {
    "id": 2,
    "token": "valid_token",
    "note": "Radaller CMS"
};

const paths = {
    "https://api.github.com/authorizations": {
        "GET": tokens,
        "POST": newToken
    },
    "https://api.github.com/authorizations/2": {
        "DELETE": {}
    }
};

const validBaseAuth = {
    username: "valid_username",
    password: "valid_password",
    appName: "Radaller CMS"
};

const validAuthHeaders = {
    "Authorization": "Basic dmFsaWRfdXNlcm5hbWU6dmFsaWRfcGFzc3dvcmQ=",
    "Content-Type": "application/json"
};

beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(
        (path, headers) => {
            if (paths[path][headers['method']]) {
                return Promise.resolve({ json:() => paths[path][headers['method']] })
            } else {
                return Promise.reject({ error: `Directory with ${path} was not found.` })
            }
        }
    );
});

it('should return personal tokens', () => {
    jest.spyOn(global, 'fetch');
    return gitHubToken
        .getPersonalTokens(validBaseAuth)
        .then(response => {
            expect(fetch).toHaveBeenLastCalledWith(
                'https://api.github.com/authorizations',
                {
                    "headers": validAuthHeaders,
                    "method": "GET",
                    "mode": "cors"
                }
            );
            expect(response.data).toEqual(tokens);
        });
});

it('should delete personal token by id', () => {
    jest.spyOn(global, 'fetch');
    return gitHubToken
        .deletePersonalTokenById(validBaseAuth, 2)
        .then(response => {
            expect(fetch).toHaveBeenLastCalledWith(
                'https://api.github.com/authorizations/2',
                {
                    "headers": validAuthHeaders,
                    "method": "DELETE",
                    "mode": "cors"
                }
            );
            expect(response.data).toEqual({});
        });
});

it('should generate personal token', () => {
    jest.spyOn(global, 'fetch');
    return gitHubToken
        .generatePersonalToken(validBaseAuth)
        .then(response => {
            expect(fetch).toHaveBeenLastCalledWith(
                'https://api.github.com/authorizations',
                {
                    "headers": validAuthHeaders,
                    "method": "POST",
                    "mode": "cors",
                    body: JSON.stringify({
                        "scopes": [
                            "public_repo"
                        ],
                        "note": "Radaller CMS"
                    })
                }
            );
            expect(response.data).toEqual(newToken);
        });
});

it('should delete personal token by note', () => {
    jest.spyOn(global, 'fetch');
    return gitHubToken
        .deletePersonalTokenByNote(validBaseAuth, "Radaller CMS")
        .then(response => {
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenLastCalledWith(
                'https://api.github.com/authorizations/2',
                {
                    "headers": validAuthHeaders,
                    "method": "DELETE",
                    "mode": "cors"
                }
            );
            expect(response.data).toEqual({});
        });
});