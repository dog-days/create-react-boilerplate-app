'use strict';

process.env.NODE_ENV = 'production';

const util = require('react-boilerplate-app-utils');
const scriptsPackagename = util.scriptsPackagename;
const path = require('path');
const webpack = require('webpack');
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));
const fs = require('fs-extra');
const chalk = require('chalk');
const basename = cwdPackageJsonConfig.basename;
const config = require(paths.webpackDllConfig);
const Table = require('cli-table');
const gzipSize = require('gzip-size').sync;
const _ = require('lodash');
//如果没设置dll，直接返回
if (!cwdPackageJsonConfig.dll) {
  return;
}

const dllCompareJsonPath = path.resolve(paths.appPublic, 'dll-compare.json');
const dllAppPath = path.resolve(paths.appPublic, 'dll.app.js');
if (fs.existsSync(dllCompareJsonPath) && fs.existsSync(dllAppPath)) {
  const dllCompareJson = fs.readJsonSync(dllCompareJsonPath);
  if (_.isEqual(dllCompareJson, cwdPackageJsonConfig.dll)) {
    if (!process.argv[2]) {
      console.log(
        chalk.cyan(
          'Dll config is same with before,so dill files will not create again!'
        )
      );
      console.log(
        chalk.cyan(
          'If you have to update dill files,you can delete the dll-compare.json file in the folder: '
        )
      );
      console.log(chalk.green(paths.appPublic));
      console.log(chalk.cyan('Then run again the command.'));
    }
    //如果dll的配置一样，不用更新dll
    return;
  }
}

console.log();
console.log('Dll files not existed or dll config changed,now building...');
console.log();
webpack(config).run(function(err, stats) {
  if (err) {
    console.log(chalk.red('Failed to build dll.'));
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    util.printValidationResults(info.errors, 'error');
  }

  if (stats.hasWarnings()) {
    util.printValidationResults(info.warnings, 'warning');
  }
  if (info.assets && info.assets[0]) {
    //处理header
    var head = ['Asset', 'Real Size', 'Gzip Size', 'Chunks', '', 'Chunk Names'];
    head = head.reduce((a, b) => {
      a.push(chalk.cyan(b));
      return a;
    }, []);
    var table = new Table({
      head,
    });
    info.assets.forEach(v => {
      var sizeAfterGzip;
      if (v.name.match(/(.js$)|(.css$)/)) {
        var fileContents = fs.readFileSync(
          path.resolve(paths.appPublic, v.name)
        );
        sizeAfterGzip = gzipSize(fileContents);
      }
      table.push([
        chalk.green(basename + '/' + v.name),
        util.transformToKBMBGB(v.size, { decimals: 2 }),
        sizeAfterGzip
          ? util.transformToKBMBGB(sizeAfterGzip, { decimals: 2 })
          : '',
        v.chunks,
        v.emitted ? chalk.green('[emitted]') : '',
        v.chunkNames,
      ]);
    });
    console.log(`Hash: ${chalk.cyan(info.hash)}`);
    console.log(`Version: ${chalk.cyan(info.version)}`);
    console.log(`Time: ${chalk.cyan(info.time / 1000 + 's')}`);
    console.log();
    console.log(table.toString());
    console.log();
    console.log(`Dll files have been created in folder: `);
    console.log(chalk.cyan(paths.appPublic));
    console.log();
    //保存cwdPackageJsonConfig.dll中的配置,用于对比。
    fs.writeFileSync(
      path.resolve(paths.appPublic, 'dll-compare.json'),
      JSON.stringify(cwdPackageJsonConfig.dll || [], null, 2)
    );
  }
});
