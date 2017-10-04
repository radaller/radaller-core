class GitHubError extends Error {
    constructor(message, response) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.response = response;
        this.status = response.status;
    }
}

/**
 * Is thrown when authentication credentials are not valid
 */
class GitHubUnauthorisedError extends GitHubError {
    constructor(response) {
        super("Unauthorised.", response);
    }
}

/**
 * Is thrown when token already exists
 */
class GitHubTokenExistError extends GitHubError {
    constructor(response) {
        super("Token already exist.", response);
    }
}

/**
 * Is thrown when two factor authentication is required
 */
class GitHubTwoFactorError extends GitHubError {
    constructor(response) {
        super("Unauthorised. Two Factor Code required.", response);
    }
}

export {GitHubUnauthorisedError, GitHubTokenExistError, GitHubTwoFactorError};