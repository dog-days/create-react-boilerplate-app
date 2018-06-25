'use strict';
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const semver = require('semver');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const mockjs = require('mockjs');
const _ = require('lodash');

//node 版本v5.0.0以上，util不要使用class等新语法
module.exports = {
  /**
   * 兼容linux和widows平台路径
   * @param  {string} pathString 需要处理的路径
   * @return {string}            处理后的的路径
   */
  platformPathAdapter(pathString) {
    const platform = require('os').platform();
    if (platform === 'win32') {
      pathString = pathString.replace(/\\/g, '/');
    }
    return pathString;
  },
  //scripts工具package名
  scriptsPackagename: 'react-boilerplate-app-scripts',
  /**
   * react-router pathname适配
   * 例如url=test或者test/或者/test/会适配为/test
   * @param  {string} pathname 需要处理的pathanme
   * @return {string}          适配后的pathanme
   */
  pathnameAdapter(pathname) {
    if (!pathname) {
      return;
    }
    if (Object.prototype.toString.apply(pathname) !== '[object String]') {
      console.error('请传入字符串！');
      return;
    }
    //pathname第一个字符必须是'/'
    if (pathname[0] !== '/') {
      pathname = '/' + pathname;
    }
    //pathname最后一个字符不能是'/'
    if (pathname[pathname.length - 1] === '/') {
      pathname = pathname.slice(0, pathname.length - 1);
    }
    return pathname;
  },
  resolveCwd(relativePath) {
    return path.resolve(process.cwd(), relativePath);
  },
  /**
   * 会根据当前项目，或者当前项目指定的node_modules中的packageName路径
   * 依次查找文件
   * @param {string} relativePath 相对路径，跟path.resolve的参数一致，如果使用绝对路径，直接返回绝对路径
   * @param {string} packageName node_modules中的packageName文件夹名
   * @return {string || undefined} 返回优先匹配的路径
   */
  pathResolve(relativePath, packageName) {
    if (!packageName) {
      packageName = 'react-boilerplate-app-scripts';
    }
    if (!relativePath) {
      return;
    }
    if (!fs.existsSync(this.resolveCwd('node_modules'))) {
      console.error(chalk.red('This project must have node_modules folder! '));
      console.log();
      console.error(
        chalk.red('Please do not change the node_modules folder name!')
      );
      return;
    }
    var entryOfCwdPath = this.resolveCwd(relativePath);
    var entryOfPackagePath = this.resolveCwd(
      `node_modules/${packageName}/${relativePath}`
    );
    if (fs.existsSync(entryOfCwdPath)) {
      return entryOfCwdPath;
    } else if (fs.existsSync(entryOfPackagePath)) {
      return entryOfPackagePath;
    }
  },
  /**
   * 打印数组类型
   * @param {array} results 结果数组
   * @param {string} type 信息类型success、waring、error
   */
  printValidationResults(results, type) {
    if (!type) {
      type = 'success';
    }
    var colors;
    switch (type) {
      case 'success':
        colors = chalk.green;
        break;
      case 'warning':
        colors = chalk.yellow;
        break;
      case 'error':
        colors = chalk.red;
        break;
    }
    results &&
      results.forEach(error => {
        console.error(colors(error));
      });
  },
  /**
   * 是否应该使用yarn
   * @return {boolean} true or false
   */
  shouldUseYarn() {
    try {
      execSync('yarnpkg --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  },
  /**
   * 获取package.json的路径，前提路径是在npm项目根目录运行
   * @param { string } packageName node_modules中的包名
   * @return { string } path
   */
  getPackageJsonPathOfNodeModules(packageName) {
    return path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'package.json'
    );
  },
  /**
   * 获取当前输入目前package.json对象
   * @return {object} package.js配置的json对象
   */
  getCwdPackageJson() {
    //防止重复读取
    if (!this.cwdPackageJson) {
      this.cwdPackageJson = require(path.resolve(
        process.cwd(),
        'package.json'
      ));
    }
    return this.cwdPackageJson;
  },
  /**
   * 获取当前输入目前package.json对象指定的package config
   * @param  {string} packageName 指定的字段（一般都是以pacakge名来命名）
   * @return {object} 默认的配置
   */
  getDefaultCwdPackageJsonConfig(packageName) {
    if (!packageName) {
      packageName = 'react-boilerplate-app-scripts';
    }
    var config = this.getCwdPackageJson()[packageName] || {};
    //默认值，路径都是相对npm项目根目录
    config = Object.assign(
      {},
      {
        //app 程序目录
        appSrcPath: 'src',
        host: 'localhost',
        port: 8888,
        //routesPath: '${src}/.routes.js',
        //reducersPath: '${src}/.reducers.js',
        //app 程序入口js文件
        appEntryPath: '${src}',
        //dev server静态资源访问目录
        appPublicPath: 'public',
        //多语言文件夹
        appLocalePath: '${src}/i18n',
        //app 入口html文件名，在上面appPublicPath的文件夹下。
        index: 'index.html',
        prefixURL: '',
        basename: '',
      },
      config
    );
    if (config.host === 'localhost') {
      config.ip = '127.0.0.1';
    }
    config.port = parseInt(config.port, 10);
    //替换${src}为config.appSrcPath的值
    for (var k in config) {
      if (Object.prototype.toString.apply(config[k]) === '[object String]') {
        config[k] = config[k].replace(/\${.*src.*}/, config.appSrcPath);
      }
    }
    //prefix url 兼容适配处理
    if (config.prefixURL) {
      config.prefixURL = this.pathnameAdapter(config.prefixURL);
    }
    //prefixURL改名为basename，兼容适配处理
    if (config.basename) {
      config.basename = this.pathnameAdapter(config.basename);
      config.prefixURL = config.basename;
    }
    return config;
  },
  /**
   * 检测输入node版本是否大于等于跟当前运行的版本
   * 如果不是将提示并退出程序
   * @param { string } version eg. v6.0.0
   */
  checkNodeVersion(version) {
    if (!semver.satisfies(process.version, '>=' + version)) {
      console.error(
        chalk.red(
          'You are running Node %s.\n' +
            'Create React App requires Node %s or higher. \n' +
            'Please update your version of Node.'
        ),
        process.version,
        version
      );
      process.exit(1);
    } else {
      return true;
    }
  },
  /**
   * 检测npm版本是npm v2.x.x版本
   * @return { boolean } true or false
   */
  isNpm2Warning() {
    var isNpm2 = false;
    try {
      const npmVersion = execSync('npm --version').toString();
      isNpm2 = semver.lt(npmVersion, '3.0.0');
    } catch (err) {
      return false;
    }
    if (!isNpm2) {
      return false;
    }
    console.log(chalk.yellow('It looks like you are using npm 2.'));
    console.log(
      chalk.yellow(
        'We suggest using npm 3 or Yarn for faster install times ' +
          'and less disk space usage.'
      )
    );
    console.log();
  },
  /**
   * 安装的dependences，dependences为undefined时安装全部依赖包
   * @param {array} dependencies 依赖包
   * @param {object} options 同行child_process.spawn的options，请参考
   *        http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
   * @return {object} 返回promise
   */
  installPackages(dependencies, options) {
    var useYarn = this.shouldUseYarn();
    return new Promise((resolve, reject) => {
      if (!dependencies[0]) {
        resolve();
        console.log('Nothing to install.');
        return;
      }
      console.log(`Installing ${dependencies} packages.`);
      console.log('This might take a couple minutes.');
      var command;
      var args;
      if (useYarn) {
        command = 'yarnpkg';
        if (dependencies) {
          args = ['add', '--exact'];
          [].push.apply(args, dependencies);
        }
      } else {
        this.isNpm2Warning();
        command = 'npm';
        if (dependencies) {
          args = ['install', '--save', '--save-exact'].concat(dependencies);
        } else {
          args = ['install'];
        }
      }
      const child = spawn(
        command,
        args,
        Object.assign({}, { stdio: 'inherit' }, options || {})
      );
      child.on('close', code => {
        if (code !== 0) {
          reject({
            command: `${command} ${args.join(' ')}`,
          });
          return;
        }
        resolve();
      });
    });
  },
  /**
   * 根据包名获取node_modules中包版本
   * @param {string} packageName 依赖包名eg. test@1.2.1
   * @return { string } package name 适配后只给package.json使用的package name，去掉version
   */
  packageNameAdapter(packageName) {
    let packageNameWithoutVerison;
    const splitPackageName = packageName.split('@');
    if (packageName.indexOf('@') === 0) {
      //如@react-boilerplates/simple@1.1.1
      packageNameWithoutVerison =
        '@' + splitPackageName[0] + splitPackageName[1];
    } else {
      packageNameWithoutVerison = splitPackageName[0];
    }
    return packageNameWithoutVerison;
  },
  /**
   * 根据包名获取node_modules中包版本
   * @param {string} packageName 依赖包名
   * @return { string } version
   */
  getVersionOfPackage(packageName) {
    const packageJsonPath = this.getPackageJsonPathOfNodeModules(packageName);
    if (!fs.existsSync(packageJsonPath)) {
      console.error(
        chalk.red(
          packageName + ' is not existed in current node_modules folder.'
        )
      );
      console.trace();
      process.exit(1);
    }
    var packageJson = require(packageJsonPath);
    return packageJson.version;
  },
  /**
   * package中rewrite的规则，适配为 historyApiFallback的正确格式
   * 已废弃，mock有新的实现方式。
   */
  historyApiFallbackRewiriteAdapter(rewriteConfig) {
    var rules = [];
    rewriteConfig.forEach(v => {
      rules.push({
        from: new RegExp(v.from),
        to: function(context) {
          var re = v.to;
          context.match.forEach((v2, k2) => {
            re = re.replace(`$${k2}`, v2);
          });
          return re;
        },
      });
    });
    return rules;
  },
  /**
   * 获取zH_CN字符
   * @return { string || undefined } 返回zh_CN 或者 undefined
   */
  getZHCN() {
    if (process.env.LANG && process.env.LANG.indexOf('zh_CN') !== -1) {
      return process.env.LANG.split('.')[0];
    }
  },
  /**
   * 根据位置，小写转大写，默认转换第一个字母
   * @param  {string} string 传进来的字符串
   * @param  {number}  start  开始位置，默认0
   * @param  {number}  end  介绍位置，默认1
   * @return {string}
   */
  toUpperCaseByPosition(string, start = 0, end = 1) {
    var str1 = string.substr(start, end).toUpperCase();
    var str2 = string.substr(end);
    return str1 + str2;
  },
  /**
   * 读取文件夹文件列表，过滤掉mac上一些隐藏文件
   * @param  {string} dirPath 文件件路径
   * @return {array}  文件列表
   */
  readdirSync(dirPath) {
    var files = fs.readdirSync(dirPath);
    //过滤苹果系统无用的文件
    files = files.filter(v => {
      if (v === '.DS_Store') {
        return;
      }
      if (v.indexOf('.swp') !== -1) {
        return;
      }
      if (v.indexOf('.swo') !== -1) {
        return;
      }
      return true;
    });
    return files;
  },
  /**
   *  单位转换
   *@param {number} value 转换值
   *@param {array} unitArray 单位数组，用来决定的顺序
   *@param {object} options 配置选项，默认值如下
   * {
   *    scale: 1, //转换进制
   *    decimals: false,//是否展示小数
   *    showUnit: true,//是否展示单位
   * }
   */
  unitTransform(value, unitArray = [], options) {
    if (isNaN(value)) {
      console.warn('value参数不是数字类型');
      return value;
    }
    if (value === undefined || value === null) {
      console.warn('value参数没定义或者为null');
      return value;
    }
    if (Object.prototype.toString.apply(unitArray) !== '[object Array]') {
      console.warn("unitArray参数必须是数组，如['bps','Kbps']");
      return value;
    }
    if (value === 0) {
      return value;
    }
    //负数处理，上面已经处理是否位数字了
    var negative = false;
    if (value < 0) {
      negative = true;
      value = -value;
    }
    var opt = {
      scale: 1,
      decimals: false,
      showUnit: true,
    };
    options = Object.assign(opt, options);
    var re = value;
    unitArray.forEach((v, k) => {
      var current_scale = options.scale;
      if (k === 0) {
        current_scale = 0;
      }
      if (k > 1) {
        for (var i = 0; i < k - 1; i++) {
          current_scale = current_scale * options.scale;
        }
      }
      if (value >= current_scale) {
        if (k !== 0) {
          if (!options.decimals) {
            re = (value / current_scale).toFixed(0);
          } else {
            if (
              Object.prototype.toString.apply(options.decimals) ===
              '[object Boolean]'
            ) {
              //默认两位数
              options.decimals = 2;
            }
            re = (value / current_scale).toFixed(options.decimals);
          }
        }
        if (options.showUnit) {
          re = re + v;
        }
      }
    });
    if (negative) {
      re = '-' + re;
    }
    return re;
  },
  /**
   * 流量或存储 字节单位转换为KB,MB,GB单位
   * @param {int} value 转换值
   * @param {object} options 配置选项，默认值如下
   * {
   *    scale: 1, //转换进制
   *    decimals: false,//是否展示小数
   *    showUnit: true,//是否展示单位
   * }
   */
  transformToKBMBGB(value, options = { decimals: false }) {
    var opt = {
      scale: 1024,
    };
    Object.assign(options, opt);
    return this.unitTransform(
      value,
      ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
      options
    );
  },
  /**
   * 获取最上层的build文件夹路径（除掉baseename后的）
   * @param { stirng } originBuildPath 原来的build路径，包括basename的。
   * @param { stirng } basename 设置的basename
   * @return { stirng } 处理后的build路径
   */
  getTopBuildFolderPath(originBuildPath, basename) {
    if (!basename) {
      return originBuildPath;
    }
    //兼容windows平台路径
    originBuildPath = originBuildPath.replace(/\\/g, '/');
    var splitPathArray = originBuildPath.split(basename);
    splitPathArray.pop();
    var topBuidlDir = splitPathArray.join(basename);
    return topBuidlDir;
  },
  /**
   * express 正则匹配mock
   * @param { object } app express app
   * @param { string } mockContainerPath mock文件夹容器
   * @param { string } mockRule mock规则，可以使正则表达式
   * eg. '/common-api/(.*)'
   * @param { string } moackTarget mock目标路径，相对于`path.publicPath`。
   * eg. '/mock/$1.json|400'
   */
  mock(app, mockContainerPath, mockRule, mockTarget) {
    let mock = new RegExp(mockRule);
    let matchStatusReg = /\|(.*)$/;
    let target = mockTarget;
    target = target.replace(matchStatusReg, '');
    app.all(mock, function(req, res) {
      try {
        let status = 200;
        if (req.query.__status__) {
          status = req.query.__status__;
        }
        let targetPath = target;
        let match = req.url.match(mock);
        match.forEach((v, k) => {
          targetPath = targetPath.replace(`$${k}`, v);
        });
        //mock文件路径
        let mockFilePath = path.join(mockContainerPath, targetPath);
        let mockJsFilePath = mockFilePath.replace('.json', '.js');
        if (fs.existsSync(mockFilePath)) {
          let mockContents;
          if (/\.js$/.test(mockFilePath)) {
            delete require.cache[mockFilePath];
            mockContents = require(mockFilePath);
          } else {
            mockContents = fs.readFileSync(mockFilePath, {
              encoding: 'utf-8',
            });
          }
          if (_.isFunction(mockContents)) {
            mockContents = mockContents(req, res);
          }
          if (_.isString(mockContents) && mockContents !== '') {
            try {
              mockContents = JSON.parse(mockContents);
            } catch (e) {
              /**noop**/
            }
          }
          if (!mockContents || mockContents === '') {
            mockContents = {};
          }
          if (_.isPlainObject(mockContents)) {
            mockContents = mockjs.mock(mockContents);
          }
          res.status(status).send(mockContents);
        } else if (fs.existsSync(mockJsFilePath)) {
          //如果找不到.json的文件（规则中配置了.json），读取.js文件
          delete require.cache[mockJsFilePath];
          let mockContents = require(mockJsFilePath);
          if (_.isFunction(mockContents)) {
            mockContents = mockContents(req, res);
            if (_.isPlainObject(mockContents)) {
              mockContents = mockjs.mock(mockContents);
            }
            res.status(status).send(mockContents);
          } else {
            console.log(new Error('mock js文件的需要exports函数！'));
          }
        } else {
          res.status(404).send(req.url + ' not found.');
        }
      } catch (e) {
        res.status(500).send(e.toString());
      }
    });
  },
};
