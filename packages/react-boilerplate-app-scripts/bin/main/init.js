'use strict';
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const util = require('react-boilerplate-app-utils');
const Basic = require('./Basic.js');
const scriptsPackagename = require('../../config/const').scriptsPackagename;

class init extends Basic {
  /**
   * @param { object } program commander对象
   */
  constructor(program, appName) {
    super();
    if (program) {
      this.program = program;
    } else {
      this.program = this.getCommander();
    }
    if (!appName) {
      //避免报错
      appName = 'test';
    }
    this.appName = appName;
    this.run();
  }

  getCommander() {
    var program = commander
      .option('-b, --boilerplate [boilerplate]', 'boilerplate name')
      .parse(process.argv);
    if (!program.boilerplate) {
      program.boilerplate = 'mvc-react';
    }
    return program;
  }

  /**
  * 检查当前目录是否合法
  * 如果src目录存在将提示并退出程序
  */
  checkCurrentDirIsValid() {
    try {
      if (fs.existsSync(util.resolveCwd('src'))) {
        console.error(chalk.red('The project should not contain src folder!'));
        process.exit(1);
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  }
  //获取当前模板的scripts.json文件信息，用于生产app的package.json的scripts信息
  //scripts.json的结构跟package.json的scripts一致。
  getScriptsJson() {
    var boilerplate = this.program.boilerplate;
    var scriptsJsonPath = path.resolve(
      __dirname,
      '../../template',
      boilerplate,
      'scripts.json'
    );
    var scriptsJson = fs.readJsonSync(scriptsJsonPath);
    return scriptsJson;
  }
  //成功初始化后，重新写入scripts
  writePackageJson() {
    var scriptsJson = {};
    try {
      scriptsJson = this.getScriptsJson();
    } catch (e) {
      console.log();
    }
    var pacakgeJsonPath = path.resolve(process.cwd(), 'package.json');
    var packageJson = fs.readJsonSync(pacakgeJsonPath);
    //适配scripts，针对当前项目的package.json中的scripts，去除部分信息
    packageJson.scripts = {};
    for (var k in this.packageJson['scripts']) {
      if (k != 'init') {
        var command = this.packageJson['scripts'][k];
        var match = command.match(/node.*\.\/bin\/(.*)\.js/);
        if (match && match[1]) {
          packageJson.scripts[k] = this.packageJson['scripts'][k].replace(
            match[0],
            match[1]
          );
        }
      }
    }
    //绑定boilerplate中的scripts
    packageJson.scripts = Object.assign(packageJson.scripts, scriptsJson);
    packageJson.babel = this.packageJson.babel;
    packageJson[scriptsPackagename] = {
      historyApiFallback: {
        verbose: true,
      },
    };
    packageJson.eslintConfig = this.packageJson.eslintConfig;
    fs.writeFileSync(pacakgeJsonPath, JSON.stringify(packageJson, null, 2));
  }

  /**
   * 复制template中的文件夹
   * @param { string } targetDir 目标复制的文件夹名
   * @param { string } partDirName 复制的后创建文件夹名（相对于项目根目录），存放复制文件
   * @return { string } 复制保存后的文件夹路径
   */
  coypDir(targetDir, partDirName) {
    //template目录下的文件夹路径
    var templateDirPath = path.resolve(
      __dirname,
      `../../template/${targetDir}`
    );
    if (!fs.existsSync(templateDirPath)) {
      console.error(chalk.yellow(templateDirPath + ' is not exist.'));
      process.exit(1);
    }
    //相对于项目根目录
    var savePath = path.resolve(process.cwd(), partDirName);
    fs.copySync(templateDirPath, savePath, {
      dereference: true,
    });
    return savePath;
  }

  run() {
    this.checkCurrentDirIsValid();
    var boilerplate = this.program.boilerplate;
    this.coypDir('public', 'public');
    var srcSavePath = this.coypDir(boilerplate, 'src');
    fs.removeSync(path.resolve(srcSavePath, 'scripts.json'));
    fs.moveSync(
      path.resolve(srcSavePath, 'README.md'),
      path.resolve(srcSavePath, '../README.md'),
      { overwrite: true }
    );
    this.writePackageJson();
    this.instruction();
  }

  instruction() {
    var appPath = path.resolve(process.cwd(), '../');
    var appName = this.appName;
    var useYarn = util.shouldUseYarn();
    var displayedCommand = 'npm run';
    if (useYarn) {
      displayedCommand = 'yarn';
    }
    console.log();
    console.log(chalk.green('Success!'));
    console.log(`Created ${chalk.cyan(appName)} at `);
    console.log(`${appPath}`);
    console.log();
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} start`));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} use <feature-name>`));
    console.log('    Use a feature such as less,sass');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} cover <file-name>`));
    console.log(
      '    Overwrite the configuration file, such as webpack.config.dev.js.'
    );
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} build`));
    console.log('    Bundles the app into static files for production.');
    console.log();
  }
}
module.exports = init;
