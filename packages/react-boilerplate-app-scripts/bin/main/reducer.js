'use strict';
const fs = require('fs-extra');
const watch = require('chokidar');
const path = require('path');
const commander = require('commander');
const util = require('react-boilerplate-app-utils');
const Basic = require('./Basic');
const scriptsPackagename = 'react-boilerplate-app-scripts';
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);

class reducer extends Basic {
  constructor() {
    super();
    this.run();
  }

  commandSetting() {
    commander
      .version(this.packageJson.version)
      .option('-w, --watch', 'watch to create reducers')
      .parse(process.argv);
    if (commander) {
      var r2Path = path.resolve(__dirname, '../main/libs');
      this.createReducer = require(path.resolve(
        r2Path,
        'createReducerFile.js'
      ));
      this.r2Path = r2Path;
    }
  }

  run() {
    try {
      fs.ensureDirSync(path.resolve(process.cwd(), 'src'));
      this.create();
      this.watch();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  //watch生成routes和reducer文件
  watchRun(f) {
    if (f.indexOf('reducer.js') != -1) {
      this.create();
    }
  }
  //watch监听
  watch() {
    if (commander.watch) {
      var watcher = watch.watch(
        path.resolve(process.cwd(), cwdPackageJsonConfig.appSrcPath),
        {
          ignored: /[\/\\]\./,
          persistent: true,
          ignoreInitial: true,
        }
      );
      watcher
        .on('add', path => {
          this.watchRun(path);
        })
        .on('change', path => {
          this.watchRun(path);
        })
        .on('unlink', path => {
          this.watchRun(path);
        });
    }
  }
  //生成routes和reducers文件
  create() {
    var createReducer = this.createReducer;
    var viewPath = [cwdPackageJsonConfig.appSrcPath];
    new createReducer({
      path: viewPath,
      tplPath: path.resolve(this.r2Path, 'tpl/reducers.tpl.js'),
      fileName: 'reducer.js',
      savePath: cwdPackageJsonConfig.reducersPath,
    });
  }
}
module.exports = function() {
  return new reducer();
};
