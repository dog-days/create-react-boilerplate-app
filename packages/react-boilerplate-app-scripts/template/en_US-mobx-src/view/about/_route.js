//deal with prefix url
import path from 'react-mobx-boilerplate-js/libs/path';

//react-router configuration,please refer to react-router@3.x.x.
let routeConfig = {
  //It' just for binding layout,when using `npm run ac`.
  //It's only one palce different from react-router.
  //refer to api.
  layout: 'main',
  //Url path setting
  //Because not all the web app is in web root dir,it might be in the root child dir.
  //For example,PREFIX_URL = `/demo`，访问网站根目录demo文件中的web app
  //PREFIX_URL is read from package.json field 'react-boilerplate-app-scripts'
  //If you do not use the prefix url function,the path can be '/about'.
  path: path('/about'),
  //code spliting
  getComponent(location, cb) {
    require.ensure(
      [],
      require => {
        cb(null, require('./index').default);
      },
      'about'
    ); //code spliting name.
  },
};
//react-hot-loader is not work with react-router code spliting.
//so it is.
//getComponent above will be covered.
if (module.hot) {
  routeConfig.component = require('./index').default;
}
export default routeConfig;
