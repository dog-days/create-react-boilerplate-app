const chai = require('chai');
const path = require('path');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const chaiAsPromised = require('chai-as-promised');
const utils = require('../packages/react-boilerplate-app-utils');

//使用chai-as-promised插件
chai.use(chaiAsPromised);
utils.checkNodeVersion('v6.0.0').should.true;

const boilerplateAppPath = path.resolve(
  process.cwd(),
  'packages/create-react-boilerplate-app'
);
describe('create-react-boilerplate-app', function() {
  this.timeout(0);
  function testTemplate(boilerplateName) {
    it(`create ${boilerplateName}`, function(done) {
      const child = spawn('npm', ['run', 'test', boilerplateName], {
        stdio: 'inherit',
        cwd: boilerplateAppPath,
      });
      child.on('close', code => {
        if (code !== 0) {
          throw new Error('error:' + code);
          return;
        }
        done();
      });
    });
  }
  const boilerplates = ['simple', 'simple-ts', 'mvc-react'];
  boilerplates.forEach(function(boilerplate) {
    testTemplate(boilerplate);
  });
});
