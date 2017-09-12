'use strict';

import GithubStorage from './storage/github';
import Document from './document';
import DocumentCollection from './document/collection';
import Cms from './cms';

const GitHubCms = Cms(
    GithubStorage(Document, DocumentCollection)
);

export default GitHubCms;