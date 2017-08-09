var $RefParser = require('json-schema-ref-parser');

class Abstract {
    constructor() {
        this.pagesDir = 'pages';
    }

    /**
     *
     * @param path
     * @returns {*}
     */
    resolve(path) {
        var pagePath = 'cms://' + this.pagesDir + path + '.yaml';
        var cmsResolver = this._getResolver();
        return $RefParser
            .dereference(pagePath,
                {
                    resolve: {
                        cms: cmsResolver
                    }
                })
            .then(function(schema) {
                return schema;
            });
    }

    _getResolver() {
        var $this = this;
        return {
            order: 1,
            canRead: /^cms:/i,
            read: function(file) {
                var path = file.url.substr('cms://'.length);
                return $this.get(path)
                    .then(function(data) {
                        if (data) {
                            return data;
                        } else {
                            throw new Error("No data!");
                        }
                    });
            }
        };
    }
}

export default Abstract;