'use strict';

const path = require('path');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const chalk = require('chalk');

const boilerplate = process.argv[2];
if (!boilerplate) {
  console.error(chalk.red('缺少boilerplate参数'));
  return;
}
try {
  console.log('tempTestCreate folder already existed,now removing...');
  execSync('rm -rf tempTestCreate && mkdir tempTestCreate');
  const child = spawn('node', ['../bin/index.js', '-b', boilerplate, 'test'], {
    stdio: 'inherit',
    cwd: path.resolve(process.cwd(), 'tempTestCreate'),
  });
  child.on('close', code => {
    if (code !== 0) {
      throw new Error('error:' + code);
    }
    execSync('rm -rf ./tempTestCreate');
  });
} catch (e) {
  console.error(chalk.red(e));
  execSync('rm -rf ./tempTestCreate');
}
