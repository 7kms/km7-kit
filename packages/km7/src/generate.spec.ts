import fs from 'fs-extra';
import { generate, templateCompile } from './generate';
import path from 'path';

describe('generate', () => {
  it('generate project', async () => {
    const name = 'km7-test-backend1';
    const from = path.resolve(__dirname, '../templates/projects/web-backend');
    const to = path.resolve(__dirname, `../__tests__/.dist/${name}`);
    fs.removeSync(to);
    await generate(name, from, to, {
      author: 'km7',
      description: 'km7 project test',
      eggPort: 10250,
      umiPort: 10260,
    });
  });
});
