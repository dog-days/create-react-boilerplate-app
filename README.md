# Create React Boilerplate App 

Create React Boilerplate apps with redux and react-router boilerplate(no configuration or less configuration).

Create React App works on macOS, Windows, and Linux.

React boilerplate is based on [React@15.5.4](https://facebook.github.io/react/), [Redux@3.5.2](https://github.com/reactjs/redux), [React Router@3.0.0](https://github.com/reactjs/react-router) for rapid application development.

If something doesn’t work please [file an issue](https://github.com/dog-days/create-react-boilerplate-app/issues/new).
## Why Use This?

- no webpack configuration.
- no route configuration ,route generate by command automatically.
- no redux reducer config.
- optional less-loader.
- optional sass-loader.
- optional Immutable.js.
- optional package.json config such as proxy and history historyApiFallback(use for mock service).
- configuration override function.
- React,Redux,React-Router, JSX ,ES6 and ES7 decorator syntax support.
- optional breadcrumbs feature.
- optional i18n feature.
- development  mock services
- development proxy services

## Docs

- [中文 README](https://github.com/dog-days/create-react-boilerplate-app/blob/master/README-zh_CN.md)
- [English README](https://github.com/dog-days/create-react-boilerplate-app/blob/master/README.md)
- [react-redux-pieplate-js](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js)

## Simple Use

### use with npm

```sh
npm install -g create-react-boilerplate-app
create-react-boilerplate-app my-app
cd my-app/
npm start
```

npm may be slow ,use mirror to solve the problem.[**nrm**](https://github.com/Pana/nrm) is recommended.

nrm can help you easy and fast switch between different npm registries, now include: npm, cnpm, taobao,nj(nodejitsu),rednpm.

```sh
npm install -g nrm
nrm use taobao ## switch to https://registry.npm.taobao.org/
```

### use with yarn

```sh
yarn global add create-react-boilerplate-app
create-react-boilerplate-app my-app
cd my-app/
yarn start
```

switch yarn registries

```sh
yarn config set registry https://registry.npm.taobao.org
```

## Getting Started

### Installation

```sh
npm install -g create-react-boilerplate-app
# or 
# yarn global add create-react-boilerplate-app
```

**You’ll need to have Node >= 6 on your machine**. You can use [nvm](https://github.com/creationix/nvm#usage) to easily switch Node versions between different projects.

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# install latest node,and node can be used immediately without restarting the terminal.
nvm install node && nvm alias default node
#install node v6.0.0
nvm isntall 6.0.0
#switch node to v6.0.0
nvm use 6.0.0
```

In the windows platform,you should download [nvm-setup.zip](https://github.com/coreybutler/nvm-windows/releases/download/1.1.4/nvm-setup.zip) from [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases).

### Creating an App

```sh
create-react-boilerplate-app my-app
cd my-app
```

`create-react-boilerplate-app xxx [options]`

| short | options      | explain                               |
| ----- | ------------ | ------------------------------------- |
| -h    | --help       | output help message information       |
| -a    | --all        | create view with all features         |
| -i    | --i18n       | create view with locale feature(i18n) |
| -b    | --breadcrumb | create view with breadcrumb feature   |

It will create a directory called `my-app` inside the current folder.
Inside that directory, it will generate the initial project structure and install the dependencies on the need:

```sh
my-app/
  .gitignore
  node_modules/
  package.json
  public/
    favicon.ico
    index.html
  src/
    #created automatically
    .redcers.js
    #created automatically
    .routes.js
    #app entry
    index.jsx 
    #created according to options.
    #i18n folder
    locale/
    #css and image
    style/ 
    #layout and page view,you main coding palce.
    view/
      layout/
        main/
          index.jsx
          _route.js
          #generated automatically
          .child_routes.js
      #for example
      about/
        index.jsx
        _route.js
        #redux reducer coding place
        #After runing `npm run ac`, the reducer function will be read to `src/.reducers.js`.
        reducer.js
```

No configuration or complicated folder structures.

You need to refer to [**react-redux-boilerplate-js**](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js) to learn how to just file inside view folder which is your main coding place.

### Usage of View

#### Layout Mode

Layout is a special kind of view, here is the first layer of react-router components, view is its sub-components. Take a layout folder as an example:

The layout includes the following necessary files.

- _route.js, used as a single route configuration, can be modified, but must follow the following format.

```jsx
export default {
  path: '/',
  //layout component
  component: require('./index').default,
  //default hompage setting
  indexRoute: require('src/view/index/_route.js').default,
  //child route component，the view component.
  childRoutes: require('./.child_routes.js').default,
}
```

- `src/view/index.jsx`，used in _route.js above.

```jsx
import React from 'react'

class LayoutView extends React.Component {
  render(){
  }
}
export default LayoutView; 
```

- .child_routes.js

  `.child_routes.js ` is a hidden file, automatically generated.

#### Page View Mode

View is the main place where we code, the following files are necessary, you can also use action.js and reducer.js if necessary.

- `_route.js`，二级路由（如果没有layout就是一级路由），可自行修改，但务必按照以下格式。

```jsx
//react-router configuration,please refer to react-router@3.x.x.
export default {
  //It' just for binding layout,when using `npm run ac`.
  //It's only one palce different from react-router.
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

reducer写法跟Redux的一致，但是因为项目需要使用到`npm run ac`自动保定reducer方法。所以定义了以下规则：

reducer.js格式如下（export格式）:

Reducer written with Redux consistent, but because the project needs to use `npm run ac` extract and save the reducer method. So the following rules are defined:

Reducer.js format is as follows (`export function` format):

```jsx
export function origin(state = {}, action) {
  switch (action.type) {
    case RECIEVEORIGIN:     
    default:
      return state;
  }
}
```

Do not use the following format, although it is valid, but it does not support the intelligent identification of this format.

```jsx
module.exports = {
  origin(state,action){}
}
```

This does not work too, please make sure that `export ` is in line with the `function` keyword.

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

### Use with Command

Once the installation is done, you can run some commands inside the project folder.

yarn command can ignore `run`.

`npm run build` can be `yarn build`.

#### npm || yarn start

Runs the app in development mode.
Open [http://localhost:8888](http://localhost:8888/) to view it in the browser.

The page will be hot reloaded with no refresh if you make edits.
You will see the build success or errors info and lint warnings info in the terminal and browser console.

#### npm || yarn run create-view(cv for short) 

Generate a new page view template in the `view` folder.

options is same as `create-react-boilerplate-app xxxx [options]`.

| short | option       | explain                               |
| ----- | ------------ | ------------------------------------- |
| -h    | --help       | output help message information       |
| -a    | --all        | create view with all features         |
| -i    | --i18n       | create view with locale feature(i18n) |
| -b    | --breadcrumb | create view with breadcrumb feature   |

#### npm || yarn run create-route-reducer(ac for short)

Creates routes and reducers( combine reducers) base on the _route.js and reducer.js files.

\_route.js and reducer.js rules refer to [**react-redux-boilerplate-js**](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js) .

`npm run ac -- -w` is watch mode.

#### npm || yarn run view-locale-to-excel(vlte for short)

Create an i18n excel by reading the files in the src folder (matching xx characters via this.t ("xx")).

#### npm || yarn run excel-to-locale-config(etlc for short)

The command is base on `npm run create-route-reducer`.

Generate xx.js (such as en_US.js) by reading the translated excel.

#### npm || yarn run use `<feature-name`>

Use a feature such as less,sass and immutable.js.

Run `npm run use -- -l` to see the available feature lists..

#### npm || yarn run cover `<file-name`>

Overwrite the configuration file, such as webpack.config.dev.js.

Run `npm run cover -- -l` to see the file lists which can be covered.

#### npm || yarn run build

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes(prevent each version of the old version cache problem).

### Use optional features

#### Use Less

```sh
npm run use less
#or
#yarn use less
```

Command above will install `less` and `less-loader`.

After installation,run `npm start` and it will works.

#### Use Sass

```sh
npm run use sass
#or
#yarn use sass
```

Command above will install `node-sass` and `sass-loader`.

After installation,run `npm start` and it will works.

#### Use Immutable.js

```sh
npm run use immutable
#or
#yarn use immutable
```

Command above will install `immutable@3.8.1` and `redux-immutable@3.0.6`.

After installation,run `npm start` and it will works(see the output information of the redux-logger in the browser console).

### Package.json of react-boilerplate-app-scripts Configuration

In creating a new app project, package.json will have the react-boilerplate-app-scripts default configuration.

```json
...
"react-boilerplate-app-scripts": {
  "language": "en_US"
},
...
```

React-boilerplate-app-scripts has the following configuration options:

- appSrcPath

  App program directory (relative to the root directory), the default value is `src`. 

  If not necessary, it is recommended not to change.it can be ignored.

- language

  It will be used in the `npm run view-to-locale-excel` to generate the first line of excel characters.

  If our default language is in Chinese, that `language` should be `zh_xx `(such as zh_CN).

  `language` characters  generation is based on the terminal language package.(Windows defaults to en_US, currently incompatible).

- host

  Development service host, the default value is localhost.

  If not necessary, it is recommended not to change.it can be ignored.

- port

  Development service listening port, default value 8888.

  If the port conflicts, the program will automatically change to other ports.

  If not necessary, it is recommended not to change.it can be ignored.

- routesPath

  Route configuration file path, `npm run ac` command will read the path. The default value is `${src}/.routes.js`, where `${src}` is replaced with the `appSrcPath` value above.

  If not necessary, it is recommended not to change.it can be ignored.

- reducersPath

  The reducers configuration file path which passed to the rudux store, `npm run ac` command will read the path. The default value is `${src}/.routes.js`, where `${src}` is replaced with the `appSrcPath` value above.

  If not necessary, it is recommended not to change.it can be ignored.

- appEntryPath

  App program js entry file path, the default value is `${src}/index.jsx`。

  If not necessary, it is recommended not to change.it can be ignored.

- appPublicPath

  Webpack-dev-server static resource access directory (relative to the root directory), the default value is `public`。

  If not necessary, it is recommended not to change.it can be ignored.

- appLocalePath

  Multi-language folder path, `npm run view-to-locale-excel` will read the path.

  If not necessary, it is recommended not to change.it can be ignored.

- index

  App entry html file in the `appPublicPath` folder above.

- proxy

  Please refer to the follow-up **Proxy**, the default value is undefined, this function may be more commonly used.

- historyApiFallback

  Please refer to the follow-up **Mock**, the default value is undefined, this function may be more commonly used.

- prefixURL

  Because some sites visit the web app is not in the root directory, may be the root directory of the folder, `prefixUR` is used to set this situation.
  For example, `/demo` visits the web app in the web directory demo file.

### Configuration Override

In the current creation of the app, we can also cover the configuration.The following configuration file can be covered:

- webpack.config.dev.js

  Developmen webpack configuration file.

- webpack.config.prod.js

  Production webpack configuration file.

- paths.js

  The path configuration file is roughly as follows:

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

  Please refer to the following **Proxy** function.

- historyApiFallback.js

  Please refer to the following **Mock** function.

We can run `npm run cover - -l` to see a list of files that can be overwritten.

We can run the following command to create:

```sh
npm run cover <file-name>
#yarn use <file-name>
```

### Mock

Mock is base on webpack-dev-server historyApiFallback.For example,there is a api link `http://www.github.com/api/test`.But at the very beginning,the link is not valid .We want it be mocked in `./public/mock`.We can use the config in package.json below.

The public folder is the default set of webpack-dev-server static resource access directories.

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

Make a test.json file in `./public/mock`.

After the development  environment started,then you can visit `http://localhost:8888/api/test.js` to get api json contents.

The `rewrites` is a little different to webpack-dev-server（package.json can only use string.）.It will be convered to the code below.

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

Want more config,we can create `config/historyApiFallback.js` by running `yarn || npm run cover historyApiFallback.js` or create the file manually.

The format is same as webpack-dev-server [historyApiFallback](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback).

Please refer to [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback#rewrites).

### Proxy

In development mode ,the api link provided by back-end,will encountered cross-domain issues.Proxy can solve the problem.

Proxy is base on webpack-dev-server proxy.For example,there is a api link `http://www.github.com/api/test` witch did work.We proxy `www.github.com`.We can use the configuration in package.json below.Because of package.json we only can use string to proxy configuration.

The public folder is the default set of webpack-dev-server static resource access directories.

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

After the development  environment started,then you can visit `http://localhost:8888/api/test.js` to get api json contents.

Want more config,we can create `config/proxy.js` by running `yarn || npm run cover proxy.js`  or create the file manually.

The format is same as webpack-dev-server [proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy).

## Concept

- **No Configuration Required**

  React Boilerplate App can work with no configuration. Reasonably good configuration of both development and production builds is handled for you so you can focus on writing code.

- **Package.json Configuration**

  package.json configuration is optional,but it is convenient.

- **Configuration Override**

  We can custom all the config file.For example, you can cover only webpack.config.dev.js.







