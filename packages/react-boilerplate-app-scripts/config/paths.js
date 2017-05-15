const path = require('path');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = 'react-boilerplate-app-scripts';
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);

function pathResolve(relativePath){
  return util.pathResolve(relativePath,__dirname,scriptsPackagename);
}

var paths = {
  webpackDevConfig: pathResolve("config/webpack.config.dev.js"),
  webpackProdConfig: pathResolve("config/webpack.config.prod.js"),
  appEntry: pathResolve("src/index.jsx"),
  //because not all the web app is in web root dir,it might be in the root child dir.
  //for example,PREFIX_URL = `/demo`，访问网站根目录demo文件中的web app
  appPublic: pathResolve('public'),
  appHtml: pathResolve('public/index.html'),
  appBuild: path.resolve(process.cwd(),'build',cwdPackageJsonConfig.prefixURL),
  src: path.resolve("src"),
}

module.exports = paths;
