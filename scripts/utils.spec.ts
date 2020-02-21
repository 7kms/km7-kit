import { getRepoDirByName } from './utils';
const shell = require('shelljs');
const { existsSync, readdirSync } = require('fs');
const { join } = require('path');
const { fork } = require('child_process');
const cwd = process.cwd();
describe('publish', () => {
  test('dirs', () => {
    const updatedRepos = ['km7', '@km7/utils', '@km7/babel-preset', '@km7/eslint-config'];
    const updatedReposDir = getRepoDirByName(updatedRepos);
    expect(updatedReposDir).toEqual(['babel-preset-km7', 'eslint-config-km7', 'km7', 'km7-utils']);
  });
});
