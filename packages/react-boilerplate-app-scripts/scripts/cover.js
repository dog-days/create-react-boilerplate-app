'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('react-boilerplate-app-utils');
const commander = require('commander');
const chalk = require('chalk');
const Basic = require('./Basic');

class Cover extends Basic {
  constructor() {
    super();
    this.run();
  }

  commandSetting() {
    var program = new commander.Command(this.packageJson.name)
      .version(this.packageJson.version)
      .arguments('<file-name>')
      .usage(`${chalk.green('<file-name>')}`)
      .option('-l, --list', 'file lists which can be covered.')
      .action(name => {
        this.fileName = name;
      })
      .parse(process.argv);
    this.program = program;
    if (program.list) {
      console.log();
      console.log(chalk.cyan('webpack.config.dll.js'));
      console.log(
        '   dll plugin webpack config，now just support one dll file.'
      );
      console.log(chalk.cyan('webpack.config.dev.js'));
      console.log('   development webpack config.');
      console.log(chalk.cyan('webpack.config.prod.js'));
      console.log('   production webpack config.');
      console.log(chalk.cyan('paths.js'));
      console.log('   some path config for react-boilerplate-app-scripts.');
      console.log(chalk.cyan('proxy.js'));
      console.log('   webpack-dev-server proxy.');
      console.log(chalk.cyan('historyApiFallback.js'));
      console.log('   webpack-dev-server historyApiFallback.');
      console.log(chalk.cyan('start.js'));
      console.log('   development service starting.');
      console.log(chalk.cyan('build.js'));
      console.log('   production building.');
      console.log(chalk.cyan('build-dll.js'));
      console.log('   dll file building.');
      console.log(chalk.cyan('serve-build.js'));
      console.log('   Starting a static service for build folder.');
      console.log();
      process.exit();
    }
    if (!this.fileName) {
      var useYarn = util.shouldUseYarn();
      var displayedCommand = 'npm run';
      if (useYarn) {
        displayedCommand = 'yarn';
      }
      console.error('Please specify the file name:');
      console.log(
        `  ${chalk.cyan(displayedCommand)} use ${chalk.green('<file-name>')}`
      );
      console.log();
      console.log('For example:');
      console.log(
        `  ${chalk.cyan(displayedCommand)} cover ${chalk.green(
          'webpack.config.dev.js'
        )}`
      );
      console.log();
      console.log(
        `use ${chalk.cyan(
          displayedCommand + ' cover -- -l '
        )} to see the file lists which can be covered.`
      );
      console.log();
      process.exit();
    }
  }
  /**
   * copy if exist or create file.
   *@param { string } name 文件名
   */
  coverFile(name) {
    let copyPath, originPath;
    try {
      switch (name) {
        case 'webpack.config.dll.js':
        case 'webpack.config.dev.js':
        case 'webpack.config.prod.js':
        case 'paths.js':
        case 'proxy.js':
        case 'historyApiFallback.js':
          copyPath = path.resolve(`config/${name}`);
          originPath = path.resolve(__dirname, `../../config/${name}`);
          break;
        case 'start.js':
        case 'build.js':
        case 'build-dll.js':
        case 'serve-build.js':
          copyPath = path.resolve(`scripts/${name}`);
          originPath = path.resolve(__dirname, `${name}`);
          break;
      }
      fs.ensureFileSync(copyPath);
      if (fs.existsSync(originPath)) {
        fs.copySync(originPath, copyPath);
      } else {
        //错误兼容处理
        var content = 'module.exports = { };';
        fs.writeFileSync(copyPath, content);
      }
      console.log();
      console.log(`${chalk.green(this.fileName)} is created in:`);
      console.log(chalk.cyan(copyPath));
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  run() {
    this.coverFile(this.fileName);
  }
}
module.exports = function() {
  new Cover();
};
