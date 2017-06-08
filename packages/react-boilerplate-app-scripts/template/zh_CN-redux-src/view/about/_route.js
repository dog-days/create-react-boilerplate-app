//处理prefix url
import path from 'react-redux-boilerplate-js/libs/path';

//route配置请参考react-router@3.x.x
let routeConfig = {
  //这是是为了绑定layout，当使用`npm run ac'时，会读取该值。
  //这是唯一跟react-router不同的地方，是我们自定义的。 //refer to api.
  layout: 'main',
  //url路径设置
  //因为不是所有的web app都是在web根目录，它可能在根目录的子文件夹中。
  //例如，PREFIX_URL = `/demo`,访问网站根目录demo文件中的web app。
  //PREFIX_URL读取与package.json的字段'react-boilerplate-app-scripts'。
  //如果你使用prefix url功能，path可以是’/about‘。
  path: path('/about'),
  //代码分离
  getComponent(location, cb) {
    require.ensure(
      [],
      require => {
        cb(null, require('./index').default);
      },
      'about'
    ); //代码分离命名.
  },
};
//热替换在react-router中代码分离并不生效。
//所以就有了下面的代码。
//上面的getComponent会被覆盖。
if (module.hot) {
  routeConfig.component = require('./index').default;
}
export default routeConfig;
