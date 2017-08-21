jest.mock('fs-extra');

const fs = require('fs-extra');

import File from '../file';

let fileCms = new File({
    basePath: './data'
});

it('read simple content', () => {
    expect.assertions(1);
    const responseObject = {key1: 'value1', id: '1_simple'};
    return fileCms.get('1_simple', {}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('read simple directory content', () => {
    expect.assertions(1);
    const responseObject = {
        total: 2,
        items: [
            {key2: 'value2', id: '2_simple'},
            {key1: 'value1', id: '1_simple'}
        ]
    };
    return fileCms.get('2_files_directory', {}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('read directory content page with limit', () => {
    expect.assertions(1);
    const responseObject = {
        total: 11,
        items: [
            {key11: 'value11', id: '11_simple'},
            {key10: 'value10', id: '10_simple'},
            {key9: 'value9', id: '9_simple'},
            {key8: 'value8', id: '8_simple'},
            {key7: 'value7', id: '7_simple'}
        ]
    };
    return fileCms.get('11_files_directory', {offset: 0, limit: 5}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('read directory content with filter', () => {
    expect.assertions(1);
    const responseObject = {
        total: 2,
        items: [
            {key10: 'value10', id: '10_simple'},
            {key8: 'value8', id: '8_simple'}
        ]
    };
    return fileCms.get('11_files_directory', {filter:{"id":["10_simple", "8_simple"]}}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('create new file', () => {
    expect.assertions(2);
    const objectToSave = {key3: 'value3'};
    const responseObject = {key3: 'value3', id: '3_simple'};
    jest.spyOn(fs, 'writeFile');
    return fileCms.post('simple', objectToSave).then(data => {
        expect(fs.writeFile).toHaveBeenLastCalledWith('data/simple/3_simple.yaml', 'key3: value3\n', 'utf8');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('update file', () => {
    expect.assertions(2);
    const objectToSave = {key2: 'value2', id: '2_simple'};
    const responseObject = {key2: 'value2', id: '2_simple'};
    jest.spyOn(fs, 'writeFile');
    return fileCms.put('simple/2_simple', objectToSave).then(data => {
        expect(fs.writeFile).toHaveBeenLastCalledWith('data/simple/2_simple.yaml', 'key2: value2\n', 'utf8');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('remove file', () => {
    expect.assertions(2);
    const responseObject = {id: '2_simple'};
    jest.spyOn(fs, 'unlink');
    return fileCms.remove('simple/2_simple').then(data => {
        expect(fs.unlink).toHaveBeenLastCalledWith('data/simple/2_simple.yaml');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('validate data', () => {
    expect.assertions(1);
    const objectToValidate = {key: 'value2', id: '2_simple'};
    return fileCms.validate('simples/2_simple', objectToValidate).then(data => {
        expect(data).toBe(true);
    });
});