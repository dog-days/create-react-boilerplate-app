#!/usr/bin/env node
'use strict';

const util = require('react-boilerplate-app-utils');
const scriptsPackagename = util.scriptsPackagename;
require(util.pathResolve('scripts/build.js', scriptsPackagename));
