'use strict';

const fs = require('fs');
const path = require('path');

const symlinkPath = path.resolve(__dirname, '../template');
if (fs.existsSync(symlinkPath)) {
  fs.unlinkSync(symlinkPath);
}
fs.symlinkSync(
  path.resolve(__dirname, '../../@react-boilerplates'),
  symlinkPath,
  'dir'
);
console.log(
  'react-boilerplates symlinked to react-boilerplate-app-scripts/template successfully.'
);
