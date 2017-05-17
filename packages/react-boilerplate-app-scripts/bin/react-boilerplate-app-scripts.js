#!/usr/bin/env node --harmony
'use strict';

const fs = require('fs-extra');
const path = require("path");
const commander = require('commander');
const util = require('react-boilerplate-app-utils');

//检测node版本
util.checkNodeVersion("v6.0.0");

const packageJson = path.resolve(__dirname,"../package.json");

commander
  .version(packageJson.version)
  .command('start', 'start dev server')
  .command('build', 'production building')
  .command('ac', 'routes and reducers atuo creater')
  .command('create-view', 'create page view template')
  .command('view-locale-to-excel', 'generate view locale string to Excel lists')
  .command('excel-to-locale-config', 'generate locale string to config file from excel')
  .parse(process.argv);
