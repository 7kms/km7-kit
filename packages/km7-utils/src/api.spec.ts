import Request from './api';

describe('request', () => {
  it('get json', async () => {
    const res = await Request.$get('https://jsonplaceholder.typicode.com/posts/1');
    expect(typeof res).toEqual('object');
    expect((res as any).id).toEqual(1);
  });
  it('post json', async () => {
    const res = await Request.$post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    });
    expect(typeof res).toEqual('object');
    expect((res as any).title).toEqual('foo');
  });
});
