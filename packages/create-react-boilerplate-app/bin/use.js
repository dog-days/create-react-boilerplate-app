'use strict';

const fs = require('fs-extra');
const path = require("path");
const util = require('react-boilerplate-app-utils');
const commander = require('commander');
const chalk = require('chalk');
const Basic = require('./libs/Basic');

const scriptsPackagename = 'react-boilerplate-app-scripts';

class Use extends Basic {

  constructor(){
    super();
    this.run();
  }

  commandSetting(){
    this.program = new commander.Command(this.packageJson.name)
      .version(this.packageJson.version)
      .arguments('<use> <feature-name>')
      .usage(`${chalk.green('<feature-name>')}`)
      .action((use,name) => {
        this.featureName = name;
      })
      .parse(process.argv);
    var program = this.program;
    if (!this.featureName) {
      console.error('Please specify the feature name:');
      console.log(
        `  ${chalk.cyan(program.name())} use ${chalk.green('<feature-name>')}`
      );
      console.log();
      console.log('For example:');
      console.log(`  ${chalk.cyan(program.name())} use ${chalk.green('less')}`);
      console.log();
      process.exit(1);
    }
  }
  /**
   * 获取需要安装的包
   * @return { array }
   *  [
   *    dependencies,
   *    devDependencies,
   *  ]
   */
  getDependencies(type){
    var dependencies = [];
    var devDependencies = [];
    switch(type){
      case 'less':
        dependencies = [];
        devDependencies = ['less','less-loader'];
      break;
      case 'sass':
        dependencies = [];
        devDependencies = ['node-sass','sass-loader'];
      break;
      case 'immutable':
        dependencies = [];
        devDependencies = ['immutable@3.8.1','redux-immutable@3.0.6'];
      break;
    }
    return [
      dependencies,
      devDependencies,
    ]
  }
  /**
   * 保存新增的包信息到package.json
   * @param { object } packageJson 原项目的package.json对象
   * @param { array } dependencies
   * @param { array } devDependencies
   */
  writeNewPackageJson(packageJson,dependencies,devDependencies){
    dependencies.forEach((v,k)=>{
      var v = v.replace(/@.*/,'');
      let version = util.getVersionOfPackage(v);
      packageJson.dependencies[v] = "^" + version;
    })
    devDependencies.forEach((v,k)=>{
      var v = v.replace(/@.*/,'');
      let version = util.getVersionOfPackage(v);
      packageJson.devDependencies[v] = "^" + version;
    })
    fs.writeFileSync(
      path.resolve(process.cwd(),"package.json"),
      JSON.stringify(packageJson, null, 2)
    );
  }

  run(){
    var dependencies = this.getDependencies(this.featureName);
    var allDependencies = [].concat(dependencies[0]).concat(dependencies[1]);
    var packageJson = util.getCwdPackageJson();
    util.installPackages(allDependencies).then(()=>{
      this.writeNewPackageJson(packageJson,dependencies[0],dependencies[1]);
    }).catch(function(e){
      console.error(e);
      process.exit(1);
    });
  }

}
module.exports = function(){
  new Use();
}
