# Just for testing

Make sure the package.json dependencies and devDependencies package is synchronized with `react-boilerplate-scripts-app` and `react-redux-boilerplate-js`.

Run command below to synchronize.

```sh
node ./synchronize.js
cd ../../
npm run bootstap #lerna bootstrap
```

#### test init command

Te same as create-react-boilerplate-app initialization after package installation.The user will not use this command. Just for test.

```sh
npm run init
```

test create-route-reducer(ac for short) command

```sh
npm run ac
```

### test view-locale-to-excel(vlte for short) command

```sh
npm run vlte
```

### test use command

```sh
npm run use less 
npm run use sass
npm run use immutable
```

### test cover command

```sh
npm run cover webpack.config.dev.js
npm run cover webpack.config.prod.js
npm run cover paths.js
npm run cover proxy.js
npm run cover historyApiFallback.js
```

### test build command

```sh
npm run build
```





