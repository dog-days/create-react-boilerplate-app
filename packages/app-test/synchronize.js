const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

var cwdPackageJson = fs.readJsonSync(path.resolve(__dirname, 'package.json'));
var scriptsPackageJson = fs.readJsonSync(
  path.resolve('../react-boilerplate-app-scripts', 'package.json')
);
for (var k in scriptsPackageJson.dependencies) {
  cwdPackageJson.dependencies[k] = scriptsPackageJson.dependencies[k];
}
for (var k in scriptsPackageJson.devDependencies) {
  cwdPackageJson.dependencies[k] = scriptsPackageJson.devDependencies[k];
}
//处理scripts
for (var k in cwdPackageJson.scripts) {
  if (cwdPackageJson.scripts[k].indexOf('.js') === -1) {
    //如果没有.js
    cwdPackageJson.scripts[k] = cwdPackageJson.scripts[k].replace(
      'react-boilerplate-app-scripts',
      './node_modules/react-boilerplate-app-scripts/bin/react-boilerplate-app-scripts.js'
    );
  }
}
cwdPackageJson.scripts['sync'] = 'node ./synchronize.js';
cwdPackageJson.scripts['init'] =
  'node ./node_modules/react-boilerplate-app-scripts/bin/init.js';
//删除dll
delete cwdPackageJson['react-boilerplate-app-scripts'];
fs.writeFileSync(
  path.resolve('./package.json'),
  JSON.stringify(cwdPackageJson, null, 2)
);
fs.removeSync(path.resolve('src'));
fs.removeSync(path.resolve('test'));
fs.removeSync(path.resolve('public'));
fs.removeSync(path.resolve('README.md'));
fs.removeSync(path.resolve('karma.conf.js'));
fs.removeSync(path.resolve('config.js'));
