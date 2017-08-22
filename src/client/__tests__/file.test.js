jest.mock('fs-extra');

import File from '../file';

let fileClient = new File({
    basePath: './data'
});

it('get simple content object', () => {
    expect.assertions(1);
    return fileClient.get('simple/1_simple.yaml').then(data => {
        expect(data).toEqual({id: '1_simple', content:'key1: value1'})
    });
});