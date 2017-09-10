'use strict';

module.exports = {
    GithubCms: require('./dist/cms/github-cms').default,
    GitHubAuth: require('./dist/cms/storage/github/auth').default,
    Api: require('./dist/cms/storage/github/api').default
};