'use strict';

const fs = require('fs-extra');
const path = require("path");
const util = require('react-boilerplate-app-utils');
const validateNpmPackageName = require('validate-npm-package-name');
const commander = require('commander');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const Basic = require('./libs/Basic');

const scriptsPackagename = 'react-boilerplate-app-scripts';

class CreateApp extends Basic {

  constructor(){
    super();
    this.packageJson = {
      name: "react-boilerplate-app",
      version: '0.0.1',
      dependencies: { },
      devDependencies: { }
    };
    this.dependencies = [
      'react-redux-boilerplate-js'
    ];
    this.devDependencies = [
      'react-boilerplate-app-scripts',
      'react-boilerplate-app-utils',
    ];
    this.allDependencies = [].concat(this.dependencies).concat(this.devDependencies);
    this.run();
  }

  commandSetting(){
    this.program = new commander.Command(this.packageJson.name)
      .version(this.packageJson.version)
      .arguments('<project-directory>')
      .usage(`${chalk.green('<project-directory>')} [options]`)
      .option('-a, --all', 'create view with all features')
      .option('-i, --i18n', 'create view with locale feature(i18n)')
      .option('-b, --breadcrumb', 'create view with breadcrumb feature')
      .action(name => {
        this.appName = name;
      })
      .allowUnknownOption()
      .parse(process.argv);
    var program = this.program;
    if (!this.appName) {
      console.error('Please specify the project directory:');
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
      );
      console.log();
      console.log('For example:');
      console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-redux-app')}`);
      console.log();
      console.log(
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
      );
      process.exit(1);
    }
  }
  //检测appName是否合法
  checkAppName(){
    var validationResult = validateNpmPackageName(this.appName);
    if (!validationResult.validForNewPackages) {
      console.error(
        `Could not create a project called ${chalk.red(`"${this.appName}"`)} because of npm naming restrictions:`
      );
      util.printValidationResults(validationResult.errors,"error");
      util.printValidationResults(validationResult.warnings,"warning");
      process.exit(1);
    }
  }
  //初始化的package.json
  writeInitialPackageJson(){
    this.packageJson.name = this.appName;
    fs.writeFileSync(
      path.resolve(this.appPath,"./package.json"),
      JSON.stringify(this.packageJson, null, 2)
    );
  }
  //成功安装后的的package.json
  writeResultPackageJson(){
    this.dependencies.forEach((v,k)=>{
      let version = util.getVersionOfPackage(v);
      this.packageJson.dependencies[v] = "^" + version;
    })
    this.devDependencies.forEach((v,k)=>{
      let version = util.getVersionOfPackage(v);
      this.packageJson.devDependencies[v] = "^" + version;
    })
    fs.writeFileSync(
      path.resolve(this.appPath,"./package.json"),
      JSON.stringify(this.packageJson, null, 2)
    );
  }
  /**
   * 检查当前目录是否合法
   * @return { Boolean } true or false
   */
  checkPathDirIsValid(){
    try {
      if(fs.existsSync(this.appPath)){
        console.error(`The path ${ chalk.red(this.appPath) } exists.`);
        process.exit(1);
      }
    }catch(e){
      console.error(e);
    }
  }
  /**
   * 安装完后初始化app项目
   */
  initApp(){
    try {
      const initPath = path.resolve(
        process.cwd(),
        'node_modules',
        scriptsPackagename,
        'bin/main',
        'init.js'
      );
      const init = require(initPath);
      new init(this.program,this.appName);
    }catch(e){
      process.exit(1);
      console.error(e)
    }
  }

  run(){
    this.appPath = util.resolveCwd(this.appName);
    this.checkPathDirIsValid();
    this.checkAppName();
    //保证路径存在
    fs.ensureDirSync(this.appPath);
    //进入app文件夹中
    process.chdir(this.appPath);
    console.log();
    console.log(`Creating a new react-boilerplate-app in `);
    console.log(`${chalk.green(this.appPath)}.`)
    console.log();
    this.writeInitialPackageJson();
    util.installPackages(this.allDependencies).then(()=>{
      this.writeResultPackageJson();
      this.initApp();
    });
  }

}

module.exports = function(){
  new CreateApp();
}
