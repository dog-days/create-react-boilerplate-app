const chai = require('chai');
const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const semver = require('semver');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const utils = require('../packages/react-boilerplate-app-utils');

//使用chai-as-promised插件
chai.use(chaiAsPromised);
utils.checkNodeVersion('v6.0.0').should.true;

function itTitle(utilName) {
  return `utils.${utilName} should work correctly`;
}

describe('react-boilerplate-app-utils', function() {
  this.timeout(3000);
  it(itTitle('pathnameAdapter'), function() {
    utils
      .pathnameAdapter(path.resolve('/'))
      .indexOf('\\')
      .should.equal(-1);
  });
  it(`utils.scriptsPackagename should be correct.`, function() {
    utils.scriptsPackagename.should.equal('react-boilerplate-app-scripts');
  });
  it(itTitle('pathResolve'), function() {
    utils
      .pathResolve('README.md')
      .should.equal(path.resolve(process.cwd(), 'README.md'));
    utils
      .pathResolve('mocha.js', 'mocha')
      .should.equal(path.resolve(process.cwd(), 'node_modules/mocha/mocha.js'));
  });
  it(itTitle('shouldUseYarn'), function() {
    function shouldUseYarn() {
      try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
      } catch (e) {
        return false;
      }
    }
    utils.shouldUseYarn().should.equal(shouldUseYarn());
  });
  it(itTitle('getPackageJsonPathOfNodeModules'), function() {
    const packageName = 'mocha';
    utils
      .getPackageJsonPathOfNodeModules(packageName)
      .should.equal(
        path.resolve(process.cwd(), 'node_modules', packageName, 'package.json')
      );
  });
  it(itTitle('getCwdPackageJson'), function() {
    utils
      .getCwdPackageJson()
      .should.deep.equal(require(path.resolve(process.cwd(), 'package.json')));
  });
  it(itTitle('getDefaultCwdPackageJsonConfig'), function() {
    utils.getDefaultCwdPackageJsonConfig().should.deep.equal({
      appSrcPath: 'src',
      host: 'localhost',
      port: 8888,
      appEntryPath: 'src',
      appPublicPath: 'public',
      appLocalePath: 'src/i18n',
      index: 'index.html',
      prefixURL: '',
      basename: '',
      ip: '127.0.0.1',
    });
  });
  it(itTitle('isNpm2Warning'), function() {
    const npmVersion = execSync('npm --version').toString();
    if (semver.lt(npmVersion, '3.0.0')) {
      utils.isNpm2Warning().should.be.true;
    } else {
      utils.isNpm2Warning().should.be.false;
    }
  });
  it(itTitle('installPackages'), function(done) {
    this.timeout(0);
    const stub = sinon.stub(console, 'log');
    try {
      execSync('rm -rf tempTest && mkdir tempTest && cp package.json tempTest');
      utils
        .installPackages(['create-react-boilerplate-app'], {
          cwd: path.resolve(process.cwd(), 'tempTest'),
          stdio: 'pipe',
        })
        .should.eventually.equal(undefined)
        .notify(function() {
          execSync('rm -rf tempTest');
          stub.restore();
          done();
        });
    } catch (e) {
      console.log(chalk.red(e));
    }
  });
  it(itTitle('getVersionOfPackage'), function() {
    utils.getVersionOfPackage('mocha').should.equal('5.1.1');
  });
  it(itTitle('toUpperCaseByPosition'), function() {
    const str = 'mocha';
    utils.toUpperCaseByPosition(str).should.equal('Mocha');
    utils.toUpperCaseByPosition(str, 0, 2).should.equal('MOcha');
    utils.toUpperCaseByPosition(str, 0, str.length).should.equal('MOCHA');
  });
  it(itTitle('readdirSync'), function() {
    try {
      execSync('rm -rf tempTest && mkdir tempTest && cp package.json tempTest');
      execSync('cd tempTest && touch test.swp && touch test.swo');
      const files = utils.readdirSync(path.resolve(process.cwd(), 'tempTest'));
      files.should.deep.equal(['package.json']);
      execSync('rm -rf tempTest');
    } catch (e) {
      console.log(e);
    }
  });
  it(itTitle('transformToKBMBGB'), function() {
    utils.transformToKBMBGB(1024, { decimals: 1 }).should.equal('1.0KB');
    utils
      .transformToKBMBGB(Math.pow(1024, 2), { decimals: 2 })
      .should.equal('1.00MB');
    utils
      .transformToKBMBGB(Math.pow(1024, 3), { decimals: 2 })
      .should.equal('1.00GB');
    utils
      .transformToKBMBGB(Math.pow(1024, 4), { decimals: 2 })
      .should.equal('1.00TB');
    utils
      .transformToKBMBGB(Math.pow(1024, 5), { decimals: 2 })
      .should.equal('1.00PB');
  });
});
