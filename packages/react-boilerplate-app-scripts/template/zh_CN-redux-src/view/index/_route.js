let routeConfig = {
  //这是是为了绑定layout，当使用`npm run ac'时，会读取该值。
  //这是唯一跟react-router不同的地方，是我们自定义的。 //refer to api.
  layout: 'main',
  //code spliting
  getComponent(location, cb) {
    require.ensure(
      [],
      require => {
        cb(null, require('./index').default);
      },
      'index'
    ); //代码分离命名.
  },
  //indexRoute不需要path设置。
};
//热替换在react-router中代码分离并不生效。
//所以就有了下面的代码。
//上面的getComponent会被覆盖。
if (module.hot) {
  routeConfig.component = require('./index').default;
}
export default routeConfig;
