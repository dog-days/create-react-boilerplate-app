#!/usr/bin/env node
'use strict';
const util = require('react-boilerplate-app-utils');
const chalk = require('chalk');
const script = process.argv[2];
//检测node版本
util.checkNodeVersion("v6.0.0");
if(!script){
  console.log(chalk.yellow('Unknown script "' + script + '".'));
  console.log(chalk.cyan('Perhaps you need to update create-react-boilerplate-app?'));
}

switch(script){
  case 'use':
    require('./use')();
  break;
  default:
    require('./create-react-boilerplate-app')();
  break;
}
