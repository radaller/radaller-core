'use strict';

import GithubStorage from './storage/github';
import Document from './document';
import DocumentCollection from './document/collection';
import Cms from './cms';

const GithubCms = Cms(
    GithubStorage(Document, DocumentCollection)
);

export default GithubCms;