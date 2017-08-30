'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('react-boilerplate-app-utils');
const validateNpmPackageName = require('validate-npm-package-name');
const commander = require('commander');
const chalk = require('chalk');

const scriptsPackagename = 'react-boilerplate-app-scripts';

class CreateApp {
  constructor() {
    this.program = this.commandSetting();
    var boilerplateJson = this.getBoilerpalteJson();
    this.packageJson = {
      name: 'app',
      version: '0.0.1',
      dependencies: {},
      devDependencies: {},
    };
    this.packageJson.name = boilerplateJson.name;
    this.dependencies = ['react', 'react-dom', 'prop-types'];
    this.dependencies = this.dependencies.concat(
      boilerplateJson.dependencies || []
    );
    this.devDependencies = ['react-boilerplate-app-scripts'];
    this.devDependencies = this.devDependencies.concat(
      boilerplateJson.devDependencies || []
    );
    this.allDependencies = []
      .concat(this.dependencies)
      .concat(this.devDependencies);
    this.run();
  }

  readCurrentProjectPackageJSON() {
    var packageJsonPath = path.resolve(__dirname, '../package.json');
    var json = fs.readJsonSync(packageJsonPath);
    return json;
  }

  commandSetting() {
    var currentPakageJson = this.readCurrentProjectPackageJSON();
    var program = new commander.Command(currentPakageJson.name)
      .version(currentPakageJson.version)
      .arguments('<project-directory>')
      .usage(`${chalk.green('<project-directory>')} [options]`)
      .option('-b, --boilerplate', 'create app with specified boilerplate')
      .action(name => {
        this.appName = name;
      })
      .allowUnknownOption()
      .parse(process.argv);
    if (!program.boilerplate) {
      program.boilerplate = 'mvc-react';
    }
    if (!this.appName) {
      console.error('Please specify the project directory:');
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
      );
      console.log();
      console.log('For example:');
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('my-react-boilerplate-app')}`
      );
      console.log();
      console.log(
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
      );
      process.exit(1);
    }
    return program;
  }
  //获取当前模板的json文件信息，用于生产app的package.json信息
  //boilerplate.json的结构跟package.json很相似。
  getBoilerpalteJson() {
    var boilerplate = this.program.boilerplate;
    var boilerplateJsonPath = path.resolve(
      __dirname,
      '../boilerplate-config',
      boilerplate + '.json'
    );
    try {
      var boilerplateJson = fs.readJsonSync(boilerplateJsonPath);
      return boilerplateJson;
    } catch (e) {
      console.log(chalk.red(boilerplateJsonPath + '：'));
      console.log(chalk.red('模板配置文件不存在！'));
      console.log();
      //console.log(e);
      process.exit();
    }
  }
  //检测appName是否合法
  checkAppName() {
    var validationResult = validateNpmPackageName(this.appName);
    if (!validationResult.validForNewPackages) {
      console.error(
        `Could not create a project called ${chalk.red(`"${this.appName}"`)} because of npm naming restrictions:`
      );
      util.printValidationResults(validationResult.errors, 'error');
      util.printValidationResults(validationResult.warnings, 'warning');
      process.exit(1);
    }
  }
  //初始化的package.json
  writeInitialPackageJson() {
    this.packageJson.name = this.appName;
    fs.writeFileSync(
      path.resolve(this.appPath, './package.json'),
      JSON.stringify(this.packageJson, null, 2)
    );
  }
  //成功安装后的的package.json
  writeResultPackageJson() {
    this.dependencies.forEach(v => {
      v = v.split('@')[0];
      let version = util.getVersionOfPackage(v);
      this.packageJson.dependencies[v] = '^' + version;
    });
    this.devDependencies.forEach(v => {
      v = v.split('@')[0];
      let version = util.getVersionOfPackage(v);
      this.packageJson.devDependencies[v] = '^' + version;
    });
    fs.writeFileSync(
      path.resolve(this.appPath, './package.json'),
      JSON.stringify(this.packageJson, null, 2)
    );
  }
  /**
   * 检查当前目录是否合法
   * @return { Boolean } true or false
   */
  checkPathDirIsValid() {
    try {
      if (fs.existsSync(this.appPath)) {
        console.error(`The path ${chalk.red(this.appPath)} exists.`);
        process.exit(1);
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * 安装完后初始化app项目
   */
  initApp() {
    try {
      const initPath = path.resolve(
        process.cwd(),
        'node_modules',
        scriptsPackagename,
        'bin/main',
        'init.js'
      );
      const init = require(initPath);
      new init(this.program, this.appName);
    } catch (e) {
      process.exit(1);
      console.error(e);
    }
  }

  run() {
    this.appPath = util.resolveCwd(this.appName);
    this.checkPathDirIsValid();
    this.checkAppName();
    //保证路径存在
    fs.ensureDirSync(this.appPath);
    //进入app文件夹中
    process.chdir(this.appPath);
    console.log();
    console.log(`Creating a new react-boilerplate-app in `);
    console.log(`${chalk.green(this.appPath)}.`);
    console.log();
    this.writeInitialPackageJson();
    util.installPackages(this.allDependencies).then(() => {
      try {
        this.writeResultPackageJson();
        this.initApp();
      } catch (e) {
        console.log(e);
      }
    });
  }
}

module.exports = function() {
  new CreateApp();
};
