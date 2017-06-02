import r2 from 'react-redux-boilerplate-js/libs/index';
//≤Locale--begin
import zh_CN from 'src/locale/zh_CN';
//≤Locale--end
import routes from './.routes';
import reducers from './.reducers';

var defaultLocale;
//≤Locale--begin
defaultLocale = zh_CN;
//≤Locale--end

var render = r2(routes, reducers, defaultLocale);
render();

if (module.hot) {
  module.hot.accept('./.routes', () => render());
  module.hot.accept('./.reducers', () => render());
}
