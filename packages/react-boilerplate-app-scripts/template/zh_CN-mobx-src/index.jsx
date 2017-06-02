import r2 from 'react-mobx-boilerplate-js/libs/index';
//≤Locale--begin
import zh_CN from 'src/locale/zh_CN';
//≤Locale--end
import routes from './.routes';

var stores = {};
var defaultLocale;
//≤Locale--begin
defaultLocale = zh_CN;
//≤Locale--end

var render = r2(routes, stores, defaultLocale);
render();

if (module.hot) {
  module.hot.accept('./.routes', () => render());
}
