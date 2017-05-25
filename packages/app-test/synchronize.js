const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

var cwdPackageJson = fs.readJsonSync(path.resolve(__dirname, 'package.json'));
var scriptsPackageJson = fs.readJsonSync(
  path.resolve('../react-boilerplate-app-scripts', 'package.json')
);
var jsPackageJson = fs.readJsonSync(
  path.resolve('../react-redux-boilerplate-js', 'package.json')
);

for (var k in jsPackageJson.dependencies) {
  cwdPackageJson.dependencies[k] = jsPackageJson.dependencies[k];
}
for (var k in jsPackageJson.devDependencies) {
  cwdPackageJson.dependencies[k] = jsPackageJson.devDependencies[k];
}
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
fs.writeFileSync(
  path.resolve('./package.json'),
  JSON.stringify(cwdPackageJson, null, 2)
);
