class GitHubError extends Error {
    constructor(message, response) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.response = response;
        this.status = response.status;
    }
}

export class UnauthorisedError extends GitHubError {
    constructor(response) {
        super("Unauthorised.", response);
    }
}

export class TokenExistError extends GitHubError {
    constructor(response) {
        super("Token already exist.", response);
    }
}

export class TwoFactorError extends GitHubError {
    constructor(response) {
        super("Unauthorised. Two Factor Code required.", response);
    }
}