//  "node scripts/create-package-app-test.js && node packages/app-test/synchronize.js && node packages/react-boilerplate-app-scripts/scripts/link-react-boilerplates.js && lerna bootstrap",
'use strict';
require('./create-package-app-test.js');
require('../packages/app-test/synchronize.js');
require('../packages/react-boilerplate-app-scripts/scripts/link-react-boilerplates.js');

const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

try {
  //begin----加上packages/app-test
  const lernaJson = require('../lerna.json');
  const packagesFolderName = 'packages/app-test';
  if (lernaJson.packages.indexOf(packagesFolderName) === -1) {
    //可能中途ctr+c，导致包名没被删除
    lernaJson.packages.push(packagesFolderName);
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../lerna.json'),
    JSON.stringify(lernaJson, null, 2)
  );
  //end----加上packages/app-test
  execSync('npm run lerna-bootstrap', { stdio: 'inherit' });
  //begin----移除packages/app-test，发布的时候不会发布这个的，只是用来测试
  if (lernaJson.packages.indexOf(packagesFolderName) !== -1) {
    lernaJson.packages.splice(
      lernaJson.packages.indexOf(packagesFolderName),
      1
    );
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../lerna.json'),
    JSON.stringify(lernaJson, null, 2)
  );
  //end----移除packages/app-test，发布的时候不会发布这个的，只是用来测试
} catch (e) {
  console.log(e);
}
