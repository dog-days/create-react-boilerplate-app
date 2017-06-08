let routeConfig = {
  //it's react-router's business.
  //it' just for binding layout,when using `npm run ac`.
  //it's only one palce different from react-router.
  //refer to api.
  layout: 'main',
  //code spliting
  getComponent(location, cb) {
    require.ensure(
      [],
      require => {
        cb(null, require('./index').default);
      },
      'index'
    ); //code spliting name.
  },
  //indexRoute do not need path
};
//react-hot-loader is not work with react-router code spliting.
//so it is.
//getComponent above will be covered.
if (module.hot) {
  routeConfig.component = require('./index').default;
}
export default routeConfig;
