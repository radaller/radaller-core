jest.mock('fs-extra');

const fs = require('fs-extra');

import FileCms from '../../src/cms/file-cms';

let fileCms = new FileCms({
    basePath: './data'
});

it('read simple content', () => {
    expect.assertions(1);
    const responseObject = {id: '1_simple.yaml', key1: 'value1'};
    return fileCms.get('simple/1_simple.yaml', {}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('read simple directory content', () => {
    expect.assertions(1);
    const responseObject = {
        total: 2,
        items: [
            {id: '2_simple.yaml', key2: 'value2'},
            {id: '1_simple.yaml', key1: 'value1'}
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
            {id: '11_simple.yaml', key11: 'value11'},
            {id: '10_simple.yaml', key10: 'value10'},
            {id: '9_simple.yaml', key9: 'value9'},
            {id: '8_simple.yaml', key8: 'value8'},
            {id: '7_simple.yaml', key7: 'value7'}
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
            {id: '10_simple.yaml', key10: 'value10'},
            {id: '8_simple.yaml', key8: 'value8'}
        ]
    };
    return fileCms.get('11_files_directory', {filter:{"id":["10_simple.yaml", "8_simple.yaml"]}}).then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('create new file', () => {
    expect.assertions(2);
    const objectToSave = {key3: 'value3'};
    const responseObject = {id: '3_simple.yaml', key3: 'value3'};
    jest.spyOn(fs, 'writeFile');
    return fileCms.post('simple', objectToSave).then(data => {
        expect(fs.writeFile).toHaveBeenLastCalledWith('data/simple/3_simple.yaml', 'key3: value3\n', 'utf8');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('update file', () => {
    expect.assertions(2);
    const objectToSave = {id: '2_simple.yaml', key2: 'value2'};
    const responseObject = {id: '2_simple.yaml', key2: 'value2'};
    jest.spyOn(fs, 'writeFile');
    return fileCms.put('simple/2_simple.yaml', objectToSave).then(data => {
        expect(fs.writeFile).toHaveBeenLastCalledWith('data/simple/2_simple.yaml', 'key2: value2\n', 'utf8');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('remove file', () => {
    expect.assertions(2);
    const responseObject = {id: '2_simple.yaml'};
    jest.spyOn(fs, 'unlink');
    return fileCms.remove('simple/2_simple.yaml').then(data => {
        expect(fs.unlink).toHaveBeenLastCalledWith('data/simple/2_simple.yaml');
        expect(data).toEqual(JSON.stringify(responseObject));
    });
});

it('validate data', () => {
    expect.assertions(1);
    const objectToValidate = {id: '2_simple.yaml', key: 'value2'};
    return fileCms.validate('simples/2_simple.yaml', objectToValidate).then(data => {
        expect(data).toBe(true);
    });
});