//deal with prefix url
import path from 'react-redux-boilerplate-js/libs/path';

//route配置请参考react-router@3.x.x
export default {
  //url路径设置
  //因为不是所有的web app都是在web根目录，它可能在根目录的子文件夹中。
  //例如，PREFIX_URL = `/demo`,访问网站根目录demo文件中的web app。
  //PREFIX_URL读取与package.json的字段'react-boilerplate-app-scripts'。
  //如果你使用prefix url功能，path可以是’/about‘。
  path: path('/'),
  component: require('./index').default,
  //主页
  indexRoute: require('src/view/index/_route.js').default,
  //childRoutes 二级路由, 定义在view/xxx/_rout.js目录中。
  //.child_routes.js是个自动创建的隐藏文件
  //所有不要修改该文件。
  childRoutes: require('./.child_routes.js').default,
};
