'use strict';

process.env.NODE_ENV = 'development';

const scriptsPackagename = 'react-boilerplate-app-scripts';

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const openBrowser = require('react-dev-utils/openBrowser');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const detect = require('detect-port');
const util = require('react-boilerplate-app-utils');
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));
var proxy;
var proxyPath = util.pathResolve('config/proxy.js', scriptsPackagename);
if (proxyPath) {
  proxy = require(proxyPath);
}
var historyApiFallbackPath = util.pathResolve(
  'config/historyApiFallback.js',
  scriptsPackagename
);
var historyApiFallback;
if (historyApiFallbackPath) {
  historyApiFallback = require(historyApiFallbackPath);
}
const config = require(paths.webpackDevConfig);
const compiler = webpack(config);
const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);
const host = cwdPackageJsonConfig.host;
//port 可以被修改，会被占用
var port = cwdPackageJsonConfig.port;
//经过转换后的historyApiFallback rewrites
if (
  cwdPackageJsonConfig.historyApiFallback &&
  cwdPackageJsonConfig.historyApiFallback.rewrites
) {
  var rewrites = util.historyApiFallbackRewiriteAdapter(
    cwdPackageJsonConfig.historyApiFallback.rewrites
  );
  cwdPackageJsonConfig.historyApiFallback.rewrites = rewrites;
}
const useYarn = util.shouldUseYarn();

