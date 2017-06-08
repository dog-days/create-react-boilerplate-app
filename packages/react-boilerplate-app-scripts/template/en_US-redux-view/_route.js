//deal with prefix url
import path from 'react-redux-boilerplate-js/libs/path';

let routeConfig = {
  //it's react-router's business.
  //it' just for binding layout,when using `npm run ac`.
  //it's only one palce different from react-router.
  //refer to api.
  layout: 'main',
  //url path setting
  //because not all the web app is in web root dir,it might be in the root child dir.
  //for example,PREFIX_URL = `/demo`，visit web root demo folder web app.
  //PREFIX_URL is read from package.json field 'react-boilerplate-app-scripts'
  //if you do not use the prefix url function,the path can can be '/${pageName}'.
  path: path('/${pageName}'),
  //code spliting
  getComponent(location, cb) {
    require.ensure(
      [],
      require => {
        cb(null, require('./index').default);
      },
      '${pageName}'
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
