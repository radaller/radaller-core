'use strict';

import FileStorage from './storage/file';
import Document from './document';
import Cms from './cms';

const FileCms = Cms(
    FileStorage(Document)
);

export { FileCms };
