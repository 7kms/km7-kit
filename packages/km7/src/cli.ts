import path from 'path';
import fs from 'fs';
import program from 'commander';
import CryptoJS from 'crypto-js';
import { spawn } from 'child_process';
import chalk from 'chalk';
import symbols from 'log-symbols';
import copyDir from './utils/copyDir';
import { generateTemplate } from './generate';

export const allActions = {
  initProject: async (name, options) => {
    const baseTemplateDir = path.join(__dirname, '../templates/projects');
    const to = path.join(process.cwd(), name);
    const from = path.join(__dirname, `../templates/projects/${options.template}`);
    if (!fs.existsSync(from)) {
      const arr = fs.readdirSync(baseTemplateDir);
      console.log(`The template ${chalk.red(options.template)} is not exists`);
      console.log(`${chalk.green(arr.join(' '))} supports`);
    } else if (fs.existsSync(to)) {
      console.log(symbols.error, chalk.red(`${options.template} 项目已存在`));
    } else {
      return generateTemplate(name, from, to);
    }
  },
};

// 显示帮助信息
program
  .version(require(path.resolve(__dirname, '../package.json')).version, '-v, --version')
  .description('km7脚手架');

// 新建项目
program
  .command('init <name>')
  .description('新建项目')
  .option('-t,--template <project>', 'web|web-backend|web-ssr')
  .action(allActions.initProject);

// 新建项目
program
  .command('aes <msg>')
  .description('aes encrypt/decrypt<msg>')
  .option('-e, --encrypt <key>', '秘钥')
  .option('-d, --decrypt <key>', '秘钥')
  .action((msg, options) => {
    const { encrypt, decrypt } = options;
    if (encrypt) {
      const ciphertext = CryptoJS.AES.encrypt(msg, encrypt).toString();
      console.log(chalk.red('encrypt:'), ciphertext);
    } else if (decrypt) {
      // Decrypt
      const bytes = CryptoJS.AES.decrypt(msg, decrypt);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      console.log(chalk.green('decrypt:'), originalText);
    }
  });

program.parse(process.argv);
