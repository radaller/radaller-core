const fileSystem = {
    'https://localhost/reference/1_reference.yaml': `
        key: value1
        reference: 
            $ref: cms://reference/2_reference.yaml
    `,
    'https://localhost/reference/2_reference.yaml': `key: value2`
};

const fetch = (path) => {
    return new Promise((resolve, reject) => {
        process.nextTick(
            () => fileSystem[path] ? resolve(
                {
                    text() {
                        return fileSystem[path];
                    }
                }
            ) : reject({
                error: 'Directory with ' + path + ' was not found.',
            })
        );
    });
};

module.exports = fetch;