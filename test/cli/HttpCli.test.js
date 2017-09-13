import axios from 'axios';
import HttpCli from '../../src/cli/HttpCli';
jest.mock('axios');

const fileSystem = {
    'https://localhost/reference/1_reference.yaml': `
        key: value1
        reference: 
            $ref: cms://reference/2_reference.yaml
    `,
    'https://localhost/reference/2_reference.yaml': `key: value2`
};

axios.mockImplementation(
    (path) => {
        if (fileSystem[path]) {
            return Promise.resolve({ data: fileSystem[path] });
        } else {
            return Promise.reject({ error: `Directory with ${path} was not found.` });
        }
    });

beforeEach(() => {
    axios.mockClear();
});

let httpClient = HttpCli.getClient({
    basePath: 'https://localhost'
});

it('resolve simple content object', () => {
    expect.assertions(1);
    return httpClient.resolve('reference/1_reference').then(data => {
        expect(data).toEqual({"key": "value1", "reference": {"key": "value2"}})
    });
});