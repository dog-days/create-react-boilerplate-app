import r2 from 'react-redux-boilerplate-js/libs/index';
//≤Locale--begin
import en_US from 'src/locale/en_US';
//≤Locale--end
import routes from './.routes';
import reducers from './.reducers';

var defaultLocale;
//≤Locale--begin
defaultLocale = en_US;
//≤Locale--end

var render = r2(routes, reducers, defaultLocale);
render();

if (module.hot) {
  module.hot.accept('./.routes', () => render());
  module.hot.accept('./.reducers', () => render());
}
