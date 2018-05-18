const chai = require('chai');
const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const semver = require('semver');
const chaiAsPromised = require('chai-as-promised');
const utils = require('../packages/react-boilerplate-app-utils');

//使用chai-as-promised插件
chai.use(chaiAsPromised);
utils.checkNodeVersion('v6.0.0').should.true;

describe('create-react-boilerplate-app', function() {
  this.timeout(0);
  it(`create mvc-react`, function(done) {
    execSync('rm -rf tempTestCreate && mkdir tempTestCreate');
    const child = spawn(
      'node',
      [
        '../packages/create-react-boilerplate-app/bin/index.js',
        '-b',
        'mvc-react',
        'test',
      ],
      {
        stdio: 'inherit',
        cwd: path.resolve(process.cwd(), 'tempTestCreate'),
      }
    );
    child.on('close', code => {
      if (code !== 0) {
        throw new Error('error:' + code);
        return;
      }
      execSync('rm -rf ./tempTestCreate');
      done();
    });
  });
  it(`create simple`, function(done) {
    execSync('rm -rf tempTestCreate && mkdir tempTestCreate');
    const child = spawn(
      'node',
      [
        '../packages/create-react-boilerplate-app/bin/index.js',
        '-b',
        'simple',
        'test',
      ],
      {
        stdio: 'inherit',
        cwd: path.resolve(process.cwd(), 'tempTestCreate'),
      }
    );
    child.on('close', code => {
      if (code !== 0) {
        throw new Error('error:' + code);
        return;
      }
      execSync('rm -rf ./tempTestCreate');
      done();
    });
  });
});
