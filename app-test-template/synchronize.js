'use strict';

const fs = require('fs-extra');
const path = require('path');
// const chalk = require('chalk');

let cwdPackageJson = fs.readJsonSync(path.resolve(__dirname, 'package.json'));
cwdPackageJson.scripts = {};
let scriptsPackageJson = fs.readJsonSync(
  path.resolve(__dirname, '../react-boilerplate-app-scripts', 'package.json')
);
for (let k in scriptsPackageJson.dependencies) {
  cwdPackageJson.dependencies[k] = scriptsPackageJson.dependencies[k];
}
for (let k in scriptsPackageJson.devDependencies) {
  cwdPackageJson.devDependencies[k] = scriptsPackageJson.devDependencies[k];
}
cwdPackageJson.scripts['sync'] = 'node ./synchronize.js';
cwdPackageJson.scripts['init'] =
  'node ../react-boilerplate-app-scripts/scripts/link-react-boilerplates.js && node ./node_modules/react-boilerplate-app-scripts/bin/init.js';
//删除dll
delete cwdPackageJson['react-boilerplate-app-scripts'];
fs.writeFileSync(
  path.resolve(__dirname, 'package.json'),
  JSON.stringify(cwdPackageJson, null, 2)
);
fs.removeSync(path.resolve(__dirname, 'src'));
fs.removeSync(path.resolve(__dirname, 'test'));
fs.removeSync(path.resolve(__dirname, 'public'));
fs.removeSync(path.resolve(__dirname, 'README.md'));
fs.removeSync(path.resolve(__dirname, 'karma.conf.js'));
fs.removeSync(path.resolve(__dirname, 'config.js'));
