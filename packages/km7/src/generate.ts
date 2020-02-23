/**
 * @desc 用于初始化项目
 * */
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import ora from 'ora';
import { getFileType } from './utils/index';

export const templateCompile = async (root, meta = {}) => {
  const dirs = fs.readdirSync(root, { withFileTypes: true });
  for (let dirent of dirs) {
    const newPath = path.join(root, dirent.name);
    if (dirent.isDirectory()) {
      await templateCompile(newPath, meta);
    } else if (dirent.isFile()) {
      const result = await getFileType(newPath);
      if (!result) {
        try {
          const content = fs.readFileSync(newPath).toString();
          const result = handlebars.compile(content)(meta);
          fs.writeFileSync(newPath, result);
        } catch (e) {
          // console.log(e)
        }
      }
    }
  }
};

export const generate = async (name, from, to, answers) => {
  const spinner = ora('正在下载模板...');
  spinner.start();
  fsExtra.copySync(from, to);
  spinner.succeed();
  const meta = {
    name,
    description: answers.description,
    author: answers.author,
    umiPort: answers.umiPort || 10240,
    eggPort: answers.eggPort || 10250,
    timestamp: Date.now(),
  };
  await templateCompile(to, meta);
  console.log(symbols.success, chalk.green('项目初始化完成'));
};

export const generateTemplate = (name, from, to) => {
  const queryArr = [
    {
      name: 'description',
      message: '请输入项目描述',
    },
    {
      name: 'author',
      message: '请输入作者名称',
    },
    {
      name: 'umiPort',
      message: '请输入umi环境端口(default: 10250)',
    },
    {
      name: 'eggPort',
      message: '请输入egg环境端口(default: 10240)',
    },
  ];
  inquirer.prompt(queryArr).then(answers => {
    generate(name, from, to, answers);
  });
};
