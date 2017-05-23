const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const semver = require('semver');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');

//node 版本v5.0.0以上，util不要使用class等新语法
module.exports = {
  resolveCwd(relativePath){
    return path.resolve(process.cwd(),relativePath);
  },
  /**
   * 会根据当前项目，或者当前项目指定的node_modules中的packageName路径
   * 依次查找文件
   * @param { string } relativePath 相对路径，跟path.resolve的参数一致，如果使用绝对路径，直接返回绝对路径
   * @param { string } packageName node_modules中的packageName文件夹名
   * @return { string || undefined } 返回优先匹配的路径
   */
  pathResolve(relativePath,packageName){
    if(!packageName){
      packageName="react-boilerplate-app-scripts"
    }
    if(!relativePath){
      return;
    }
    if(!fs.existsSync(this.resolveCwd("node_modules"))){
      console.error(chalk.red("This project must have node_modules folder! "));
      console.log();
      console.error(chalk.red("Please do not change the node_modules folder name!"));
      return;
    }
    var entryOfCwdPath = this.resolveCwd(relativePath);
    var entryOfPackagePath = this.resolveCwd(`node_modules/${ packageName }/${ relativePath }`);
    if(fs.existsSync(entryOfCwdPath)){
      return entryOfCwdPath;
    }else if(fs.existsSync(entryOfPackagePath)){
      return entryOfPackagePath;
    }
  },
  /**
   * 打印数组类型
   * @param { array } results 结果数组
   * @param { string } type 信息类型success、waring、error
   */
  printValidationResults(results,type){
    if(!type){
      type = "success";
    }
    var colors;
    switch(type){
      case "success":
        colors = chalk.green;
      break;
      case "warning":
        colors = chalk.yellow;
      break;
      case "error":
        colors = chalk.red;
      break;
    }
    results && results.forEach(error => {
      console.error(colors(error));
    });
  },
  /**
   * 是否应该使用yarn
   * @return { boolean } true or false
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
  getPackageJsonPathOfNodeModules(packageName){
    return path.resolve(
      process.cwd(),
      'node_modules',
      packageName,
      'package.json'
    );
  },
  /**
   * 获取当前输入目前package.json对象
   */
  getCwdPackageJson(){
    //防止重复读取
    if(!this.cwdPackageJson){
      this.cwdPackageJson = fs.readJsonSync(path.resolve(process.cwd(),'package.json'));
    }
    return this.cwdPackageJson;
  },
  /**
   * 获取当前输入目前package.json对象指定的package config
   */
  getDefaultCwdPackageJsonConfig(packageName){
    if(!packageName){
      packageName = 'react-boilerplate-app-scripts';
    }
    var config = this.getCwdPackageJson()[packageName];
    //默认值，路径都是相对npm项目根目录
    config =  Object.assign({},{
      //app 程序目录
      appSrcPath: "src",
      host: 'localhost',
      port: 8888,
      routesPath: "${src}/.routes.js",
      reducersPath: "${src}/.reducers.js",
      //app 程序入口js文件
      appEntryPath: "${src}/index.jsx",
      //dev server静态资源访问目录
      appPublicPath: "public",
      //多语言文件夹
      appLocalePath: "${src}/locale",
      //app 入口html文件名，在上面appPublicPath的文件夹下。
      index: "index.html",
    },config)
    if(config.host === 'localhost'){
      config.ip = '127.0.0.1';
    }
    config.prot = parseInt(config.port,10);
    //替换${src}为config.appSrcPath的值
    for(var k in config) {
      if(Object.prototype.toString.apply(config[k]) === '[object String]'){
        config[k] = config[k].replace(/\${.*src.*}/,config.appSrcPath);
      }
    }
    //prefix url 兼容适配处理
    if(config.prefixURL){
      var prefixUrl = config.prefixURL;
      var prefixUrlLength = prefixUrl.length;
      if(prefixUrl[prefixUrlLength - 1] !== '/'){
        prefixUrl = prefixUrl + "/";
      }else if(prefixUrl === '/'){
        prefixUrl = '';
      }else if(prefixUrl && prefixUrl[0] === '/' && prefixUrl !== '/'){
        prefixUrl = prefixUrl.slice(1,prefixUrlLength);
      }
      config.prefixURL = prefixUrl;
    }else {
      config.prefixURL = '';
    }
    return config;
  },
  /**
   * 检测输入node版本是否大于等于跟当前运行的版本
   * 如果不是将提示并退出程序
   * @param { string } version eg. v6.0.0
   */
  checkNodeVersion(version) {
    if (!semver.satisfies(process.version,">=" + version)) {
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
    }
  },
  /**
   * 检测npm版本是否大于等于3.0.0
   * @return { boolean } true or false
   */
  checkNpmVersion() {
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
   * @param { array } dependencies 依赖包
   * @return { boolean } true or false
   */
  installPackages(dependencies){
    console.log('Installing packages. This might take a couple minutes.');
    var useYarn = this.shouldUseYarn();
    return new Promise((resolve, reject) => {
      var command;
      var args;
      if (useYarn) {
        command = 'yarnpkg';
        if(dependencies){
          args = ['add', '--exact'];
          [].push.apply(args, dependencies);
        }
      } else {
        this.checkNpmVersion();
        command = 'npm';
        if(dependencies){
          args = ['install', '--save', '--save-exact'].concat(dependencies);
        }else {
          args = ['install'];
        }
      }
      const child = spawn(command, args, { stdio: 'inherit' });
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
   * @return { string } version
   */
  getVersionOfPackage(packageName){
    const packageJsonPath = this.getPackageJsonPathOfNodeModules(packageName);
    if(!fs.existsSync(packageJsonPath)){
      console.error(chalk.red(packageName + ' is not existed in current node_modules folder.'));
      process.exit(1);
    }
    var packageJson = fs.readJsonSync(packageJsonPath);
    return packageJson.version;
  },
  /**
   * package中rewrite的规则，适配为 historyApiFallback的正确格式
   */
  historyApiFallbackRewiriteAdapter(rewriteConfig){
    var rules = [];
    rewriteConfig.forEach((v,k)=>{
      rules.push({
        from: new RegExp(v.from),
        to: function(context){
          var re = v.to;
          context.match.forEach((v2,k2)=>{
            re = re.replace(`$${k2}`,v2);
          })
          return re;
        },
      })
    })
    return rules;
  },
  /**
   * 获取zH_CN字符
   * @return { string || undefined } 返回zh_CN 或者 undefined
   */
  getZHCN(){
    if(process.env.LANG && process.env.LANG.indexOf('zh_CN') !== -1){
      return process.env.LANG.split('.')[0];
    }
  },
  /**
   * 根据位置，小写转大写
   * @param  {String} string 传进来的字符串
   * @param  {Int}  start  开始位置，默认0
   * @param  {Int}  end  介绍位置，默认1
   * @return {string}
   */
  toUpperCaseByPosition(string,start=0,end=1){
    var str1 = string.substr(start,end).toUpperCase();
    var str2 = string.substr(end);
    return str1 + str2;
  },
  readdirSync(dirPath){
    var files = fs.readdirSync(dirPath);
    //过滤苹果系统无用的文件
    files = files.filter((v,k)=>{
      if(v === '.DS_Store'){
        return;
      }
      if(v.indexOf('.swp') !== -1){
        return;
      }
      if(v.indexOf('.swo') !== -1){
        return;
      }
      return true;
    })
    return files;
  },
}
