import path from 'path';
import { getFileType } from '../src/utils';

describe('km7-utils', () => {
  it('judge file type', async () => {
    const result = await getFileType(path.resolve(__dirname, 'test.png'));
    expect(result.ext).toEqual('png');
    expect(result.mime).toEqual('image/png');

    const result2 = await getFileType(path.resolve(__dirname, __filename));
    expect(result2).toBeUndefined();
  });
});
