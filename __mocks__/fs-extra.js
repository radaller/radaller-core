const fileSystem = {
    'data/2_files_directory': [
        'directory_1',
        '1_simple.yaml',
        'directory_2',
        '2_simple.yaml'
    ],
    'data/2_files_directory/1_simple.yaml': `key1: value1`,
    'data/2_files_directory/2_simple.yaml': `key2: value2`,
    /////////////////////////////////////
    'data/11_files_directory': [
        'directory_1',
        '1_simple.yaml',
        'directory_2',
        '2_simple.yaml',
        '3_simple.yaml',
        '4_simple.yaml',
        '5_simple.yaml',
        '6_simple.yaml',
        '7_simple.yaml',
        '8_simple.yaml',
        '9_simple.yaml',
        '10_simple.yaml',
        '11_simple.yaml'
    ],
    'data/11_files_directory/1_simple.yaml': `key1: value1`,
    'data/11_files_directory/2_simple.yaml': `key2: value2`,
    'data/11_files_directory/3_simple.yaml': `key3: value3`,
    'data/11_files_directory/4_simple.yaml': `key4: value4`,
    'data/11_files_directory/5_simple.yaml': `key5: value5`,
    'data/11_files_directory/6_simple.yaml': `key6: value6`,
    'data/11_files_directory/7_simple.yaml': `key7: value7`,
    'data/11_files_directory/8_simple.yaml': `key8: value8`,
    'data/11_files_directory/9_simple.yaml': `key9: value9`,
    'data/11_files_directory/10_simple.yaml': `key10: value10`,
    'data/11_files_directory/11_simple.yaml': `key11: value11`,
    //////////////////////////////////////
    'data/simple': [
        'directory_1',
        '1_simple.yaml',
        'directory_2',
        '2_simple.yaml'
    ],
    'data/simple/1_simple.yaml': `key1: value1`,
    'data/simple/2_simple.yaml': `key2: value2`,
    'data/simple/3_simple.yaml': `key3: value3`,
    /////////////////////////////////////
    'data/schemas': [
        'simples.yaml'
    ],
    'data/schemas/simples.yaml': `
        title: Simple
        type: object
        folder: simples
        properties:
            key: { title: Key, type: string, inputType: text }
        required: [ key ]
        showInList: [ key ]
    `,
};

let fs = {};

fs.readFile = (path, charset) => {
    return new Promise((resolve, reject) => {
        process.nextTick(
            () => fileSystem[path] ? resolve(fileSystem[path]) : reject({
                error: 'File with ' + path + ' was not found.',
            })
        );
    });
};

fs.readdir = (path) => {
    return new Promise((resolve, reject) => {
        process.nextTick(
            () => fileSystem[path] ? resolve(fileSystem[path]) : reject({
                error: 'Directory with ' + path + ' was not found.',
            })
        );
    });
};

fs.writeFile = (path, content) => {
    return Promise.resolve({
        then: process.nextTick(() => path)
    });
};

fs.unlink = (path) => {
    return Promise.resolve({
        then: process.nextTick(() => path)
    });
};

fs.stat = (path) => {
    return new Promise((resolve, reject) => {
        process.nextTick(
            () => {
                let isFile = false;
                if (fileSystem[path] && path.indexOf(".") > -1) {
                    isFile = true
                }
                if (!fileSystem[path]) {
                    reject("File does nor exist.");
                }
                return resolve({
                    isFile: () => isFile
                });
            }
        );
    });
};


module.exports = fs;