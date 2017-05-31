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

class Route extends Basic {
  constructor() {
    super();
    this.run();
  }

  commandSetting() {
    commander
      .version(this.packageJson.version)
      .option('-w, --watch', 'watch to create routes')
      .parse(process.argv);
    if (commander) {
      var r2Path = path.resolve(__dirname, '../main/libs');
      this.createRoute = require(path.resolve(r2Path, 'createRouteFile.js'));
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

  //watch生成routes
  watchRun(f) {
    if (f.indexOf('_route.js') != -1) {
      this.create();
    }
    // console.log(f)
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
  // 获取view和layout文件夹相对路径
  getViewAndLayoutDirPaths() {
    var viewPath, layoutPath;
    if (!commander.viewModel) {
      viewPath = [cwdPackageJsonConfig.appSrcPath];
      layoutPath = cwdPackageJsonConfig.appSrcPath + '/view/layout';
    }
    return {
      viewPath,
      layoutPath,
    };
  }
  //生成routes和reducers文件
  create() {
    var viewAndLayoutDirPaths = this.getViewAndLayoutDirPaths(),
      viewPath = viewAndLayoutDirPaths.viewPath,
      layoutPath = viewAndLayoutDirPaths.layoutPath,
      createRoute = this.createRoute;
    new createRoute({
      path: viewPath,
      tplPath: path.resolve(this.r2Path, 'tpl/routes.tpl.js'),
      fileName: '_route.js',
      savePath: cwdPackageJsonConfig.routesPath,
      layoutPath,
    });
  }
}
module.exports = function() {
  return new Route();
};
