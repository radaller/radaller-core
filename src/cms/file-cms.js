'use strict';

import FileStorage from './storage/file';
import Document from './document';
import DocumentCollection from './document/collection';
import Cms from './cms';

const FileCms = Cms(
    FileStorage(Document, DocumentCollection)
);

export default FileCms;
