#!/usr/bin/env node --harmony
'use strict';
const fs = require('fs-extra');
const watch = require('chokidar');
const path = require("path");
const commander = require('commander');
const util = require('react-boilerplate-app-utils');
const Basic = require('./Basic');
const scriptsPackagename = 'react-boilerplate-app-scripts';

class ac extends Basic {
  constructor(){
    super();
    this.run();
    //当前输入目录中的packageJson config子段
    this.cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);
  }

  commandSetting(){
    commander
      .version(this.packageInfo.version)
      .option('-w, --watch', 'watch to create route and reducers')
      .option('-m, --viewModel', 'render src/page/.viewModel')
      .parse(process.argv);
    if(commander){
      var r2Path = path.resolve(__dirname,"../main/script");
      this.createRoute = require(path.resolve(r2Path,"createRouteFile.js"));
      this.createReducer = require(path.resolve(r2Path,"createReducerFile.js"));
      this.r2Path = r2Path;
    }
  }

  getCwdPackageJson(){
    return fs.readJsonSync(path.resolve('package.json'));
  }

  run(){
    fs.ensureDir(path.resolve(process.cwd(),"src"),(err)=>{
      if(!err){
        this.create();
        this.watch();
      }else{
        console.log(color.red(err))
      }
    })
  }

  //watch生成routes和reducer文件
  watchRun(f){
    if(f.indexOf("reducer.js") != -1){
      this.create();
    }
    if(f.indexOf("_route.js") != -1){
      this.create();
    }
    // console.log(f)
  }
  //watch监听
  watch(){
    if(commander.watch){
      var watcher = watch.watch(path.resolve(process.cwd(),"src/page"), {
        ignored: /[\/\\]\./,
        persistent: true,
        ignoreInitial: true,
      }); 
      watcher.on('add', path => {
        this.watchRun(path);
      }).on('change', path => {
        this.watchRun(path);
      }).on('unlink', path => {
        this.watchRun(path);
      }); 
    }
  }
  // 获取view和layout文件夹相对路径
  getViewAndLayoutDirPaths(){
    var viewPath,layoutPath;
    if(!commander.viewModel){
      viewPath = [
        this.cwdPackageJsonConfig.appSrcPath,
      ];
      layoutPath = this.cwdPackageJsonConfig.appSrcPath + "/view/layout";
    }
    return {
      viewPath,
      layoutPath,
    }
  }
  //生成routes和reducers文件
  create(){
    var viewAndLayoutDirPaths = this.getViewAndLayoutDirPaths(), 
      viewPath = viewAndLayoutDirPaths.viewPath,
      layoutPath = viewAndLayoutDirPaths.layoutPath,
      createRoute = this.createRoute;
    new createRoute({
      path: viewPath,
      tplPath: path.resolve(this.r2Path, "route_tpl"),
      fileName: "_route.js",
      savePath: this.cwdPackageJsonConfig.routesPath,
      layoutPath,
    });

    var createReducer = this.createReducer;
    new createReducer({
      path: viewPath,
      tplPath: path.resolve(this.r2Path, "reducer_tpl"),
      fileName:"reducer.js",
      savePath: this.cwdPackageJsonConfig.reducersPath,
    });
  }
}
module.exports = ac;







