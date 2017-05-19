'use strict';
var fs = require('fs-extra');
var path = require("path");

/**
 * r2命令基类，
 * commandSetting方法，需要覆盖或继承，并用于命令设置
 * run方法自动执行命令定义后的动作
 * @property `packageInfo` 当前项目的package.json信息json对象
 */
class Basic {
  constructor(){
    this.readPackageJSON();
    this.commandSetting && this.commandSetting();
  }
  /**
  * 读取r2-cli项目package.json
  */
  readPackageJSON(){
    this.packageJsonPath = path.resolve(__dirname,"../../package.json");
    var json = fs.readJsonSync(this.packageJsonPath);
    this.packageInfo = json;
    this.packageJson = json;
  }
}

module.exports = Basic;
