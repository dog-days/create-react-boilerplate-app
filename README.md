# Create React Boilerplate App 

使用样板创建React应用程序，这里会逐渐提供各种各样的样板。

创建React样板应用程序适用于MacOS，Windows和Linux。

如果有什么问题，请[提交个issue](https://github.com/dog-days/create-react-boilerplate-app/issues/new)。

## 为什么使用这个

- 没有webpack配置（当然也可以有）。
- 配置可覆盖功能，webpack配置，server启动服务配置等。
- JSX，ES6和ES7装饰器等语法支持。
- 可选的react样板app，想用哪个就哪个。
- 可选的less-loader。 
- 可选的sass-loader。
- 可选的package.json配置，如代理和proxp、http mock服务和websocket mock服务。
- 开发模拟服务。
- 开发代理服务。

## 概念

- **无需配置**

  React Boilerplate应用程序可以无需配置。 开发和生产构建的合理配置已为您处理，所以您可以专注于编写代码。当然也可以自定义配置（覆盖配置）。

- **package.json 配置**

  package.json配置是可选的，但是是方便的。

- **配置覆盖**

  我们可以自定义所有的配置文件。例如，您可以只覆盖webpack.config.dev.js。

## 可用样板

- simple

  最简单样板app，只有react，这个跟create-react-app差不多。

- mvc-react

  mvc模式的样板，这个样板app是基于[mvc-react](https://github.com/dog-days/mvc-react)。`mvc-react`是基于[react-router-controller](https://github.com/dog-days/react-router-controller)和[redux-saga-model](https://github.com/tomsonTang/redux-saga-model)

  。详细用法请参考`mvc-react`用法。

更多的样板会逐渐添加。

## 简单使用

### 使用npm

npm强烈建议使用v5.0.0以上，可以安装最新node版本。

```sh
#create-react-boilerplate-app xxx(自定义项目名称) -b xxx(样板名称)
npm install -g create-react-boilerplate-app
create-react-boilerplate-app my-app -b mvc-react
cd my-app/
npm start
```

npm可能很慢，镜像链接解决问题。推荐使用[**nrm**](https://github.com/Pana/nrm) 。

nrm可以帮助您轻松快速地切换不同的npm镜像链接，现在包括：npm，cnpm，taobao，nj（nodejitsu），rednpm。

```sh
npm install -g nrm
nrm use taobao ## switch to https://registry.npm.taobao.org/
```

但是有些镜像还是要特殊处理，在.npmrc文件夹中添加一些特别的镜像：

```sh
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
electron_mirror=https://npm.taobao.org/mirrors/electron/
```

node-sass不添加镜像，下载特别慢。

### 使用yarn

```sh
yarn global add create-react-boilerplate-app
create-react-boilerplate-app my-app -b mvc-react
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

### 创建React Boilerplate App

```sh
create-react-boilerplate-app my-app -b mvc-react
cd my-app
```

`create-react-boilerplate-app xxx(自定义项目名称) [options]`

options

| 简写   | 选项            | 说明                        |
| ---- | ------------- | ------------------------- |
| -b   | --boilerplate | 样板名称，请参考上面的，[可用样板](#可用样板) |

## 进阶

### 命令使用

安装完成后，可以在项目当前文件夹中运行一些命令。

yarn 命令可以省略`run`关键字。

`npm run build` can be `yarn build`.

#### npm start

在开发模式下运行应用程序。

在浏览器中打开http:// localhost:8888查看。

如果您进行编辑，页面将被重新加载（热替换，无需刷新页面）。

您将在终端和浏览器控制台中看到构建成功或错误信息和lint警告信息。

#### npm run excel-to-locale-config（简写etlc）

该命令基于 `npm run view-to-locale-excel` 运行后生成的excel文件。该命令通过读取翻译后的excel，生成xx.js（如en_US.js）。

如果不使用国际化功能，这个命令就没有意义了。

#### npm run use `<feature-name`>

使用less，sass等功能。

运行`npm run use -- -l`来查看可用的功能列表。

#### npm run cover `<file-name`>

覆盖配置文件，如webpack.config.dev.js。

运行 `npm run cover -- -l` 来查看可以覆盖的文件列表。

#### npm run build

构建生产应用程序到`build`文件夹。

它在生产模式下正确地捆绑了React，并优化了构建以获得最佳性能。

构建后的文件已经压缩，文件名包括hash值（防止每次发版旧版本缓存问题）。

#### npm run build-dll

构建生产dll文件到`public`文件夹，这里使用了[DllPlugin](https://webpack.js.org/plugins/dll-plugin)，在这里您只需配置package.json中`react-boilerplate-app-scripts`的dll字段即可。详细请看[package.json之react-boilerplate-app-scripts配置](#package.json之react-boilerplate-app-scripts配置)

#### npm run serve-build

在build文件夹中，启动静态文件web服务。

### 使用可选功能

#### 使用Less

```sh
npm run use less
#or
#yarn use less
```

上面的命令将安装`less` and `less-loader`。安装后，运行`npm start` ，就会生效了。要注意的是，**less文件需要带`.less`后缀名**。

#### 使用Sass

```sh
npm run use sass
#or
#yarn use sass
```

上面的命令将安装`node-sass` and `sass-loader`。安装后，运行`npm start` ，就会生效了。要注意的是，**sass文件需要带`.scss`后缀名**。

### Webpack Alias

目前默认的alias只有一个就是src目录，src目录的alias的名称`src`。alias用法请参考[webpack alias](https://webpack.js.org/configuration/resolve/#resolve-alias)。

### package.json之react-boilerplate-app-scripts配置

在创建新的app项目中，package.json会有`react-boilerplate-app-scripts`默认配置。

**每次修改配置，都需要重启服务，才会生效。**

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

- host

  开发服务host，默认值localhost。如果没必要，建议不要改动，可以忽略。

- port

  开发服务监听端口，默认值8888。如果没必要，建议不要改动，可以忽略。

  如果端口冲突，程序会自动修改成其他的端口。

- appEntryPath

  app程序js入口文件路径，默认值为`${src}/index.jsx`。如果没必要，建议不要改动，可以忽略。

- appPublicPath

  webpack-dev-server静态资源访问目录（相对于根目录），默认值为`public`。如果没必要，建议不要改动，可以忽略。

- index

  app入口html文件，在上面`appPublicPath`的文件夹下。

- proxy

  请参考后续的**Proxy**，默认值为undefined，这个功能或许比较常用。

- historyApiFallback

  想要更多的配置，我们可以通过运行 `yarn || npm run cover historyApiFallback.js`来创建`config/historyApiFallback.js`或手动创建文件。

  其中`rewrites`与webpack-dev-server的有点不同（package.json只能用字符串），它将被转换成下面的代码。

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

  请参考webpack-dev-server中historyApiFallback.js的用法。

- mock

  http mock服务，请参考后面的**Http Mock**说明。

- websocketMock

  websocket mock服务，请参考后面的**wbsocketMock**说明。

- basename

  因为有些网站访问web app不是在根目录，可能是根目录中的的文件夹，`basename`是用来设置这种情况的。
  例如`/demo`，访问网站根目录demo文件中的web app。

- dll

  > The DllPlugin and DllReferencePlugin provide means to split bundles in a way that can drastically improve build time performance.

  DllPlugin和DllReferencePlugin提供了分离的bundles，可以大大提高构建速度。功能跟[CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/)类似，但是这个是提前提取bundles，所以后续的构建速度会大大提高。所以一般提取提取的bundles最好是稳定，基本不会修改的第三方类库，如react、react-dom、props-types等。

  这里实现了[DllPlugin](https://webpack.js.org/plugins/dll-plugin)可选功能，格式如下：

  ```json
  ...
  "react-boilerplate-app-scripts": {
    "dll": ['react','react-dom']
  },
  ...
  ```

  dll目前只支持数组，只实现一个dll。如果不定义dll那就没有dll功能。

  > dll功能在这个工具中，只需修改package.json里面的配置即可，不需要运行其他命令，正常运行其他命令即可。

### 配置覆盖

在当前的创建的app中，我们也可以对配置进行覆盖，有以下配置文件可以覆盖：

- webpack.config.dev.js

  开发环境webpack配置文件。

- webpack.config.prod.js

  生产环境webpack配置文件。

- paths.js

  路径配置文件，大致如下

  ```js
  'use strict';
  const path = require('path');
  const util = require('react-boilerplate-app-utils');
  const scriptsPackagename = 'react-boilerplate-app-scripts';
  const cwdPackageJsonConfig = util.getDefaultCwdPackageJsonConfig(
    scriptsPackagename
  );

  function pathResolve(relativePath) {
    return util.pathResolve(relativePath, scriptsPackagename);
  }
  //pathResolve使用相对路径，不要使用绝对路径
  var paths = {
    webpackDevConfig: pathResolve('config/webpack.config.dev.js'),
    webpackProdConfig: pathResolve('config/webpack.config.prod.js'),
    //app 程序入口js文件
    appEntry: pathResolve(cwdPackageJsonConfig.appEntryPath),
    //dev server静态资源访问目录
    appPublic: pathResolve(cwdPackageJsonConfig.appPublicPath),
    //app 入口html文件
    appHtml: path.resolve(
      process.cwd(),
      cwdPackageJsonConfig.appPublicPath,
      cwdPackageJsonConfig.index
    ),
    //程序打包目录，根据prefixURL变化
    appBuild: path.join(
      process.cwd(),
      'build',
      cwdPackageJsonConfig.prefixURL || cwdPackageJsonConfig.basename
    ),
    //app 程序目录
    src: path.resolve(cwdPackageJsonConfig.appSrcPath),
  };
  module.exports = paths;
  ```

- proxy.js

  请参考后面的`Proxy`功能。

- historyApiFallback.js

  请参考webpack-dev-server中historyApiFallback.js的用法。

我们可以运行 `npm run cover -- -l` 来查看可以覆盖的文件列表。

我们可以运行下面命令创建：

````sh
npm run cover <file-name>
#yarn cover <file-name>
````

### HTTP Mock（模拟）

例如，有一个api链接http://www.github.com/api/test。但是在一开始，链接是无效的。我们希望它被模拟在`./public/mock`文件夹中。我们可以使用下面的package.json中的配置，可以使用正则表达式，正则是使用javascript的match方法来匹配的，可以使用$x，例如$1，来代表匹配后的内容。可以看下下面的例子。

> **`./public`**是默认设定的http mock文件夹，只能在这个文件夹中添加mock文件，才会生效。

```json
{
  "name": "app",
  "version": "0.0.1",
  "mock": {
    "/api/(.*)": "/mock/$1.json"
  },
}
//或者
{
  "name": "app",
  "version": "0.0.1",
  "mock": {
    "/api/(.*)": "/mock/$1.json|200"
  },
}
```

**上面中`.json|200`中的数字是模拟返回码的，默认是200（`.json`，就可以了），如果要模拟其他的返回码，可以这样处理。**每次修改配置，都需要重启服务，才会生效。

`public`文件夹是默认设置的webpack-dev-server静态资源访问目录。

在`./public/mock`文件夹中创建一个test.json文件。

开发环境启动后，您可以访问`http://localhost:8888/api/test.js`来获取api的json内容。

### Websocket Mock 

**`./public`**是默认设定的mock文件夹，只能在这个文件夹中添加mock文件，才会生效。

websocket mock只是简单的模拟服务，不是很方便，目前只想到了这个解决办法。大概配置如下：

```js
"websocketMock": {
  "log": true,
  "emit": {
    "reciveMsg": {
      "type": [
        "device_alert",
        "other"
      ],
      "url": "/websocket/reciveMsg.js"
    }
  },
  "on": {
     "confirmMsg": "/websocket/confirmMsg.js"
  }
}
```

websocketMock：

| 参数   | 说明                                   |
| ---- | ------------------------------------ |
| log  | 是否开启日志功能，终端会输出。                      |
| emit | 跟websocket的命名一致，推送服务端websocket数据。    |
| on   | 跟websocket的命名一致，监控接收客户端的websocket请求。 |

#### emit

| 参数        | 说明                             |
| --------- | ------------------------------ |
| reciveMsg | 这个是自定义名字，需要跟开发定好的websocket协议一致 |

reciveMsg：

| 参数   | 说明                                       |
| ---- | ---------------------------------------- |
| type | 这里只是为了模拟同一个emit返回的不同类型的数据，跟实际的websocket没关系。 |
| url  | 项目的public文件夹下的相对路径，这个文件会被运行，返回对应的值，就是模拟的值。 |

例如`/websocket/confirmMsg.js`的内容：

```js
module.exports = function(type) {
  //type就是上面定义的类型。
  switch (type) {
    case 'device_alert':
      return {
        code: 200,
        data: {
          id: '234',
          title: 'Device Alert',
          content: 'device_alert',
          messageType: 'device_alert',
          data: {
            yardId: '123',
            yardName: 'baolishidai',
            yardAddress: 'datong',
            time: 1497403388,
            zoneAlias: 'fangqu',
            zoneNumber: '123',
            zoneType: '3',
            alarmId: '33',
            alarmItemId: '3333'
          }
        }
      };
      break;
    case 'other':
      return {
        code: 200,
        data: {
          id: '234',
          title: 'Device Alert2',
          content: 'device_alert2',
          messageType: 'other',
          data: {
            yardId: '123',
            yardName: 'baolishidai2',
            yardAddress: 'datong2',
            time: 1497403388,
            zoneAlias: 'fangqu',
            zoneNumber: '123',
            zoneType: '3',
            alarmId: '33',
            alarmItemId: '3333'
          }
        }
      };
      break;
  }
  return type;
};
```

#### on

| 参数         | 说明                                       |
| ---------- | ---------------------------------------- |
| confirmMsg | 这个是自定义名字，需要跟开发定好的websocket协议一致，这里配置了模拟的文件路径。 |

项目的public文件夹下的相对路径，这个文件会被运行，返回对应的值，就是模拟的值。

例如`/websocket/confirmMsg.js`

```js
//params是客户端websocket请求带过来的参数。
module.exports = function(params) {
  return {
    code: 200,
    message: 'success'
  };
};
```

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

想要更多的配置，我们可以通过运行 `npm run cover proxy.js`来创建`config/proxy.js`或手动创建文件。

格式与webpack-dev-server  [proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)相同。

**如果代理的是https，没有证书的，需要特殊对待：**

详细的请看[官方api](https://webpack.js.org/configuration/dev-server/#devserver-proxy)。

>A backend server running on HTTPS with an invalid certificate will not be accepted by default. If you want to, modify your config like this:
>
>默认情况下，不会接受在HTTPS上运行无效证书的后端服务器。 如果你想，修改你的配置如下（secure设置为false）：

```json
{
  "name": "app",
  "version": "0.0.1",
  "react-boilerplate-app-scripts": {
   	"proxy": {
      "/api": {
        "target": "https://www.githumb.com",
        "secure": false
      }
   	}
  }
}
```




