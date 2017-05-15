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
    fs.writeFileSync(
      pacakgeJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
  }

  run(){
    var flag = this.checkCurrentDirIsValid();
    if(flag) {
      var srcPath = path.resolve(__dirname,"../../src");
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

