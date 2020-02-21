/**
 * @desc 用于复制样板文件夹
 * */
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import symbols from 'log-symbols';

export default async (from, to) => {
  try {
    await fsExtra.copy(from, to);
    console.log(symbols.success, chalk.green(`生成 ${to} 成功`));
  } catch (err) {
    console.log(symbols.error, chalk.red(`生成 ${to} 失败：${err}`));
  }
};
