import GitHubCms from '../../src/cms/GitHubCms';

const gitHubStorage = GitHubCms.getRestStorage({
    username: 'username',
    token: 'token',
    owner: 'owner',
    repository: 'repository'
});

it('read simple content', () => {
    expect.assertions(1);
    const responseObject = {id: '1_simple.yaml', key1: 'value1'};
    return gitHubStorage.get('simple/1_simple.yaml').then(data => {
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
    return gitHubStorage.get('simple').then(data => {
        expect(data).toEqual(JSON.stringify(responseObject))
    });
});