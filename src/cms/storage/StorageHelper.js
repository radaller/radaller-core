export const _applyFilter = (filter = {}) => {
    return fileNames => {
        if (filter.id !== undefined) {
            return fileNames.filter(fileName => filter.id.includes(fileName))
        }
        return fileNames;
    }
};

export const _promiseAll = (lambda) => {
    return (arr) => {
        return Promise.all(
            arr.map(item => lambda(item))
        );
    }
};


export const _reverse = (array) => {
    return array.reverse();
};

export const _filter = (lambda) => {
    return array => array.filter(lambda);
};

export const _map = (lambda) => {
    return array => array.map(lambda);
};

export const _paginate = (offset, limit) => {
    return array => array.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
};
