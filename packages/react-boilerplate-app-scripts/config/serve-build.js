'use strict';

const serve = require('serve');
//const scriptsPackagename = require('./const').scriptsPackagename;
//const util = require('react-boilerplate-app-utils');
//const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
//scriptsPackagename
//);

serve(__dirname, {
  open: true,
  single: true,
  //basename: cwdPackageJsonConfig.basename,
});
