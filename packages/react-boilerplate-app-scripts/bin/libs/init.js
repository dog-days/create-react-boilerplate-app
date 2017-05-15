#!/usr/bin/env node --harmony
'use strict';
const fs = require('fs-extra');
const path = require("path");
const chalk = require('chalk');
const util = require('react-boilerplate-app-utils');
const Basic = require('./Basic.js');
const scriptsPackagename = 'react-boilerplate-app-scripts';

class init extends Basic{

  constructor(){
    super();
    this.run();
  }

  /**
  * 检查当前目录是否合法
  * @return { Boolean } true or false
  */
  checkCurrentDirIsValid(){
    try {
      if(fs.existsSync(util.resolveCwd("src"))){
        console.error(chalk.red("The project should not contain src folder!"))
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
    var zh_CN = this.getZHCN();
    if(zh_CN){
      packageJson[scriptsPackagename].language = zh_CN;
    }
    packageJson['eslintConfig'] = this.packageJson['eslintConfig'];
    fs.writeFileSync(
      pacakgeJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }
  /**
   * 获取zH_CN字符
   * @return { string || undefined } 返回zh_CN 或者 undefined
   */
  getZHCN(){
    if(process.env.LANG){
      return process.env.LANG.split('.')[0];
    }
  }

  run(){
    var flag = this.checkCurrentDirIsValid();
    if(flag) {
      var zh_CN = this.getZHCN();
      var srcPath;
      if(zh_CN){
        srcPath = path.resolve(__dirname,"../../template/zh_CN-src");
      }else {
        srcPath = path.resolve(__dirname,"../../template/en_US-src");
      }
      fs.ensureDirSync(srcPath);
      fs.copySync(srcPath,path.resolve(process.cwd(),"src"),{
        dereference: true,
      });
      this.writePackageJson();
      var ac = require("./ac.js");
      new ac();
    }
  }
}
module.exports = init;

