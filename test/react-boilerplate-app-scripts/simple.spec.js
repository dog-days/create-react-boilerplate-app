const path = require('path');
const fs = require('fs');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');

const utils = require('../../packages/react-boilerplate-app-utils');

//使用chai-as-promised插件
chai.use(chaiAsPromised);
utils.checkNodeVersion('v6.0.0').should.true;

describe('react-boilerplate-app-scripts(simple)', function() {
  this.timeout(0);
  it('Initialization of boilerplate code works correctly.', function() {
    try {
      execSync(
        `cd ${path.resolve(
          process.cwd(),
          'packages/app-test'
        )} && node synchronize.js && npm run init -- -b simple`
      );
      fs.existsSync(path.resolve(process.cwd(), 'packages/app-test/src')).should
        .be.true;
      fs.existsSync(path.resolve(process.cwd(), 'packages/app-test/public'))
        .should.be.true;
      fs.existsSync(path.resolve(process.cwd(), 'packages/app-test/test'))
        .should.be.true;
      fs.existsSync(
        path.resolve(process.cwd(), 'packages/app-test/karma.conf.js')
      ).should.be.true;
    } catch (e) {
      console.log(e);
    }
  });

  it('Dll building should work correctly.', function(done) {
    const child = spawn('npm', ['run', 'build-dll'], {
      stdio: 'inherit',
      cwd: path.resolve(process.cwd(), 'packages/app-test'),
    });
    child.on('close', code => {
      if (code !== 0) {
        throw new Error('error:' + code);
        return;
      }
      done();
    });
  });
  it('Test should work correctly.', function(done) {
    this.timeout(0);
    const child = spawn('npm', ['run', 'test'], {
      stdio: 'pipe',
      cwd: path.resolve(process.cwd(), 'packages/app-test'),
    });
    child.on('close', code => {
      if (code !== 0) {
        throw new Error('error:' + code);
        return;
      }
      done();
    });
  });
  it('Building should work correctly.', function(done) {
    this.timeout(0);
    const child = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      cwd: path.resolve(process.cwd(), 'packages/app-test'),
    });
    child.on('close', code => {
      if (code !== 0) {
        throw new Error('error:' + code);
        return;
      }
      done();
    });
  });
});
