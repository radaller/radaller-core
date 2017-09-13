import GitHubAPI from 'github-api';

class GitHubApi extends GitHubAPI {
    constructor(auth) {
        const gitHibAPIUrl = process.env.GIT_API_URL ? process.env.GIT_API_URL : 'https://api.github.com';
        super(auth, gitHibAPIUrl);
    }
}

export default GitHubApi;