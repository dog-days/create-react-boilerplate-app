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
    // var boilerplateJson = this.getBoilerpalteJson();
    this.packageJson = {
      version: '0.0.1',
      dependencies: {},
      devDependencies: {},
    };
    this.packageJson.name = 'app';
    this.dependencies = ['react', 'react-dom', 'prop-types'];
    this.devDependencies = [
      'react-boilerplate-app-utils',
      'react-boilerplate-app-scripts',
      'react-boilerplates',
    ];
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
      .option(
        '-b, --boilerplate [boilerplate]',
        'create app with specified boilerplate'
      )
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
        `  ${chalk.cyan(program.name())} ${chalk.green(
          'my-react-boilerplate-app'
        )}`
      );
      console.log();
      console.log(
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
      );
      process.exit(1);
    }
    return program;
  }
  //获取当前模板的config.json
  getConfigJson() {
    try {
      const boilerplate = this.program.boilerplate;
      const node_modules = path.resolve(process.cwd(), 'node_modules');
      let configPath = path.resolve(
        node_modules,
        'react-boilerplates',
        boilerplate,
        'config.json'
      );
      return fs.readJsonSync(configPath);
    } catch (e) {
      return {};
    }
  }

  //检测appName是否合法
  checkAppName() {
    const validationResult = validateNpmPackageName(this.appName);
    if (!validationResult.validForNewPackages) {
      console.error(
        `Could not create a project called ${chalk.red(
          `"${this.appName}"`
        )} because of npm naming restrictions:`
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
   * @return { boolean } true or false
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
        'scripts',
        'init.js'
      );
      const init = require(initPath);
      new init(this.program, this.appName);
    } catch (e) {
      console.error(e);
      process.exit();
    }
  }
  symlinkBoilerplates() {
    const node_modules = path.resolve(process.cwd(), 'node_modules');
    const symlinkPath = path.resolve(
      node_modules,
      'react-boilerplate-app-scripts/template'
    );
    fs.removeSync(symlinkPath);
    fs.symlinkSync(
      path.resolve(node_modules, 'react-boilerplates'),
      symlinkPath,
      'dir'
    );
  }
  /**
   * 安装boilerpalte中config.json的dependencies
   */
  installConfigJsonPackages() {
    const configJson = this.getConfigJson();
    this.dependencies = this.dependencies.concat(configJson.dependencies || []);
    this.devDependencies = this.devDependencies.concat(
      configJson.devDependencies || []
    );
    const allConfigDependencies = []
      .concat(configJson.dependencies)
      .concat(configJson.devDependencies);
    util.installPackages(allConfigDependencies).then(() => {
      try {
        this.symlinkBoilerplates();
        this.writeResultPackageJson();
        this.initApp();
      } catch (e) {
        console.log(e);
      }
    });
  }
  installPackages(allDependencies) {
    allDependencies = allDependencies.map(dependency => {
      switch (dependency) {
        case 'react-boilerplate-app-utils':
        case 'react-boilerplate-app-scripts':
        case 'react-boilerplates':
          if (fs.existsSync(path.resolve(__dirname, '../../../packages'))) {
            const targetPath = path.resolve(__dirname, '../../', dependency);
            //非安装环境使用当前的packages/xxx，不使用远程的。
            return targetPath;
          }
          return dependency;
        default:
          return dependency;
      }
    });
    util.installPackages(allDependencies).then(() => {
      try {
        this.installConfigJsonPackages();
      } catch (e) {
        console.log(e);
      }
    });
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
    this.installPackages(this.allDependencies);
  }
}

module.exports = function() {
  new CreateApp();
};
