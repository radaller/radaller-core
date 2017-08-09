const GitHubAPI = require('github-api');
const p = require('path');

class GitHub {
    constructor(config) {
        this.basePath = config.repositoryName;
        this.tree = {
            items: null,
            indexedByPath: [],
            indexedByDir: []
        };
        this.username = config.username;
        this.gh = new GitHubAPI({
            username: config.username,
            token: config.token
        });
    }

    getBaseDir() {
        return this.basePath;
    }

    _buildTree() {
        var tree = this.tree;
        // this.gh.listCommits().then(function({data}){
        //
        // });
        // tree.items = dirTree(this.basePath, null, (item, PATH) => {
        //     var path = item.path.substr(this.basePath.length + 1);
        //     var itemData = {
        //         path: path
        //     };
        //     var relativeDirectory = p.dirname(path);
        //     tree.indexedByPath[path] = itemData;
        //     if (typeof tree.indexedByDir[relativeDirectory] === 'undefined') {
        //         tree.indexedByDir[relativeDirectory] = [];
        //     }
        //     tree.indexedByDir[relativeDirectory].push(itemData);
        // });
    }

    getTree() {
        if (this.tree.items === null) {
            this._buildTree();
        }
        return this.tree;
    }

    get(path) {
        var path = path.substr('cms://'.length);
        var repo = this.gh.getRepo(this.username, this.getBaseDir())
        return repo
            .getContents('master', path, true)
            .then(function({data}){
                return data;
            });
    }

    getFilesByDir(path) {
        var filePath = p.join(this.getBaseDir(), path);
        var lstat = fs.lstatSync(filePath);
        if (!lstat.isDirectory()) {
            throw sprintf("Requested path: %s is not a directory.", filePath);
        }
        return this.getTree().indexedByDir[path];
    }

    put(path, content) {
        fs.writeFileSync(path, content);
    }

    post(path, content) {
        fs.writeFileSync(path, content);
    }

    delete(path) {
        fs.unlinkSync(path);
    }
}

export default GitHub;