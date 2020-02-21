/**
 * 从Github拉去样板文件
 * */
import fs from 'fs';
import download from 'download-git-repo';
import handlebars from 'handlebars';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import symbols from 'log-symbols';

export default (name, branch) => {
  // 项目不存在
  if (!fs.existsSync(name)) {
    inquirer
      .prompt([
        {
          name: 'description',
          message: '请输入项目描述',
        },
        {
          name: 'author',
          message: '请输入作者名称',
        },
      ])
      .then(answers => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download(`https://github.com:${name}#${branch}`, name, { clone: false }, err => {
          // Github拉去文件失败
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author,
            };
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green('项目初始化完成'));
          }
        });
      });
  }
  // 错误提示项目已存在，避免覆盖原有项目
  else {
    console.log(symbols.error, chalk.red('项目已存在'));
  }
};
