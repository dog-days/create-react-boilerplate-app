'use strict';
//deal with prefix url
import path from 'react-redux-boilerplate-js/libs/path'

//The config is the same as react-router@3.x.x.
//If you do not understand,please refer to react-router.
//It's the first level route,the component defined as layout in view/layout/xxx.
export default {
  //index page url path.
  //because not all the web app is in web root dir,it might be in the root child dir.
  //for example,PREFIX_URL = `/demo`，访问网站根目录demo文件中的web app
  //PREFIX_URL is read from package.json field 'react-boilerplate-app-scripts'
  //if you do not use the prefix url function,the path can can be '/'.
  path: path('/'),
  component: require('./index').default,
  //index page
  //you can change the path of indexRoute,if you don't like.
  indexRoute: require('src/view/index/_route.js').default,
  //childRoutes is the second route,which defined in the view/xxx.
  //.child_routes.js is is hidden file which is created automatically.
  //So you should not eidit the .child_routes.js.
  childRoutes: require('./.child_routes.js').default,
}
