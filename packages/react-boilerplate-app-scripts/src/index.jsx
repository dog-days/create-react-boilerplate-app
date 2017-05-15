import r2 from "react-redux-boilerplate-js/libs/index";
import defaultLocale from 'src/locale/en_US';
import routes from './.routes';
import reducers from './.reducers'

var render = r2(routes,reducers,defaultLocale);
render();

if (module.hot) {
  module.hot.accept(
    './.routes',
    () => render()
  );
  module.hot.accept(
    './.reducers',
    () => render()
  );
}
