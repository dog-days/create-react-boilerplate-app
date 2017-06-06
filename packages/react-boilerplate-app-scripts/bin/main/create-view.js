'use strict';
const fs = require('fs-extra');
const path = require('path');
const commander = require('commander');
const chalk = require('chalk');
const util = require('react-boilerplate-app-utils');
const saveFilesByCustomContens = require('./decorator/SaveFilesByCustomContens');
const scriptsPackagename = 'react-boilerplate-app-scripts';
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);

class createView {
  constructor() {
    this.run();
  }

  getCommander() {
    var program = commander
      .arguments('<view-directory>')
      .usage(`${chalk.green('<view-directory>')} [options]`)
      //--xx-xx类型，缩写使用大写
      .option('-D, --data-flow [flow]', 'use redux or mobx')
      //--xx类型，缩写使用小写
      .option('-a, --all', 'create view with all features')
      .option('-i, --i18n', 'create view with locale feature(i18n)')
      .option('-b, --breadcrumb', 'create view with breadcrumb feature')
      .action(name => {
        //全转换成小写
        name.toLowerCase();
        //去掉'/'的影响。
        this.pageName = name.replace('/', '');
      })
      .parse(process.argv);
    if (!this.pageName) {
      console.log();
      console.error(chalk.red('Page name (view-directory) is required.'));
      program.outputHelp();
      process.exit(1);
      return;
    }
    if (!program.dataFlow) {
      program.dataFlow = 'redux';
    }
    //判断数据流管理类库是否合法
    var flow = ['redux', 'mobx'];
    if (flow.indexOf(program.dataFlow) === -1) {
      console.error(chalk.red('--data-flow should be redux or mobx!'));
      process.exit(1);
    }
    return program;
  }
  /**
   * 获取view模板的文件路径和保存的路径
   * @return { array }
   * [
   *    readFilesPath,
   *    saveFilesPath
   * ]
   */
  getViewTeplateDirFilesPath(dirPath) {
    var files = util.readdirSync(dirPath);
    var readFilesPath = [], saveFilesPath = [];
    //即将保存的app view目录
    var viewSavePath = path.resolve(
      cwdPackageJsonConfig.appSrcPath,
      'view',
      this.pageName
    );
    //当前读取的文件夹名
    var dirPathSplit = dirPath.split('/');
    var curentDirName = dirPathSplit[dirPathSplit.length - 1];
    files.map(v => {
      var file_path = path.resolve(dirPath, v);
      var curentDirNameSplit = file_path.split(curentDirName);
      readFilesPath.push(file_path);
      var save_path = path.join(viewSavePath, curentDirNameSplit[1]);
      saveFilesPath.push(save_path);
    });
    return [readFilesPath, saveFilesPath];
  }

  /**
   * 保存经过生成的view文件
   * @param { array } readFilesPath 需要读取的文件路径列表
   * @param { array } saveFilesPath 需要保存的文件路径列表，跟readFilesPath的索引和文件名一致。
   * @param { object } program commander对象
   */
  savePageViewFiles(readFilesPath, saveFilesPath, program) {
    var viewSavePath = path.resolve(
      cwdPackageJsonConfig.appSrcPath,
      'view',
      this.pageName
    );
    //保存目录存在提示
    if (fs.existsSync(viewSavePath)) {
      console.warn(
        chalk.yellow('The path below is existed,use other instead.')
      );
      console.log(chalk.cyan(viewSavePath));
      process.exit(1);
    }
    this.saveByFilesPath(readFilesPath, saveFilesPath, program, true);
  }

  run() {
    var program = this.getCommander();
    if (!program) {
      return;
    }
    //整合package.json feature
    Object.assign(program, cwdPackageJsonConfig.feature);
    var dataFlow = program.dataFlow;
    var viewTemplatePath = path.resolve(
      __dirname,
      `../../template/en_US-${dataFlow}-view`
    );
    var zh_CN = util.getZHCN();
    if (zh_CN) {
      viewTemplatePath = path.resolve(
        __dirname,
        `../../template/zh_CN-${dataFlow}-view`
      );
    }
    var filesPath = this.getViewTeplateDirFilesPath(viewTemplatePath);
    //beign--进行了自定义标签处理
    //可以通过用户的命令配置需要的功能，跟create-view的命令基本一致
    this.savePageViewFiles(filesPath[0], filesPath[1], program);
    //end--进行了自定义标签处理
    require('./route.js')();
    //require('./reducer.js')();
  }
}
module.exports = saveFilesByCustomContens(createView);
