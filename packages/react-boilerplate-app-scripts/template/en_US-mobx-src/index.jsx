import r2 from 'react-mobx-boilerplate-js/libs/index';
//≤Locale--begin
import en_US from 'src/locale/en_US';
//≤Locale--end
import routes from './.routes';

var stores = {};
var defaultLocale;
//≤Locale--begin
defaultLocale = en_US;
//≤Locale--end

var render = r2(routes, stores, defaultLocale);
render();

if (module.hot) {
  module.hot.accept('./.routes', () => render());
}
