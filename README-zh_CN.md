# Create React Boilerplate App 

使用redux和反应路由器样板创建React应用程序（没有配置或更少的配置）。

创建React应用程序适用于MacOS，Windows和Linux。

React样板基于 [React@15.5.4](https://facebook.github.io/react/)，[Redux@3.5.2](https://github.com/reactjs/redux)， [React Router@3.0.0](https://github.com/reactjs/react-router) ，用于快速应用开发。

如果有什么问题，请[提交个issue](https://github.com/dog-days/create-react-boilerplate-app/issues/new)。

## 为什么使用这个

- 没有webpack配置。
- 没有路由配置，路由自动生成命令。
- 可选的redux或mobx配置。
- 页面简单模块生成。
- 可选的less-loader。
- 可选的sass-loader。
- 可选的Immutable.js。
- 可选的package.json配置，如代理和proxy和historyApiFallback（用于mock服务）。
- 配置可覆盖功能。
- React，Redux，React-Router，JSX，ES6和ES7装饰器语法支持。
- 可选面包屑功能。
- 可选i18n功能。
- 开发模拟服务
- 开发代理服务

## 文档

- [中文 README](https://github.com/dog-days/create-react-boilerplate-app/blob/master/README-zh_CN.md)
- [English README](https://github.com/dog-days/create-react-boilerplate-app/blob/master/README.md)
- [react-redux-pieplate-js](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js)

## 简单使用

### 使用npm

```sh
npm install -g create-react-boilerplate-app
create-react-boilerplate-app my-app
cd my-app/
npm start
```

npm可能很慢，镜像链接解决问题。推荐使用[**nrm**](https://github.com/Pana/nrm) 。

nrm可以帮助您轻松快速地切换不同的npm镜像链接，现在包括：npm，cnpm，taobao，nj（nodejitsu），rednpm。

```sh
npm install -g nrm
nrm use taobao ## switch to https://registry.npm.taobao.org/
```

### 使用yarn

```sh
yarn global add create-react-boilerplate-app
create-react-boilerplate-app my-app
cd my-app/
yarn start
```

切换yarn镜像链接。

```sh
yarn config set registry https://registry.npm.taobao.org
```

## 入门

### 安装

```sh
npm install -g create-react-boilerplate-app
# or 
# yarn global add create-react-boilerplate-app
```

**您的机器上需要Node> = 6**。 您可以使用[nvm](https://github.com/creationix/nvm#usage) 轻松地切换不同项目之间的Node版本。

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# install latest node,and node can be used immediately without restarting the terminal.
nvm install node && nvm alias default node
#install node v6.0.0
nvm isntall 6.0.0
#switch node to v6.0.0
nvm use 6.0.0
```

Windows平台使用者，请从 [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)下载 [nvm-setup.zip](https://github.com/coreybutler/nvm-windows/releases/download/1.1.4/nvm-setup.zip)。

### 创建React App

```sh
create-react-boilerplate-app my-app
cd my-app
```

`create-react-boilerplate-app xxx [options]`

| 简写   | 选项           | 说明                    |
| ---- | ------------ | --------------------- |
| -h   | --help       | 输出帮助消息信息              |
| -D   | --data-flow  | 使用数据流管理类库（redux或mobx） |
| -a   | --all        | 创建具有所有功能的视图           |
| -i   | --i18n       | 创建具有多语言的视图（i18n）      |
| -b   | --breadcrumb | 创建具有面包屑功能的视图          |

它将在当前文件夹中创建一个名为my-app的目录。

在该目录中，它将生成初始项目结构，并根据需要安装依赖关系：

```sh
my-app/
  .gitignore
  node_modules/
  package.json
  public/
    favicon.ico
    index.html
  src/
    #自动创建
    .redcers.js
    #自动创建
    .routes.js
    #应用入口js文件
    index.jsx 
    #根据选项创建。
    #i18n文件夹
    locale/
    #css and image
    style/ 
    #layout和页面视图，您的主要编码位置。
    view/
      layout/
        main/
          index.jsx
          _route.js
          #自动生成
          .child_routes.js
      #for example
      about/
        index.jsx
        _route.js
        #redux reducer编码区
        #通过npm run ac，reducer函数会被读取到src/.reducers.js。
        reducer.js
```

没有配置或复杂的文件夹结构。

您需要参考[react-redux-pieplate-js](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js)来了解如何调整view文件夹中的代码，view文件夹是您以后的主要编码区。

### View使用

#### Layout模式

layout是特殊的一种view，在这里是react-router中的第一层组件，view是其子组件。以一种layout文件夹为例：

layout包括以下必要文件

- `_route.js`，用作单个路由配置，可自行修改，但务必按照以下格式。

```jsx
export default {
  path: '/',
  //layout组件
  component: require('./index').default,
  //默认主页设置
  indexRoute: require('src/view/index/_route.js').default,
  //子路由组件，即view组件
  childRoutes: require('./.child_routes.js').default,
}
```

- `src/view/index.jsx`，在上面的_route.js使用。

```jsx
import React from 'react'

class LayoutView extends React.Component {
  render(){
  }
}
export default LayoutView; 
```

- .child_routes.js

  `.child_routes.js`是个隐藏文件，自动生成。

#### Page View模式

view是我们代码开发主要地方，以下是必要文件，`action.js`和`reducer.js`看需要。

- `_route.js`，二级路由（如果没有layout就是一级路由），可自行修改，但务必按照以下格式。

```jsx
export default {
  // 它是react-router的业务，请参考react-router@3.x.x
  //它只是为了绑定layout，当使用`npm run ac'时，会读取该值。
  //这是唯一跟react-router不同的地方，是我们自定义的。
  layout: 'main',
  path: 'about',
  component: require('src/view/about/index.jsx').default,
}
```

- `src/view/about/index.jsx`

```jsx
import React from 'react'

class View extends React.Component {
  render(){
  }
}
export default View; 
```

### Redux Reducer

reducer写法跟Redux的一致，但是因为项目需要使用到`npm run ac`提取并保存reducer方法。所以定义了以下规则：

reducer.js格式如下（export格式）:

```jsx
export function origin(state = {}, action) {
  switch (action.type) {
    case RECIEVEORIGIN:     
    default:
      return state;
  }
}
```

不要使用下面这样的格式,虽然是没错，但目前还不支持智能识别这种格式。

```jsx
module.exports = {
  origin(state,action){}
}
```

这种也不行，请确保`export`跟`function`关键字在一行。

```js
function origin(state = {}, action) {
  switch (action.type) {
    case RECIEVEORIGIN:     
    default:
      return state;
  }
}
export {
  origin
}
```

### 命令使用

安装完成后，可以在项目当前文件夹中运行一些命令。

yarn 命令可以省略`run`关键字。

`npm run build` can be `yarn build`.

#### npm || yarn start

在开发模式下运行应用程序。

在浏览器中打开http:// localhost:8888查看。

如果您进行编辑，页面将被重新加载（热替换，无需刷新页面）。

您将在终端和浏览器控制台中看到构建成功或错误信息和lint警告信息。

#### npm || yarn run create-view(cv for short) 

在view文件夹中生成一个新的页面视图模板。

options is same as `create-react-boilerplate-app xxxx [options]`.

| short | option       | explain          |
| ----- | ------------ | ---------------- |
| -h    | --help       | 输出帮助消息信息         |
| -a    | --all        | 创建具有所有功能的视图      |
| -i    | --i18n       | 创建具有多语言的视图（i18n） |
| -b    | --breadcrumb | 创建具有面包屑功能的视图     |

#### npm || yarn run route

基于_route.js文件创建路由。

`npm run route -- -w` 是监控生成模式.

#### npm || reducer

基于reducer.js文件创建redux reducers（绑定reducer）。

`npm run reducer -- -w` 是监控生成模式.

#### npm || yarn run view-locale-to-excel(vlte for short)

通过读取src文件夹中的文件来创建i18n excel（通过this.t（“xx”）匹配出xx字符传）。

#### npm || yarn run excel-to-locale-config(etlc for short)

该命令基于 `npm run view-to-locale-excel` 运行后生成的excel文件。

生成xx.js（如en_US.js）通过读取翻译后的excel.

#### npm || yarn run use `<feature-name`>

使用less，sass和immutable.js等功能。

运行`npm run use -- -l`来查看可用的功能列表。

#### npm || yarn run cover `<file-name`>

覆盖配置文件，如webpack.config.dev.js。

运行 `npm run cover -- -l` 来查看可以覆盖的文件列表。

#### npm || yarn run build

构建生产应用程序到`build`文件夹。

它在生产模式下正确地捆绑了React，并优化了构建以获得最佳性能。

构建已经压缩，文件名包括hash值（防止每次发版旧版本缓存问题）。

### 使用可选功能

#### 使用Less

```sh
npm run use less
#or
#yarn use less
```

上面的命令将安装`less` and `less-loader`。

安装后，运行`npm start` ，就会生效了。

#### 使用Sass

```sh
npm run use sass
#or
#yarn use sass
```

上面的命令将安装`node-sass` and `sass-loader`。

安装后，运行`npm start` ，就会生效了。

#### 使用Immutable.js

```sh
npm run use immutable
#or
#yarn use immutable
```

上面的命令将安装`immutable@3.8.1` and `redux-immutable@3.0.6`。

安装后，运行`npm start` ，就会生效了（查看redux-logger在浏览器console的输出信息）。

### package.json之react-boilerplate-app-scripts配置

在创建新的app项目中，package.json会有`react-boilerplate-app-scripts`默认配置。

```json
...
"react-boilerplate-app-scripts": {
  "language": "zh_CN"
},
...
```

`react-boilerplate-app-scripts`有如下配置选项：

- appSrcPath

  app程序目录（相对于根目录），默认值为`src`。如果没必要，建议不要改动，可以忽略。

- language

  会在`npm run view-to-locale-excel`中被使用，生成excel第一行表头的字符。

  如果我们默认语言使用的是英文，那`language`应该为`en_xx`（如en_US）。

  `language`会根据终端使用的语言包默认生成（windows都是默认en_US，目前不兼容）。

- host

  开发服务host，默认值localhost。如果没必要，建议不要改动，可以忽略。

- port

  开发服务监听端口，默认值8888。如果没必要，建议不要改动，可以忽略。

  如果端口冲突，程序会自动修改成其他的端口。

- routesPath

  route配置文件路径，`npm run ac`命令会读取。默认值是`${src}/.routes.js`，其中`${src}`会替换为上面的`appSrcPath`值。如果没必要，建议不要改动，可以忽略。

- reducersPath

  reducers（传递到redux store）配置文件路径，`npm run ac`命令会读取。默认值是`${src}/.reducers.js`，其中`${src}`会替换为上面的`appSrcPath`值。如果没必要，建议不要改动，可以忽略。

- appEntryPath

  app程序js入口文件路径，默认值为`${src}/index.jsx`。如果没必要，建议不要改动，可以忽略。

- appPublicPath

  webpack-dev-server静态资源访问目录（相对于根目录），默认值为`public`。如果没必要，建议不要改动，可以忽略。

- appLocalePath

  多语言文件夹路径，`npm run view-to-locale-excel`会读取使用。如果没必要，建议不要改动，可以忽略。

- index

  app入口html文件，在上面`appPublicPath`的文件夹下。

- proxy

  请参考后续的**Proxy**，默认值为undefined，这个功能或许比较常用。

- historyApiFallback

  请参考后续的**Mock**，默认值为undefined，这个功能或许比较常用。

- prefixURL

  因为有些网站访问web app不是在根目录，可能是根目录中的的文件夹，`prefixURL`是用来设置这种情况的。
  例如`/demo`，访问网站根目录demo文件中的web app。

### 配置覆盖

在当前的创建的app中，我们也可以对配置进行覆盖，有以下配置文件可以覆盖：

- webpack.config.dev.js

  开发环境webpack配置文件。

- webpack.config.prod.js

  生产环境webpack配置文件。

- paths.js

  路径配置文件，大致如下

  ```js
  const path = require('path');
  const util = require('react-boilerplate-app-utils');
  const scriptsPackagename = 'react-boilerplate-app-scripts';
  const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(scriptsPackagename);
  function pathResolve(relativePath){
    return util.pathResolve(relativePath,scriptsPackagename);
  }
  //pathResolve使用相对路径，不要使用绝对路径
  var paths = {
    webpackDevConfig: pathResolve("config/webpack.config.dev.js"),
    webpackProdConfig: pathResolve("config/webpack.config.prod.js"),
    //app 程序入口js文件
    appEntry: pathResolve(cwdPackageJsonConfig.appEntryPath),
    //dev server静态资源访问目录
    appPublic: pathResolve(cwdPackageJsonConfig.appPublicPath),
    //app 入口html文件
    appHtml: path.resolve(process.cwd(),cwdPackageJsonConfig.appPublicPath,cwdPackageJsonConfig.index),
    //程序打包目录，根据prefixURL变化
    appBuild: path.resolve(process.cwd(),'build',cwdPackageJsonConfig.prefixURL),
    //app 程序目录
    src: path.resolve(cwdPackageJsonConfig.appSrcPath),
  }
  module.exports = paths;
  ```

- proxy.js

  请参考后面的`Proxy`功能。

- historyApiFallback.js

  请参考后面的`Mock`功能。

我们可以运行 `npm run cover -- -l` 来查看可以覆盖的文件列表。

我们可以运行下面命令创建：

````sh
npm run cover <file-name>
#yarn cover <file-name>
````

### Mock（模拟）

Mock是基于webpack-dev-server historyApiFallback的。例如，有一个api链接http://www.github.com/api/test。但是在一开始，链接是无效的。我们希望它被模拟在`./public/mock`文件夹中。我们可以使用下面的package.json中的配置。

`public`文件夹是默认设置的webpack-dev-server静态资源访问目录。

```json
{
  "name": "app",
  "version": "0.0.1",
  "react-boilerplate-app-scripts": {
    "historyApiFallback": {
      "rewrites": [
        {
          "from": "/api/(.*)",
          "to": "/mock/$1.json"
        }
      ]
    }
  }
}
```

在`./public/mock`文件夹中创建一个test.json文件。

开发环境启动后，您可以访问`http:// localhost:8888/api/test.js`来获取api json内容。

`rewrites`与webpack-dev-server的有点不同（package.json只能用字符串），它将被转换成下面的代码。

```js
rewrites: [
  {
    from: new RegExp("/api/(.*)"),
    to: function(context) {
      return '/mock/' + context.match[1] + '.json';
    }
  }
]
```

想要更多的配置，我们可以通过运行 `yarn || npm run cover historyApiFallback.js`来创建`config/historyApiFallback.js`或手动创建文件。

格式与webpack-dev-server [historyApiFallback](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)相同。

请参考 [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback#rewrites).

### Proxy（代理）

在开发模式下，api链接由后端提供，会遇到跨域问题.Proxy可以解决问题。

代理是基于webpack-dev-server proxy。例如，有一个有效api链接http://www.github.com/api/test 。我们的代理www.github.com。我们可以使用下面的package.json配置。由于是package.json，我们只能使用字符串配置代理。

`public`文件夹是默认设置的webpack-dev-server静态资源访问目录。

```json
{
  "name": "app",
  "version": "0.0.1",
  "react-boilerplate-app-scripts": {
   	"proxy": {
      "/api": "http://www.githumb.com"
   	}
  }
}
```

开发环境启动之后，您可以访问`http://localhost:8888/api/test.js`来获取api json内容。

想要更多的配置，我们可以通过运行 `yarn || npm run cover proxy.js`来创建`config/proxy.js`或手动创建文件。

格式与webpack-dev-server  [proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)相同。

## 概念

- **无需配置**

  React Boilerplate应用程序可以无需配置。 开发和生产构建的合理配置已为您处理，所以您可以专注于编写代码。

- **Package.json 配置**

  package.json配置是可选的，但是是方便的。

- **配置覆盖**

  我们可以自定义所有的配置文件。例如，您可以只覆盖webpack.config.dev.js。







