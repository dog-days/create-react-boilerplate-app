# Create React Boilerplate App 

Create React Boilerplate apps with redux and react-router boilerplate(less configuration or no configuration).

Create React App works on macOS, Windows, and Linux.

React boilerplate is based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router) for rapid application development.

## Why Use This?

- no webpack config.
- no route configuration ,route generate by command automatically.
- optional package.json config like proxy and history historyApiFallback(use for mock service).
- configuration override function.
- no redux reducer config.
- optional less-loader.
- optional sass-loader.
- optional Immutable.js.
- React,Redux,React-Router, JSX ,ES6 and ES7 decorator syntax support.
- optional breadcrumbs feature.
- optional i18n feature.

## Simple Use

### use with nam

```sh
npm install -g create-react-boilerplate-app
create-react-boilerplate-app my-app
cd my-app/
npm start
```

npm may be slow ,use mirror to solve the problem.[**nrm**](https://github.com/Pana/nrm) is recommended.

nrm can help you easy and fast switch between different npm registries, now include: npm, cnpm, taobao,nj(nodejitsu),rednpm.It depends on you.

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
```

No configuration or complicated folder structures.

You need to refer to [**react-redux-boilerplate-js**](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js) to learn how to just file inside view folder which is your main coding place.

### Use with Command

Once the installation is done, you can run some commands inside the project folder.

yarn command can ignore `run`.

`npm run build` can be `yarn build`.

#### npm || yarn start

Runs the app in development mode.
Open [http://localhost:8888](http://localhost:8888/) to view it in the browser.

The page will be hot reloaded with no refresh if you make edits.
You will see the build success or errors info and lint warnings info in the terminal and console.

#### npm || yarn run create-view(cv for short) 

Creates a new page view template.

options is same as `create-react-boilerplate-app xxxx [options]`.

| short | option       | explain                               |
| ----- | ------------ | ------------------------------------- |
| -h    | --help       | output help message information       |
| -a    | --all        | create view with all features         |
| -i    | --i18n       | create view with locale feature(i18n) |
| -b    | --breadcrumb | create view with breadcrumb feature   |

#### npm || yarn run create-route-reducer(ac for short)

Creates routes and reducers base on the _route.js and reducer.js files.\_route.js and reducer.js rules refer to [**react-redux-boilerplate-js**](https://github.com/dog-days/create-react-boilerplate-app/tree/master/packages/react-redux-boilerplate-js) .

`npm run ac -- -w` is watch mode.

#### npm || yarn run excel-to-locale-config(etlc for short)

The command is base on `npm run create-route-reducer`.

Creates i18n to xx .js(like en_US.js) by reading excel witch is translated.

#### npm || yarn run build

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### Use Less

```sh
create-react-boilerpalte-app use less
```

After installation,run `npm start` and it will works.

### Use Sass

Run command below and must use with `--save`.

```sh
create-react-boilerpalte-app use sass
```

After installation,run `npm start` and it will works.

### Use Immutable.js

Run command below and must use with `--save` and version.

```sh
create-react-boilerpalte-app use immutable
```

After installation,run `npm start` and it will works.

### Mock

Mock is base on webpack-dev-server historyApiFallback.For example,there is a api link `http://www.github.com/api/test`.But at the very beginning,the link is not valid .We want it be mocked in `./public/mock`.We can use the config in package.json below.

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

the `rewrites` is a little different to webpack-dev-server.It will be convered to the code below.

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

```js
module.exports = {
  "/api": "http://www.githumb.com"
}
```

Please refor to [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback#rewrites).

### Proxy

In development mode ,the api link provided by back-end,will encountered cross-domain issues.Proxy can solve the problem.

Proxy is base on webpack-dev-server proxy.For example,there is a api link `http://www.github.com/api/test` witch did work.We proxy `www.github.com`.We can use the config in package.json below.Because of package.json we only can use string to proxy config.

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

```js
module.exports = {
  "/api": "http://www.githumb.com"
}
```

## Philosophy

- **No Configuration Required**

  React Boilerplate App can work with no configuration. Reasonably good configuration of both development and production builds is handled for you so you can focus on writing code.

- **Package.json Configuration**

  package.json configuration is optional.

- **Configuration Override**

  We can custom all the config file.For example you can only override webpack.config.dev.js.







