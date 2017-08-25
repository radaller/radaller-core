import GithubCms from '../github-cms';

let githubCms = new GithubCms({
    username: 'osvarychevskyi',
    token: 'dcdfb578d5b950f41cac0db9bf79dd83353f797a',
    owner: 'radaller',
    repository: 'radaller-mock-data'
});

it('read simple content', () => {
    expect.assertions(1);
    const responseObject = {id: '1_simple.yaml', key1: 'value1'};
    return githubCms.get('simple/1_simple.yaml').then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});

it('read simple directory', () => {
    expect.assertions(1);
    const responseObject = {
        total: 2,
        items: [
            {id: '2_simple.yaml', key2: 'value2'},
            {id: '1_simple.yaml', key1: 'value1'}
        ]
    };
    return githubCms.get('simple').then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});