function runDevServer(host, port) {
  var devServer = new WebpackDevServer(compiler, {
    /**
     * WebpackDevServer 提供的对外设置路由访问功能
     * create-react-boilerplate-app在这里提供了mock服务
     */
    setup(app) {
      //begin----http mock处理
      /**
       * @param { string } mockRule mock规则，可以使正则表达式
       * eg. '/common-api/(.*)'
       * @param { string } moackTarget mock目标路径，相对于`path.publicPath`。
       * eg. '/mock/$1.json|400'
       */
      function mock(mockRule, mockTarget) {
        var mock = new RegExp(mockRule);
        var matchStatusReg = /\|(.*)$/;
        var target = mockTarget;
        var statusMatch = target.match(matchStatusReg);
        var status = (statusMatch && target.match(matchStatusReg)[1]) || 200;
        target = target.replace(matchStatusReg, '');
        app.all(mock, function(req, res) {
          var targetPath = target;
          var match = req.url.match(mock);
          match.forEach((v, k) => {
            targetPath = targetPath.replace(`$${k}`, v);
          });
          //mock文件路径
          var mockFilePath = path.join(paths.appPublic, targetPath);
          if (fs.existsSync(mockFilePath)) {
            var mockContents = fs.readFileSync(mockFilePath, {
              encoding: 'utf-8',
            });
            res.status(status).send(mockContents);
          } else {
            res.status(404).send(req.url + ' not found.');
          }
        });
      }
      var mockConfig = cwdPackageJsonConfig.mock;
      for (var k in mockConfig) {
        mock(k, mockConfig[k]);
      }
      //end----http mock处理
    },
    //开启HTML5 History API，所有请求都重定向到index.html（地址重写）
    historyApiFallback: historyApiFallback ||
      cwdPackageJsonConfig.historyApiFallback ||
      true,
    // 开启gzip功能
    compress: true,
    // 关闭WebpackDevServer繁琐的输出信息
    // 但警告和错误信息不会被关闭
    clientLogLevel: 'none',
    //静态文件
    contentBase: paths.appPublic,
    //开启热替换server
    hot: true,
    //跟webpack.config中publicPath相等，内存文件输出目录
    publicPath: config.output.publicPath,
    //会关闭WebpackDevServer编译后所有的信息（包括错误警告信息），后续通过compiler.plugin('done',null)自定义信息
    quiet: true,
    //watch设置
    watchOptions: {
      ignored: [/node_modules/, '**/*.swp', '**/*.swo', '**/*.xlsx'],
    },
    host: host || 'localhost',
    //packageJson中的proxy只能是字符串，无法使用函数
    proxy: proxy || cwdPackageJsonConfig.proxy || {},
  });
  //设置跨域访问，配合mock服务使用
  devServer.app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
  // 启动WebpackDevServer.
  var server = devServer.listen(port, err => {
    if (err) {
      return console.log(err);
    }
    console.log();
  });
  //begin----websocket mock服务
  if (cwdPackageJsonConfig.websocketMock) {
    var websocketMockConfig = cwdPackageJsonConfig.websocketMock;
    const socketIo = require('socket.io');
    const io = socketIo(server);
    io.on('error', function(err) {
      console.log(err);
    });
    io.on('connection', socket => {
      try {
        var mockObject, file;
        for (var k in websocketMockConfig.emit) {
          var v = websocketMockConfig.emit[k];
          file = path.join(paths.appPublic, v.url);
          if (!fs.existsSync(file)) {
            console.log();
            console.log(chalk.cyan(file));
            console.log(chalk.red('mock文件不存在！'));
            process.exit(1);
            console.log();
          }
          mockObject = require(file);
          v.type.forEach(t => {
            function getData() {
              if (
                Object.prototype.toString.apply(mockObject) !==
                '[object Function]'
              ) {
                console.log();
                console.log(chalk.red('mock的js文件必须返回函数！'));
                process.exit(1);
                console.log();
              }
              if (websocketMockConfig.log) {
                console.log();
                console.log('type: ', chalk.cyan('emit'));
                console.log('mock file path: ', chalk.cyan(file));
                console.log();
              }
              //传入type参数
              return mockObject(t) || {};
            }
            try {
              var data = getData();
              socket.emit(k, data);
            } catch (e) {
              console.log(e);
            }
          });
        }
        for (var j in websocketMockConfig.on) {
          var value = websocketMockConfig.on[j];
          file = path.join(paths.appPublic, value);
          if (!fs.existsSync(file)) {
            console.log();
            console.log(chalk.cyan(file));
            console.log(chalk.red('mock文件不存在！'));
            console.log();
            process.exit(1);
          }
          mockObject = require(file);
          socket.on(j, (data, callback) => {
            if (
              Object.prototype.toString.apply(mockObject) !==
              '[object Function]'
            ) {
              console.log();
              console.log(chalk.red('mock的js文件必须返回函数！'));
              console.log();
              process.exit(1);
            }
            var result = mockObject(data) || {};
            if (websocketMockConfig.log) {
              console.log();
              console.log('type: ', chalk.cyan('on'));
              console.log('mock file path: ', chalk.cyan(file));
              console.log('params: ', JSON.stringify(result, null, 2));
            }
            callback(result);
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }
  //end----websocket mock服务
}

var isFirstCompile = true;
compiler.plugin('done', function(stats) {
  var messages = stats.toJson({}, true);
  var isError = messages.errors.length;
  if (!isError) {
    console.log(chalk.green('Compiled successfully!'));
    console.log();
  }

  if (!isError && isFirstCompile) {
    console.info(
      chalk.cyan(
        '==> 🌎  Listening on port %s. Open up http://' +
          host +
          ':%s/ in your browser.'
      ),
      port,
      port
    );
    console.log();
    var displayedCommand = 'npm run build';
    if (useYarn) {
      displayedCommand = 'yarn build';
    }
    console.log(
      'Production building,please use ' + chalk.cyan(displayedCommand) + '.'
    );
    console.log();
    isFirstCompile = false;
    openBrowser(`http://${host}:${port}/${cwdPackageJsonConfig.prefixURL}`);
  }

  // 展示错误信息
  if (messages.errors.length) {
    console.log(chalk.red('faild to compile!'));
    console.log();
    messages.errors.forEach(message => {
      console.log(message);
      console.log();
    });
    return;
  }

  //展示警告信息
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.'));
    console.log();
    messages.warnings.forEach(message => {
      console.log(message);
      console.log();
    });
  }
});
// "invalid" 是 "bundle invalidated" 缩写
// 不意味有错误
// 只要保存监控文件，就会触发重编译
// 重编译就是触发”invalid“事件
//compiler.plugin('invalid', () => {
//console.log('Compiling...');
//});

detect(port, (err, _port) => {
  if (err) {
    console.log(err);
  }
  if (port == _port) {
    runDevServer(host, port);
  } else {
    console.log(chalk.yellow(`port: ${port} was occupied, try port: ${_port}`));
    console.log();
    console.log(
      chalk.cyan(
        `It's recommended to add 'port: ${_port}' in package.json's field 'react-boilerplate-app-scripts'.`
      )
    );
    console.log();
    port = _port;
    runDevServer(host, _port);
  }
});
