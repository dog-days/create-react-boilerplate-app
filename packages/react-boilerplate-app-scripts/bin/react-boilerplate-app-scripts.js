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
  .command('build-dll', 'Dll building')
  .command('use', 'Use a feature such as less,sass and immutable.js.')
  .command(
    'cover',
    'Overwrite the configuration file, such as webpack.config.dev.js.'
  )
  .parse(process.argv);
