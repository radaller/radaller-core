class GitHubError extends Error {
    constructor(message, response) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.response = response;
        this.status = response.status;
    }
}

class GitHubUnauthorisedError extends GitHubError {
    constructor(response) {
        super("Unauthorised.", response);
    }
}

class GitHubTokenExistError extends GitHubError {
    constructor(response) {
        super("Token already exist.", response);
    }
}

class GitHubTwoFactorError extends GitHubError {
    constructor(response) {
        super("Unauthorised. Two Factor Code required.", response);
    }
}

export {GitHubUnauthorisedError, GitHubTokenExistError, GitHubTwoFactorError};