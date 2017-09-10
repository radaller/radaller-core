import GitHubAuth from  '../../../../src/cms/storage/github/auth';

jest.mock('../../../../src/cms/storage/github/token',
    () => class {
        constructor() {
            this.isTokenExist = true;
        }
        getUserByToken(token) {
            return {
                getProfile:() => this._getProfile(token)
            };
        }
        _getProfile(token) {
            if (token === "valid_token") {
                return Promise.resolve({ data: { login: "valid_username" } });
            } else {
                return Promise.reject({ status: 402 });
            }
        }
        generatePersonalToken(baseAuth) {
            const isValidBaseAuth =
                baseAuth.username === "valid_username" &&
                baseAuth.password === "valid_password";
            const isValidAuthTokenExist =
                baseAuth.username === "valid_username" &&
                baseAuth.password === "token_exist_valid_password" &&
                this.isTokenExist;
            const isValidAuthTokenDoesntExist =
                baseAuth.username === "valid_username" &&
                baseAuth.password === "token_exist_valid_password" &&
                !this.isTokenExist;
            const isValid2faWithoutCode =
                baseAuth.username === "valid_username" &&
                baseAuth.password === "2fa_password" &&
                baseAuth.twoFactorCode !== "2fa_code";
            const isValid2faBaseAuth =
                baseAuth.username === "valid_username" &&
                baseAuth.password === "2fa_password" &&
                baseAuth.twoFactorCode === "2fa_code";

            if (isValidBaseAuth || isValid2faBaseAuth || isValidAuthTokenDoesntExist) {
                this.isTokenExist = true;
                return Promise.resolve({json: () => ({token: "valid_token"})});
            } else if (isValidAuthTokenExist) {
                return Promise.resolve({ status: 422 });
            } else if (isValid2faWithoutCode) {
                const headers = { get:(name) => ({"X-GitHub-OTP": "required"}[name]) };
                return Promise.resolve({ status: 401, headers: headers });
            } else {
                return Promise.resolve({ status: 401 });
            }
        }
        deletePersonalTokenByNote(baseAuth, appName) {
            this.isTokenExist = false;
            return Promise.resolve({});
        }
    }
);

const validAuth = {
    username: 'valid_username',
    token: 'valid_token'
};

const validBaseAuthCredentials = {
    username: "valid_username",
    password: "valid_password"
};

const tokenExistValidBaseAuthCredentials = {
    username: "valid_username",
    password: "token_exist_valid_password"
};

const wrongBaseAuthCredentials = {
    username: "wrong_username",
    password: "wrong_password"
};

const _2faAuthCredentials = {
    username: "valid_username",
    password: "2fa_password",
    twoFactorCode: "2fa_code"
};

const gitHubAuth = new GitHubAuth();

it('should authenticate on valid token', () => {
    return gitHubAuth.authenticate("valid_token")
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});

it('should throw exception on wrong token', () => {
    return gitHubAuth.authenticate("wrong_token")
        .catch(error => {
            expect(error).toEqual({ message: 'Token is not valid.' })
        });
});

it('should throw exception on wrong credentials', () => {
    return gitHubAuth.authenticate(wrongBaseAuthCredentials)
        .catch(error => {
            expect(error).toEqual({ status: 401, message: 'Credentials are not valid.'})
        });
});

it('should generate token on valid credentials', () => {
    return gitHubAuth.authenticate(validBaseAuthCredentials)
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});

it('should regenerate token if exists on valid credentials', () => {
    return gitHubAuth.authenticate(tokenExistValidBaseAuthCredentials)
        .then(auth => {
            expect(auth).toEqual(validAuth)
        });
});

it('should throw exception on valid 2fa credentials with missing 2fa code', () => {
    const _2faCredentialsNo2faCode = (({username, password}) => ({username, password}))(_2faAuthCredentials);
    return gitHubAuth.authenticate(_2faCredentialsNo2faCode)
        .catch(error => {
            expect(error).toEqual({ status: 401, twoFactor: true});
        });
});

it('should generate token on valid 2fa credentials', () => {
    return gitHubAuth.authenticate(_2faAuthCredentials)
        .then(auth => {
            expect(auth).toEqual(validAuth);
        });
});
