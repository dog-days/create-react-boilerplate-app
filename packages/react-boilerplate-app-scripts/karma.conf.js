'use strict';
process.env.NODE_ENV = 'production';

const path = require('path');
const util = require('react-boilerplate-app-utils');
const scriptsPackagename = util.scriptsPackagename;
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));
const webpackConfig = require(util.pathResolve(
  'config/webpack.config.dev.js',
  scriptsPackagename
));

const rules = [
  {
    enforce: 'post',
    test: /\.js[x]?$/,
    include: new RegExp(paths.src),
    loader: 'istanbul-instrumenter-loader',
  },
];
webpackConfig.resolve.alias.test = path.resolve(paths.src, '../test');
webpackConfig.module.rules = rules.concat(webpackConfig.module.rules || []);

const files = [
  util.pathResolve('config/polyfills.js'),
  path.resolve(paths.src, '../test/first.spec.js'),
  path.resolve(paths.src, '../test/**/*.spec.js'),
];
const preprocessors = {};
files.forEach(filePath => {
  preprocessors[filePath] = ['webpack'];
});

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    client: {
      useIframe: true,
      // captureConsole: false,
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: files,

    // list of files / patterns to exclude
    exclude: ['**/*.swp'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    // web server port
    port: 9876,

    colors: true, // colors in the output (reporters and logs)
    // to avoid DISCONNECTED messages when connecting to BrowserStack
    browserDisconnectTimeout: 20 * 1000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 10 * 1000, // default 10000
    captureTimeout: 120 * 1000, // default 60000

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
      // 'Firefox',
    ],
    coverageIstanbulReporter: {
      reports: ['text-summary', 'lcovonly', 'html'],
      dir: 'coverage',
      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,
      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true, // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
      skipFilesWithNoCoverage: false,
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    webpack: {
      resolve: webpackConfig.resolve,
      module: webpackConfig.module,
      performance: webpackConfig.performance,
    },
  });
};
