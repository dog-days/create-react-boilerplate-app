'use strict';
console.log();
console.log('Building...');
console.log('This might take a couple minutes.');
console.log();

process.env.NODE_ENV = 'production';

const util = require('react-boilerplate-app-utils');
const scriptsPackagename = util.scriptsPackagename;
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));
const webpack = require('webpack');
const config = require(paths.webpackProdConfig);
const Table = require('cli-table');
const archiver = require('archiver');
const _ = require('lodash');
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);
const basename = cwdPackageJsonConfig.basename;
const gzipSize = require('gzip-size').sync;
const topBuildFolder = util.getTopBuildFolderPath(paths.appBuild, basename);

function zip() {
  let archiverName = cwdPackageJsonConfig.archiver;
  if (!archiverName) {
    return;
  }
  if (_.isBoolean(archiverName)) {
    archiverName = 'build.zip';
  }
  const archiverNameSplit = archiverName.split('.');
  if (
    archiverNameSplit.length !== 2 ||
    (!~archiverName.indexOf('.zip') && !~archiverName.indexOf('.tar'))
  ) {
    console.log();
    console.log(
      chalk.yellow(
        `archive name must contain and end with ${chalk.cyan(
          '.zip'
        )} or ${chalk.cyan('.tar')}`
      )
    );
    console.log(
      `See ${path.resolve(process.cwd(), 'package.json')} ${chalk.cyan(
        'react-boilerplate-app-scripts'
      )} field.`
    );
    return;
  }
  const suffix = archiverNameSplit[1];
  // create a file to stream archive data to.
  var output = fs.createWriteStream(path.resolve(process.cwd(), archiverName));
  var archive = archiver(suffix, {
    // Sets the compression level.
    zlib: { level: 9 },
    //设置为当前时区的时间
    forceLocalTime: true,
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function() {
    console.log();
    console.log('Generate compressed package', chalk.cyan(archiverName), 'at');
    console.log(chalk.cyan(path.resolve(process.cwd(), archiverName)));
    console.log();
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {});

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });
  // pipe archive data to the file
  archive.pipe(output);
  archive.directory(topBuildFolder, false);
  // append a file from string
  archive.append(
    `The current version is ${util.getCwdPackageJson().version}.`,
    {
      name: 'version.txt',
    }
  );
  archive.finalize();
}

//清空build文件夹
fs.emptyDirSync(topBuildFolder);

webpack(config).run(function(err, stats) {
  if (err) {
    console.log(chalk.red('Failed to build.'));
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  //复制除了index.html外的静态文件，所以public文件夹不要放不使用的文件
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => {
      if (file === paths.appHtml) {
        return false;
      }
      //public/mock目录不复制
      if (file === path.resolve(paths.appPublic, 'mock')) {
        return false;
      }
      //public/websocket目录不复制
      if (file === path.resolve(paths.appPublic, 'websocket')) {
        return false;
      }
      return true;
    },
  });

  const info = stats.toJson();
  if (stats.hasErrors()) {
    util.printValidationResults(info.errors, 'error');
  }

  if (stats.hasWarnings()) {
    util.printValidationResults(info.warnings, 'warning');
  }
  if (info.assets && info.assets[0]) {
    //处理header
    var head = ['Asset', 'Real Size', 'Gzip Size', 'Chunks'];
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
          path.resolve(paths.appBuild, v.name)
        );
        sizeAfterGzip = gzipSize(fileContents);
      }
      if (v.name.length > 47) {
        v.name = v.name.substring(0, 47) + '...';
      }
      table.push([
        chalk.green(v.name),
        util.transformToKBMBGB(v.size, { decimals: 2 }),
        sizeAfterGzip
          ? util.transformToKBMBGB(sizeAfterGzip, { decimals: 2 })
          : '',
        v.chunks,
      ]);
    });
    console.log(`Hash: ${chalk.cyan(info.hash)}`);
    console.log(`Version: ${chalk.cyan(info.version)}`);
    console.log(`Time: ${chalk.cyan(info.time / 1000 + 's')}`);
    console.log();
    console.log(table.toString());
    console.log();
    const useYarn = util.shouldUseYarn();
    console.log(`The ${chalk.cyan('build')} folder: `);
    console.log(chalk.cyan(topBuildFolder));
    console.log('is ready to be served.');
    console.log('You may serve it with a static server:');
    console.log();
    var displayedCommand = 'npm run';
    if (useYarn) {
      displayedCommand = 'yarn';
    }
    console.log(chalk.cyan(` ${displayedCommand} serve-build`));
    zip();
  }
});
