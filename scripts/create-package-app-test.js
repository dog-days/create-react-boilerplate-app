'use strict';

const fs = require('fs-extra');
const path = require('path');
const savePath = path.resolve(process.cwd(), 'packages/app-test');
const savePackageJsonPath = path.resolve(
  process.cwd(),
  savePath,
  'package.json'
);
fs.copySync(path.resolve(process.cwd(), 'app-test-template'), savePath);
const scriptsPacakgeJson = require('../packages/react-boilerplate-app-scripts/package.json');
const appTestPacakgeJson = require(savePackageJsonPath);
appTestPacakgeJson.dependencies['react-boilerplate-app-scripts'] =
  '^' + scriptsPacakgeJson.version;
fs.writeFileSync(
  savePackageJsonPath,
  JSON.stringify(appTestPacakgeJson, null, 2)
);
