const shell = require('shelljs');
const { existsSync, readdirSync } = require('fs');
const { join } = require('path');
const { fork } = require('child_process');

const getRepoDirByName = updatedRepos => {
  console.log(`repos to publish: ${updatedRepos.join(', ')}`);
  const repoDir = readdirSync(join(process.cwd(), 'packages'));
  const updatedReposDir = repoDir.filter(dir => {
    // eslint-disable-next-line import/no-dynamic-require
    const { name } = require(join(process.cwd(), `packages/${dir}/package.json`));
    return updatedRepos.includes(name);
  });
  return updatedReposDir;
};

module.exports = {
  getRepoDirByName,
};
