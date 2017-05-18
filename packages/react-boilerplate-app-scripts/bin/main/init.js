#!/usr/bin/env node --harmony
'use strict';
const fs = require('fs-extra');
const path = require("path");
const chalk = require('chalk');
const commander = require('commander');
const util = require('react-boilerplate-app-utils');
const Basic = require('./Basic.js');
const saveFilesByCustomContens = require('./decorator/SaveFilesByCustomContens');
const FindFilesPathByDir = require('react-boilerplate-app-utils/FindFilesPathByDir');
const scriptsPackagename = 'react-boilerplate-app-scripts';

class init extends Basic{
  /**
   * @param { object } program commander对象
   */
  constructor(program,appName){
    super();
    if(program){
      this.program = program;
    }else {
      this.program = this.getCommander();
    }
    if(!appName){
      //避免报错
      appName = 'test';
    }
    this.appName = appName;
    this.run();
  }

  getCommander(){
    var program = commander
      .option('-a, --all', 'create view with all features')
      .option('-i, --i18n', 'create view with locale feature(i18n)')
      .option('-b, --breadcrumb', 'create view with breadcrumb feature')
      .parse(process.argv);
    return program;
  }

  /**
  * 检查当前目录是否合法
  * 如果src目录存在将提示并退出程序
  */
  checkCurrentDirIsValid(){
    try {
      if(fs.existsSync(util.resolveCwd("src"))){
        console.error(chalk.red("The project should not contain src folder!"))
        process.exit(1);
        return false;
      }else {
        return true;
      }
    }catch(e){
      console.error(e);
    }
  }
  //成功初始化后，重新写入scirpts
  writePackageJson(){
    var pacakgeJsonPath = path.resolve(process.cwd(),'package.json');
    var packageJson = fs.readJsonSync(pacakgeJsonPath);
    //适配scirpts
    packageJson.scripts = {};
    for(var k in this.packageJson['scripts']){
      if(k != 'init'){
        var command = this.packageJson['scripts'][k];
        var match = command.match(/node.*\.\/bin\/(.*)\.js/);
        if(match && match[1]){
          packageJson.scripts[k] = this.packageJson['scripts'][k].replace(match[0],match[1]);
        }
      }
    }
    packageJson.babel = this.packageJson.babel;
    packageJson[scriptsPackagename] = this.packageJson[scriptsPackagename];
    //删除src目录的设置，使用默认的
    if(packageJson[scriptsPackagename].appSrcPath){
      delete packageJson[scriptsPackagename].appSrcPath;
    }
    var zh_CN = util.getZHCN();
    if(zh_CN){
      packageJson[scriptsPackagename].language = zh_CN;
    }else {
      packageJson[scriptsPackagename].language = 'en_US';
    }
    packageJson['eslintConfig'] = this.packageJson['eslintConfig'];
    fs.writeFileSync(
      pacakgeJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }
  /**
   * 获取指定文件夹中的所有文件绝对路径（所有的js和jsx文件，包括所有的后代子文件）
   */
  getSavedSrcDirFilesPath(savePath){
    var filesPath = FindFilesPathByDir({
      path: savePath,
      fileName: '*'
    });
    //只要js、jsx后缀的文件路径
    var files = filesPath.filter((v,k)=>{
      if(v.indexOf('.js') !== -1){
        return true;
      }
      if(v.indexOf('.jsx') !== -1){
        return true;
      }
    });
    return files;
  }

  run(){
    this.checkCurrentDirIsValid();
    var zh_CN = util.getZHCN();
    var srcPath;
    if(zh_CN){
      srcPath = path.resolve(__dirname,"../../template/zh_CN-src");
    }else {
      srcPath = path.resolve(__dirname,"../../template/en_US-src");
    }
    fs.ensureDirSync(srcPath);
    var savePath = path.resolve(process.cwd(),"src");
    fs.copySync(srcPath,savePath,{
      dereference: true,
    });
    //beign--进行了自定义标签处理
    //可以通过用户的命令配置需要的功能，跟create-view的命令基本一致
    var filesPath = this.getSavedSrcDirFilesPath(savePath);
    this.saveByFilesPath(filesPath,filesPath,this.program);
    //end--进行了自定义标签处理
    this.writePackageJson();
    console.log()
    var ac = require("./route-reducer-creater.js");
    new ac();
    this.instruction();
  }

  instruction(){
    var appPath = path.resolve(process.cwd(),'../');
    var appName = this.appName;
    var useYarn = util.shouldUseYarn();
    var displayedCommand = 'npm';
    if(useYarn){
      displayedCommand = 'yarn';
    }
    console.log();
    console.log(chalk.green('Success!'));
    console.log(`Created ${chalk.cyan(appName)} at `);
    console.log(`${appPath}`)
    console.log();
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} start`));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} create-view(cv for short)`));
    console.log('    Creates new page view.');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} create-route-reducer(ac for short)`));
    console.log('    Creates routes and reducers base on the _route.js and reducer.js files.');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} view-locale-to-excel(vlte for short)`));
    console.log('    Creates i18n excel by reading src path,which passing string by `this.t("xx")`');
    console.log();
    console.log(chalk.cyan(`  ${displayedCommand} excel-to-locale-config(etlc for short)`));
    console.log('    Creates i18n config .js by reading excel witch is translated.');
    console.log();
    console.log(
      chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
    );
    console.log('    Bundles the app into static files for production.');
    console.log();
  }
}
//这里使用了高阶组件
module.exports = saveFilesByCustomContens(init);

