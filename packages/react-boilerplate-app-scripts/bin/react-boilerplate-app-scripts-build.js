#!/usr/bin/env node --harmony
'use strict';

process.env.NODE_ENV = 'production';

const scriptsPackagename = 'react-boilerplate-app-scripts';

const path = require('path');
const fs = require('fs-extra');
const util = require('react-boilerplate-app-utils');
const paths = require(util.pathResolve('config/paths.js',__dirname,scriptsPackagename));
const webpack = require('webpack');
const config = require(paths.webpackProdConfig);

//清空build文件夹
fs.emptyDirSync(paths.appBuild);

console.log()
console.log('Building...');
console.log('This might take a couple minutes.');
console.log()
webpack(config).run(function(err,stats){
  if (err) {
    console.log(chalk.red('Failed to compile.'));
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  //复制除了index.html外的静态文件，所以public文件夹不要放不使用的文件
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file)=>{
      if(file === paths.appHtml){
        return false;
      }
      //public/mock目录不复制
      if(file === path.resolve(paths.appPublic,'mock')){
        return false;
      }
      return true;
    }
  });

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }
  console.log(stats.toString({
    chunks: false,  // 使构建过程更静默无输出
    colors: true    // 在控制台展示颜色
  }));
});

