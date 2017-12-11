'use strict';

//用来打包dll文件，专门提取node_modules中的packages，自己类包在此不做处理。
//所有不会有babel等解析。
const util = require('react-boilerplate-app-utils');
const path = require('path');
const webpack = require('webpack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const chalk = require('chalk');
const scriptsPackagename = util.scriptsPackagename;
const paths = require(util.pathResolve('config/paths.js', scriptsPackagename));

const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
  scriptsPackagename
);
if (!cwdPackageJsonConfig.dll || !cwdPackageJsonConfig.dll[0]) {
  return;
}

//添加polyfills入口文件
cwdPackageJsonConfig.dll.unshift(
  require.resolve(util.pathResolve('config/polyfills.js', scriptsPackagename))
);
//webpack配置项
var config = {
  //任何错误立即终止
  bail: true,
  devtool: 'source-map',
  //隐藏终端的warning信息
  performance: {
    hints: false,
  },
  entry: {
    app: cwdPackageJsonConfig.dll || [],
  },
  output: {
    filename: 'dll.[name].js',
    library: '[name]_[hash]',
    //js打包输出目录
    //这里设置为public文件夹，这样开发环境下，浏览器才可以访问到dll静态文件
    path: paths.appPublic,
    //内存和打包静态文件访问目录，以index.html为准,最好以斜杠/结尾，要不有意想不到的bug
    //因为有些网站访问web app不是在根目录，可能是根目录中的的文件夹，prefixURL是用来设置这种情况的
    //例如`/demo`，访问网站根目录demo文件中的web app
    publicPath: `${cwdPackageJsonConfig.basename}/` || '/',
    sourceMapFilename: '[file].map',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      // optionally pass test, include and exclude, default affects all loaders
      test: /\.css|.js|.jsx|.scss$/,
      minimize: true,
      debug: false,
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      sourceMap: true,
      uglifyJS: {
        output: {
          comments: false,
        },
        compress: {
          warnings: false,
        },
      },
    }),
    new SimpleProgressPlugin({
      progressOptions: {
        complete: chalk.bgGreen(' '),
        incomplete: chalk.bgWhite(' '),
        width: 20,
        total: 100,
        clear: true,
      },
    }),
    new webpack.DllPlugin({
      path: path.resolve(paths.appPublic, '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
};

module.exports = config;
