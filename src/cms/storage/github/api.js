const GitHubAPI = require('github-api');

export default class extends GitHubAPI {
    constructor(auth) {
        const gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
        super(auth, gitHibAPIUrl);
    }
}