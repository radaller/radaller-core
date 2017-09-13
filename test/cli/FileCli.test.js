jest.mock('fs-extra');

import FileCli from '../../src/cli/FileCli';

const fileClient = FileCli.getClient({
    basePath: './data'
});

it('resolve content object', () => {
    expect.assertions(1);
    return fileClient.resolve('reference/1_reference').then(data => {
        expect(data).toEqual({"key": "value1", "reference": {"key": "value2"}})
    });
});

it('get simple content object', () => {
    expect.assertions(1);
    const responseObject = {"key1": "value1"};
    return fileClient.resolve('simple/1_simple').then(data => {
        expect(data).toEqual(responseObject)
    });
});