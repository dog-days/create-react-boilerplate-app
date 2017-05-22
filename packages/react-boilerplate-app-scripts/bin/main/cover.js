'use strict';

const fs = require('fs-extra');
const path = require("path");
const util = require('react-boilerplate-app-utils');
const commander = require('commander');
const chalk = require('chalk');
const Basic = require('./Basic');

class Cover extends Basic {

  constructor(){
    super();
    this.run();
  }

  commandSetting(){
    var program = new commander.Command(this.packageJson.name)
      .version(this.packageJson.version)
      .arguments('<file-name>')
      .usage(`${chalk.green('<file-name>')}`)
      .option('-l, --list', 'file lists which can be covered.')
      .action((name) => {
        this.fileName = name;
      })
      .parse(process.argv);
    this.program = program;
    if(program.list){
      console.log();
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
      console.log();
      process.exit();
    }
    if (!this.fileName) {
      var useYarn = util.shouldUseYarn();
      var displayedCommand = 'npm run';
      if(useYarn){
        displayedCommand = 'yarn';
      }
      console.error('Please specify the file name:');
      console.log(
        `  ${chalk.cyan(displayedCommand)} use ${chalk.green('<file-name>')}`
      );
      console.log();
      console.log('For example:');
      console.log(`  ${chalk.cyan(displayedCommand)} cover ${chalk.green('webpack.config.dev.js')}`);
      console.log();
      console.log(`use ${ chalk.cyan(displayedCommand + ' cover -- -l ') } to see the file lists which can be covered.`)
      console.log();
      process.exit(1);
    }
  }
  /**
   * copy if exist or create file.
   *@param { string } name 文件名
   */
  coverFile(name){
    try {
      switch(name){
        case 'webpack.config.dev.js':
        case 'webpack.config.prod.js':
        case 'paths.js':
        case 'proxy.js':
        case 'historyApiFallback.js':
          var copyPath = path.resolve(`config/${ name }`);
          var originPath = path.resolve(__dirname,`../../config/${ name }`);
          fs.ensureFileSync(copyPath);
          if(fs.existsSync(originPath)){
            fs.copySync(
              originPath,
              copyPath
            )
          }else {
            var content = 'module.exports = { };';
            fs.writeFileSync(
              copyPath,
              content
            );
          }
          console.log();
          console.log(`${ chalk.green(this.fileName) } is created in:`);
          console.log(chalk.cyan(copyPath));
        break;
      }
    }catch(e){
      console.log(e);
      process.exit(1);
    }
  }

  run(){
    this.coverFile(this.fileName);
  }

}
module.exports = function(){
  new Cover();
}
