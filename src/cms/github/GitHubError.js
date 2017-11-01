class GitHubError extends Error {
    constructor(message, response) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.response = response;
        this.status = response.status;
        this.constructor = GitHubError;
        this.__proto__   = GitHubError.prototype;
    }
}

/**
 * Is thrown when authentication credentials are not valid
 */
class GitHubUnauthorisedError extends GitHubError {
    constructor(response) {
        super("Unauthorised.", response);

        this.constructor = GitHubUnauthorisedError;
        this.__proto__   = GitHubUnauthorisedError.prototype;
    }
}

/**
 * Is thrown when token already exists
 */
class GitHubTokenExistError extends GitHubError {
    constructor(response) {
        super("Token already exist.", response);

        this.constructor = GitHubTokenExistError;
        this.__proto__   = GitHubTokenExistError.prototype;
    }
}

/**
 * Is thrown when two factor authentication is required
 */
class GitHubTwoFactorError extends GitHubError {
    constructor(response) {
        super("Unauthorised. Two Factor Code required.", response);

        this.constructor = GitHubTwoFactorError;
        this.__proto__   = GitHubTwoFactorError.prototype;
    }
}

export {GitHubUnauthorisedError, GitHubTokenExistError, GitHubTwoFactorError};