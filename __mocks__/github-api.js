import { Base64 } from 'js-base64';
const fileSystem = {
    'simple': {
        data: [
            {
                type: "dir",
                name: "directory_1"
            },
            {
                type: "file",
                name: "1_simple.yaml"
            },
            {
                type: "dir",
                name: "directory_2"
            },
            {
                type: "file",
                name: "2_simple.yaml"
            },
        ]
    },
    'simple/1_simple.yaml': {data: `key1: value1`},
    'simple/2_simple.yaml': {data: `key2: value2`},
    'simple/3_simple.yaml': {data: `key3: value3`},
    //////////////////////////////////////
};

class githubApi {
    constructor() {

    }
    getRepo(owner, repository) {
        return repo;
    }
}

let repo = {};

repo.getContents = (hash, path) => {
    return new Promise((resolve, reject) => {
        fileSystem[path] ? resolve(fileSystem[path]) : reject({
            error: 'Directory with ' + path + ' was not found.',
        })
    });
};

repo.writeFile = (branch, path, contentBase64, comment) => {
    return new Promise((resolve, reject) => {
        if (Base64.encode(Base64.decode(contentBase64)) !== contentBase64) {
            reject({
                error: 'Content is not encoded',
            })
        }
        fileSystem[path] ? resolve(path) : reject({
            error: 'Directory with ' + path + ' was not found.',
        })
    });
};

module.exports = githubApi;