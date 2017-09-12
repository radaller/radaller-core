import GitHubAuth from  '../../../../src/cms/storage/github/auth';

import {TokenExistError, UnauthorisedError} from '../../../../src/cms/storage/github/error';

let isTokenExist = true;
let gitHubToken = {};

gitHubToken.generatePersonalToken = jest.fn().mockImplementation(
    (baseAuth) => {
        const isValidBaseAuth =
            baseAuth.username === "valid_username" &&
            baseAuth.password === "valid_password";
        const isValidAuthTokenExist =
            baseAuth.username === "valid_username" &&
            baseAuth.password === "token_exist_valid_password" &&
            isTokenExist;
        const isValidAuthTokenDoesntExist =
            baseAuth.username === "valid_username" &&
            baseAuth.password === "token_exist_valid_password" &&
            !isTokenExist;
        const isValid2faBaseAuth =
            baseAuth.username === "valid_username" &&
            baseAuth.password === "2fa_password" &&
            baseAuth.twoFactorCode === "2fa_code";

        if (isValidBaseAuth || isValid2faBaseAuth || isValidAuthTokenDoesntExist) {
            isTokenExist = true;
            return Promise.resolve({ data: {token: "valid_token"} });
        } else if (isValidAuthTokenExist) {
            const error = new TokenExistError({ status: 422 });
            return Promise.reject(error);
        } else {
            const error = new UnauthorisedError({ status: 401 });
            return Promise.reject(error);
        }
    }
);

gitHubToken.deletePersonalTokenByNote = jest.fn().mockImplementation(
    (baseAuth, appName) => {
        isTokenExist = false;
        return Promise.resolve({});
    }
);

gitHubToken.getUserProfileByToken = jest.fn().mockImplementation(
    (token) => {
        if (token === "valid_token") {
            return Promise.resolve({ data: { login: "valid_username" } });
        }
    }
);

const validAuth = {
    username: 'valid_username',
    token: 'valid_token'
};

const validBaseAuth = {
    username: "valid_username",
    password: "valid_password"
};

const tokenExistValidBaseAuth = {
    username: "valid_username",
    password: "token_exist_valid_password"
};

const _2faBaseAuth = {
    username: "valid_username",
    password: "2fa_password",
    twoFactorCode: "2fa_code"
};

const gitHubAuth = new GitHubAuth(gitHubToken);

it('should authenticate on valid token', () => {
    return gitHubAuth.getAuthByToken("valid_token")
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});

it('should generate token on valid credentials', () => {
    return gitHubAuth.getAuthByBaseAuth(validBaseAuth)
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});

it('should regenerate token if exists on valid credentials', () => {
    return gitHubAuth.getAuthByBaseAuth(tokenExistValidBaseAuth)
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});


it('should generate token on valid 2fa credentials', () => {
    return gitHubAuth.getAuthByBaseAuth(_2faBaseAuth)
        .then(auth => {
            expect(auth).toEqual(validAuth);
        });
});
