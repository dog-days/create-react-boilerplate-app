#!/usr/bin/env node
'use strict';

const path = require('path');
const commander = require('commander');
const util = require('react-boilerplate-app-utils');

//检测node版本
util.checkNodeVersion('v6.0.0');

const packageJson = path.resolve(__dirname, '../package.json');

commander
  .version(packageJson.version)
  .command('start', 'Start dev server')
  .command('build', 'Production building')
  .command('route', 'Routes atuo creater')
  .command('reducer', 'Reducers atuo creater')
  .command('create-view', 'Create page view template')
  .command('view-locale-to-excel', 'Generate view locale string to Excel lists')
  .command(
    'excel-to-locale-config',
    'Generate locale string to config file from excel'
  )
  .command('use', 'Use a feature such as less,sass and immutable.js.')
  .command(
    'cover',
    'Overwrite the configuration file, such as webpack.config.dev.js.'
  )
  .parse(process.argv);
