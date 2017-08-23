jest.mock('node-fetch');

import HttpCli from '../http-cli';

let httpClient = new HttpCli({
    basePath: 'https://localhost'
});

it('resolve simple content object', () => {
    expect.assertions(1);
    return httpClient.resolve('reference/1_reference').then(data => {
        expect(data).toEqual({"key": "value1", "reference": {"key": "value2"}})
    });
});